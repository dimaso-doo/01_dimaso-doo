import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { z } from "zod";
import { detectDimasoBotIntent, detectLeadCapture, extractContact, generateDimasoBotReply, visitorIpMetadata } from "@/lib/dimasobot/rag";
import { appendDimasoBotRecord, hasPersistentDimasoBotStorage } from "@/lib/dimasobot/storage";
import { maxUploadSize, uploadLimitLabel } from "@/lib/upload-limits";

export const runtime = "nodejs";

const schema = z.object({
  intent: z.enum(["general", "info", "offer", "rfp", "contact"]),
  name: z.string().trim().max(120).optional(),
  company: z.string().trim().max(160).optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().max(60).optional(),
  message: z.string().trim().min(1).max(20000),
  pageUrl: z.string().trim().max(500).optional(),
  conversation: z.string().trim().max(100000).optional(),
  visitorId: z.string().trim().max(120).optional(),
  referrer: z.string().trim().max(500).optional(),
  timezone: z.string().trim().max(120).optional(),
  language: z.string().trim().max(80).optional(),
});

const allowedExtensions = new Set(["pdf", "doc", "docx", "xls", "xlsx", "txt", "zip"]);
const dataDir = path.join(process.cwd(), "data");
const uploadsDir = path.join(dataDir, "dimasobot-uploads");

function safeUploadName(originalName: string) {
  const extension = originalName.split(".").pop()?.toLowerCase() || "";
  const baseName = originalName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "attachment";
  return { extension, fileName: `${Date.now()}-${randomUUID()}-${baseName}.${extension}` };
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const fields = Object.fromEntries([...form.entries()].filter(([, value]) => typeof value === "string"));
    const parsed = schema.safeParse(fields);
    if (!parsed.success) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

    const data = parsed.data;

    const file = form.get("file");
    let upload: { originalName: string; storedName: string; size: number; type: string } | null = null;

    if (file instanceof File && file.size > 0) {
      const { extension, fileName } = safeUploadName(file.name);
      if (file.size > maxUploadSize) return NextResponse.json({ error: `Please attach a file up to ${uploadLimitLabel}.` }, { status: 413 });
      if (!allowedExtensions.has(extension)) return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
      if (process.env.VERCEL) return NextResponse.json({ error: "Please send your brief through the contact form at /contact so it reaches our team." }, { status: 503 });

      try {
        await mkdir(uploadsDir, { recursive: true });
        await writeFile(path.join(uploadsDir, fileName), Buffer.from(await file.arrayBuffer()));
      } catch (error) {
        console.error("DimasoBot upload persistence failed", error);
        return NextResponse.json({ error: "Unable to save the attachment. Please use the contact form at /contact." }, { status: 503 });
      }
      upload = { originalName: file.name, storedName: fileName, size: file.size, type: file.type || "application/octet-stream" };
    }

    const fullConversationText = `${data.conversation || ""}\n${data.message}`;
    const contact = extractContact(fullConversationText);
    const email = data.email || contact.email;
    const phone = data.phone || contact.phone;
    const leadCapture = detectLeadCapture(fullConversationText, { name: data.name, company: data.company, email, phone });
    const detectedIntent = detectDimasoBotIntent(data.message, Boolean(upload));
    const intent = data.intent === "contact" && detectedIntent !== "contact" ? detectedIntent : data.intent;
    const canSave = !process.env.VERCEL || hasPersistentDimasoBotStorage();
    const rag = await generateDimasoBotReply({ message: data.message, intent, hasContact: Boolean(email || phone), hasFile: Boolean(upload), leadCapture, canSave });
    const visitorMeta = {
      visitorId: data.visitorId || "",
      pageUrl: data.pageUrl || "",
      referrer: data.referrer || req.headers.get("referer") || "",
      userAgent: req.headers.get("user-agent") || "",
      language: data.language || req.headers.get("accept-language") || "",
      timezone: data.timezone || "",
      ...visitorIpMetadata(req),
    };
    const createdAt = new Date().toISOString();
    const conversationId = randomUUID();

    const lead = {
      id: conversationId,
      createdAt,
      source: "DimasoBot",
      intent,
      name: data.name || "Anonymous visitor",
      company: data.company || "",
      email,
      phone,
      message: data.message,
      pageUrl: data.pageUrl || "",
      conversation: data.conversation || "",
      botReply: rag.reply,
      model: "model" in rag ? rag.model : "local-rag",
      sources: rag.sources.map((source) => ({ title: source.title, url: source.url })),
      leadCapture,
      visitor: visitorMeta,
      upload,
      status: leadCapture.isComplete ? "ready-for-handoff" : "new",
    };
    const messagePair = {
      conversationId,
      createdAt,
      userMessage: data.message,
      botReply: rag.reply,
      model: "model" in rag ? rag.model : "local-rag",
      sources: lead.sources,
      leadCapture,
      intent,
      upload,
      visitor: visitorMeta,
    };

    const conversationSaved = canSave && await appendDimasoBotRecord("conversations", lead);
    const messagesSaved = canSave && await appendDimasoBotRecord("messages", messagePair);
    const leadSaved = canSave && await appendDimasoBotRecord("leads", lead);
    const saved = Boolean(conversationSaved && messagesSaved && leadSaved);
    if (saved) console.info("DimasoBot lead saved", { id: lead.id, status: lead.status, intent: lead.intent });
    const needsHandoff = Boolean(email || phone) || intent === "contact" || intent === "rfp" || /saved|sačuv|sacuv/i.test(rag.reply);
    const reply = !saved && needsHandoff
      ? /[а-яђћчшжљњ]|\b(hvala|kontakt|ponuda|sajt|moze|može|aplikacij)/i.test(data.message)
        ? "Razgovor nije sačuvan za tim. Za odgovor ili slanje briefa koristite [kontakt formu](/contact)."
        : "This conversation has not been saved for our team. To request a reply or send a brief, please use our [contact form](/contact)."
      : rag.reply;
    return NextResponse.json({ ok: true, id: lead.id, reply, sources: lead.sources, saved });
  } catch {
    return NextResponse.json({ error: "Unable to save lead" }, { status: 500 });
  }
}


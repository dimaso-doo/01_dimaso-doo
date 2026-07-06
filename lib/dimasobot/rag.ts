import { createHash } from "crypto";
import { readFile } from "fs/promises";
import path from "path";
import { retrieveDimasoKnowledge, type DimasoKnowledgeSource } from "@/lib/dimasobot/embeddings";
import { buildDimasoKnowledgeChunks } from "@/lib/dimasobot/knowledge";

export type DimasoBotIntent = "general" | "info" | "offer" | "rfp" | "contact";
export type LeadCapture = {
  hasNameOrCompany: boolean;
  hasEmail: boolean;
  hasPhone: boolean;
  hasPreferredContact: boolean;
  missing: string[];
  isComplete: boolean;
};

type KnowledgeItem = {
  title: string;
  url: string;
  text: string;
  score?: number;
  type?: string;
};

const stopWords = new Set(["the", "and", "for", "with", "that", "this", "you", "your", "are", "can", "how", "what", "need", "help", "about", "from", "into", "have", "want", "does", "dimaso"]);
const coreKnowledge: KnowledgeItem[] = buildDimasoKnowledgeChunks().map(({ title, url, text, type }) => ({ title, url, text, type }));

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}0-9\s+.-]/gu, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function scoreItem(queryTokens: string[], item: KnowledgeItem) {
  const itemText = `${item.title} ${item.text}`.toLowerCase();
  const titleText = item.title.toLowerCase();
  const baseScore = queryTokens.reduce((score, token) => {
    if (!itemText.includes(token)) return score;
    return score + (titleText.includes(token) ? 4 : 1);
  }, 0);
  return baseScore
    + (queryTokens.includes("wordpress") && titleText.includes("wordpress") ? 6 : 0)
    + (queryTokens.some((token) => ["usa", "us", "llc", "wyoming", "america", "american"].includes(token)) && titleText.includes("us presence") ? 10 : 0);
}

async function recentMemory(queryTokens: string[]) {
  try {
    const memoryPath = path.join(process.cwd(), "data", "dimasobot-memory.jsonl");
    const raw = await readFile(memoryPath, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .slice(-80)
      .map((line) => JSON.parse(line) as { userMessage?: string; botReply?: string; intent?: string })
      .map((item) => ({
        title: `Past ${item.intent || "chat"} conversation`,
        url: "/admin/dimasobot",
        text: `${item.userMessage || ""} ${item.botReply || ""}`,
      }))
      .map((item) => ({ item, score: scoreItem(queryTokens, item) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map(({ item }) => item);
  } catch {
    return [];
  }
}

function answerSnippet(item: KnowledgeItem) {
  const providesSentence = item.text.match(/Dimaso provides[^.]+\./)?.[0];
  if (providesSentence) return providesSentence;
  return item.text
    .split(". ")
    .map((sentence) => sentence.trim())
    .find((sentence) => sentence.length > 80 && !sentence.startsWith(item.title)) || item.text.slice(0, 220);
}

function detectLanguageInstruction(text: string) {
  if (/[а-яђћчшжљњ]/i.test(text)) return "Reply in Serbian Cyrillic unless the visitor switches language.";
  if (/\b(ćao|cao|šta|sta|kako|koliko|ponuda|sajt|vebsajt|websajt|domen|odrzavanje|održavanje|kontakt|moze|može|firma|bavi|zelim|želim|nemam|kosta|košta)\b/i.test(text)) return "Reply in Serbian Latin unless the visitor switches language.";
  if (/\b(hola|gracias|precio|sitio|ayuda)\b/i.test(text)) return "Reply in Spanish unless the visitor switches language.";
  if (/\b(bonjour|merci|prix|site|aide)\b/i.test(text)) return "Reply in French unless the visitor switches language.";
  if (/\b(hallo|danke|preis|webseite|hilfe)\b/i.test(text)) return "Reply in German unless the visitor switches language.";
  return "Reply in the same language the visitor uses. If unsure, reply in English.";
}

function detectedLanguage(text: string) {
  if (/[а-яђћчшжљњ]/i.test(text)) return "sr-cyrl";
  if (/\b(ćao|cao|šta|sta|gde|gdje|kako|koliko|ponuda|sajt|vebsajt|websajt|domen|odrzavanje|održavanje|kontakt|kontaktirajte|telefon|mejl|najbolje|moze|može|firma|bavi|čime|cime|ko si|ko ste|zelim|želim|nemam|kosta|košta)\b/i.test(text)) return "sr-latn";
  return "en";
}

function isIdentityQuestion(text: string) {
  return /\b(who are you|what are you|who is this|who are u|what is dimasobot|ko si|ko ste|sta si|šta si|ko je ovo|sta je dimasobot|šta je dimasobot)\b/i.test(text);
}

function isWebsitePriceQuestion(text: string) {
  return /\b(price|pricing|cost|estimate|quote|new website|website build|domain|cena|cijena|košta|kosta|koliko|novi sajt|nov sajt|novi vebsajt|nov vebsajt|websajt|vebsajt|web sajt|domen|izrada sajta|pravljenje sajta)\b/i.test(text);
}

function isLocationQuestion(text: string) {
  return /\b(where are you|where is dimaso|where are you based|location|based in|odakle ste|gde ste|gdje ste|gde je dimaso|gdje je dimaso|lokacija|srbija|serbia|amerika|america|usa|us llc)\b/i.test(text);
}

function isSupportRecommendationQuestion(text: string) {
  return /\b(wordpress|maintenance|održavanje|odrzavanje|development|develop|razvoj|web development|podrška|podrska|retainer|mesečna|mesecna|mjesečna|preporu|recommend|treba nam|potrebno nam|šta biste|sta biste)\b/i.test(text)
    && /\b(wordpress|maintenance|održavanje|odrzavanje|development|develop|razvoj|podrška|podrska|retainer|sajt|website)\b/i.test(text);
}

function isProjectContextMessage(text: string) {
  return /\b(firma je|kompanija je|company is|we are|imamo|nemamo|elementor|contact forms?|kontakt form|kontaktne form|forme za upit|upit form|interni web tim|internal web team|sitne izmene|small changes)\b/i.test(text);
}

function isNonprofitMaintenanceQuestion(text: string) {
  return /\b(nonprofit|non-profit|foundation|donation|donations|donate|donor|volunteer|neprofit|fondacija)\b/i.test(text)
    && /\b(wordpress|maintenance|monthly|support|qa|form|technical seo|seo|cleanup|održavanje|odrzavanje)\b/i.test(text);
}

function isEcommerceSupportQuestion(text: string) {
  return /\b(woocommerce|ecommerce|e-commerce|online store|store|checkout|cart|payment|product pages?|tracking|analytics|mobile speed|shop|prodavnic|plaćanje|placanje|korpa)\b/i.test(text)
    && /\b(help|support|fix|fails?|unreliable|slow|performance|seo|integrations?|can dimaso|može|moze|problem)\b/i.test(text);
}

function isSaaSPerformanceQuestion(text: string) {
  return /\b(saas|b2b|marketing site|landing pages?|core web vitals|cwv|performance|slow|pagespeed|page speed|hubspot|forms?|publish|layouts?|conversion|lead gen|lead generation)\b/i.test(text)
    && /\b(wordpress|website|site|help|support|fix|improve|can dimaso|hard to update|breaking layouts?|technical partner)\b/i.test(text);
}

function leadAsk(language: string, leadCapture: LeadCapture) {
  if (leadCapture.isComplete) {
    return language === "sr-latn" || language === "sr-cyrl"
      ? "Imam dovoljno za Dimaso tim. Ako želite, dodajte još URL, okviran rok ili 2-3 stranice/funkcije koje su vam važne."
      : "I have enough for the Dimaso team. If you want, add the URL, target timeline, or 2-3 important pages/features.";
  }
  if (language === "sr-latn" || language === "sr-cyrl") {
    const labels: Record<string, string> = {
      "name or company": "ime ili firmu",
      email: "email",
      phone: "telefon",
      "preferred contact method": "kako želite da vas kontaktiramo",
    };
    return `Da bih predao Dimaso timu za procenu, pošaljite još: ${leadCapture.missing.map((item) => labels[item] || item).join(", ")}.`;
  }
  return `To hand this to the Dimaso team for an estimate, please send: ${leadCapture.missing.join(", ")}.`;
}

function sourceContext(sources: KnowledgeItem[]) {
  return sources.map((source, index) => {
    const score = typeof source.score === "number" ? ` | relevance ${source.score.toFixed(3)}` : "";
    return `Source ${index + 1}: ${source.title} (${source.url}${score})\n${source.text.slice(0, 1200)}`;
  }).join("\n\n");
}

async function generateWithModel(input: {
  message: string;
  intent: DimasoBotIntent;
  hasContact: boolean;
  hasFile: boolean;
  leadCapture: LeadCapture;
  sources: KnowledgeItem[];
}) {
  if (!process.env.OPENAI_API_KEY) return "";
  const model = process.env.DIMASOBOT_MODEL || "gpt-5.2";
  const prompt = [
    "You are DimasoBot, a concise website support assistant for Dimaso.",
    detectLanguageInstruction(input.message),
    "Use the provided Dimaso context and prior memory. Do not invent prices, guarantees, legal commitments, or delivery deadlines.",
    "Prefer the provided Dimaso website sources over general knowledge. If the sources do not contain the answer, say what is known and ask one clarifying question instead of guessing.",
    "When answering questions about Dimaso services, process, industries, case studies, blog topics, US presence, or RFPs, ground the answer in the source snippets.",
    "When asked who you are, say you are Dimaso AI bot, here to help visitors navigate the website, understand Dimaso services, and answer questions.",
    "Do not proactively mention that Dimaso is remote, from Serbia, Novi Sad, or has US presence unless the visitor asks about location, company presence, contracts, invoicing, or US availability.",
    "If the visitor asks about location or where Dimaso is based, answer briefly: Dimaso works from Serbia and has US LLC presence. Do not over-explain unless asked.",
    "If the visitor asks specifically about US presence, mention Dimaso US LLC in Sheridan, Wyoming and Dimaso RS in Novi Sad, Serbia.",
    "Lead goal: be 100% helpful first. For purely informational questions, answer the question before any lead capture.",
    "When the visitor shows commercial intent, asks for a quote/proposal/contact/RFP, mentions their project, or attaches a brief, guide the conversation toward a Dimaso team handoff.",
    "Required lead details for handoff: name or company, email, phone, and preferred contact method.",
    "Ask only for missing lead details, in one compact sentence after the useful answer. Do not ask for details already provided.",
    "If the lead is complete, say the conversation and details are saved for the Dimaso team and invite one final project note such as timeline, URL, or priority.",
    "For new website or pricing questions: do not give a fake price. Say pricing depends on scope, pages, design, CMS/WordPress, content, domain/hosting, SEO, and integrations. Then ask only for missing lead details for a Dimaso estimate.",
    "Be brief and concrete. Default to 2-4 short sentences or 3-5 bullets. Do not write long explanations unless the visitor asks.",
    "Ask at most one useful follow-up question, and only when it naturally helps the visitor move forward.",
    "",
    `Intent: ${input.intent}`,
    `Has contact: ${input.hasContact ? "yes" : "no"}`,
    `Has attachment: ${input.hasFile ? "yes" : "no"}`,
    `Lead has name or company: ${input.leadCapture.hasNameOrCompany ? "yes" : "no"}`,
    `Lead has email: ${input.leadCapture.hasEmail ? "yes" : "no"}`,
    `Lead has phone: ${input.leadCapture.hasPhone ? "yes" : "no"}`,
    `Lead has preferred contact method: ${input.leadCapture.hasPreferredContact ? "yes" : "no"}`,
    `Lead missing fields: ${input.leadCapture.missing.join(", ") || "none"}`,
    `Lead complete: ${input.leadCapture.isComplete ? "yes" : "no"}`,
    "",
    "Dimaso context:",
    sourceContext(input.sources),
    "",
    `Visitor message: ${input.message}`,
  ].join("\n");

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: prompt,
        reasoning: { effort: process.env.DIMASOBOT_REASONING_EFFORT || "medium" },
        max_output_tokens: 360,
      }),
    });
    if (!response.ok) return "";
    const payload = await response.json() as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };
    return payload.output_text || payload.output?.flatMap((item) => item.content || []).map((content) => content.text || "").join("\n").trim() || "";
  } catch {
    return "";
  }
}

export function detectDimasoBotIntent(text: string, hasFile: boolean): DimasoBotIntent {
  const value = text.toLowerCase();
  const talksAboutForms = /contact forms?|kontakt form|kontaktne form|forme za upit|upit form/.test(value);
  if (hasFile || /\brfp\b|tender|brief|specification|document|requirements?|dokument|specifikacij/.test(value)) return "rfp";
  if (/price|pricing|quote|proposal|estimate|cost|project|engagement|redesign|build|new website|domain|recommend|treba nam|preporu|cena|cijena|košta|kosta|ponud|projekat|projekt|redizajn|izrada|pravljenje|novi sajt|nov sajt|novi vebsajt|nov vebsajt|websajt|vebsajt|web sajt|domen/.test(value)) return "offer";
  if (!talksAboutForms && /phone|email|contact|call|reach|talk|reply|telefon|kontakt|pozov|javite/.test(value)) return "contact";
  if (/where|what|how|service|website|web|maintenance|development|design|seo|wordpress|ai|support|gde|gdje|šta|sta|kako|uslug|sajt|održavanje|odrzavanje|bavi|dimaso/.test(value)) return "info";
  return "general";
}

export function extractContact(text: string) {
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone = text.match(/(?:\+?\d[\d\s().-]{6,}\d)/)?.[0]?.trim() || "";
  return { email, phone };
}

export function detectLeadCapture(text: string, fields?: { name?: string; company?: string; email?: string; phone?: string }): LeadCapture {
  const value = text.toLowerCase();
  const contact = extractContact(text);
  const hasNameOrCompany = Boolean(fields?.name || fields?.company)
    || /\b(my name is|i am|i'm|company is|organization is|organisation is|org is|we are|contact is|contact person is|firma je|kompanija je|zovem se|ja sam)\s+[\p{L}0-9& .-]{2,}/iu.test(text)
    || /\bcontact\s+[\p{L}]{2,}/iu.test(text);
  const hasEmail = Boolean(fields?.email || contact.email);
  const hasPhone = Boolean(fields?.phone || contact.phone);
  const hasPreferredContact = /\b(email|e-mail|mail|phone|call|sms|text|whatsapp|viber|telegram|linkedin|kontaktirajte|pozovite|posaljite|pošaljite|emailom|mejlom|telefonom|viberom|whatsappom)\b/i.test(value);
  const missing = [
    !hasNameOrCompany ? "name or company" : "",
    !hasEmail ? "email" : "",
    !hasPhone ? "phone" : "",
    !hasPreferredContact ? "preferred contact method" : "",
  ].filter(Boolean);
  return { hasNameOrCompany, hasEmail, hasPhone, hasPreferredContact, missing, isComplete: missing.length === 0 };
}

export function visitorIpMetadata(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
  const realIp = req.headers.get("x-real-ip") || "";
  const ip = forwarded || realIp || "unknown";
  const salt = process.env.DIMASOBOT_IP_SALT || "dimasobot-local-salt";
  return {
    ipHash: ip === "unknown" ? "" : createHash("sha256").update(`${salt}:${ip}`).digest("hex"),
    ip: process.env.DIMASOBOT_STORE_RAW_IP === "true" ? ip : "",
  };
}

export async function generateDimasoBotReply(input: {
  message: string;
  intent: DimasoBotIntent;
  hasContact: boolean;
  hasFile: boolean;
  leadCapture: LeadCapture;
}) {
  const queryTokens = tokenize(input.message);
  const language = detectedLanguage(input.message);
  const ranked = (await retrieveDimasoKnowledge(input.message, 5)) as DimasoKnowledgeSource[];
  const memory = await recentMemory(queryTokens);
  const sources = ([...ranked, ...memory].length ? [...ranked, ...memory] : coreKnowledge.slice(0, 4)).slice(0, 6);
  const primary = sources[0];

  if (isIdentityQuestion(input.message)) {
    return {
      reply: language === "sr-latn" || language === "sr-cyrl"
        ? "Ja sam Dimaso AI bot. Tu sam da pomognem posetiocima da se lakše snađu na sajtu, razumeju Dimaso usluge i dobiju odgovore na pitanja. Kontakt ne morate da ostavljate osim ako želite da vas Dimaso tim kontaktira."
        : "I’m Dimaso AI bot. I’m here to help visitors navigate the website, understand Dimaso services, and get answers to questions. You do not need to leave contact details unless you want the Dimaso team to contact you.",
      sources,
    };
  }

  if (isWebsitePriceQuestion(input.message)) {
    return {
      reply: language === "sr-latn" || language === "sr-cyrl"
        ? `Cena za novi sajt zavisi od obima: broj stranica, dizajn, da li je WordPress/CMS, sadržaj, domen/hosting, SEO i eventualne integracije. Ako krećete od nule, Dimaso može da pomogne oko strukture, dizajna, izrade, domena/hostinga i osnovnog SEO-a. ${leadAsk(language, input.leadCapture)}`
        : `The price for a new website depends on scope: number of pages, design, WordPress/CMS, content, domain/hosting, SEO, and integrations. If you are starting from zero, Dimaso can help with structure, design, build, domain/hosting, and basic SEO. ${leadAsk(language, input.leadCapture)}`,
      sources,
      model: "pricing-guard",
    };
  }

  if (isLocationQuestion(input.message)) {
    return {
      reply: language === "sr-latn" || language === "sr-cyrl"
        ? "Dimaso radi iz Srbije i ima US LLC presence za klijente kojima je to važno."
        : "Dimaso works from Serbia and has US LLC presence for clients who need that.",
      sources,
      model: "location-guard",
    };
  }

  if (input.leadCapture.isComplete && input.hasContact) {
    return {
      reply: language === "sr-latn" || language === "sr-cyrl"
        ? "Sačuvao sam razgovor i kontakt podatke za Dimaso tim. Ako želite, dodajte još URL sajta i šta vam je najhitnije: forme, performance, SEO, redizajn, održavanje ili development."
        : "I saved the conversation and contact details for the Dimaso team. If you want, add the website URL and the most urgent priority: forms, performance, SEO, redesign, maintenance, or development.",
      sources,
      model: "lead-handoff-guard",
    };
  }

  if (isNonprofitMaintenanceQuestion(input.message)) {
    return {
      reply: language === "sr-latn" || language === "sr-cyrl"
        ? `Za nonprofit WordPress sajt preporuka je mesečna podrška sa fokusom na stabilnost: update-i, backup, sigurnost, QA donation/contact formi, accessibility osnove, technical SEO cleanup i kratak mesečni izveštaj. ${leadAsk(language, input.leadCapture)}`
        : `For a nonprofit WordPress site, I would recommend monthly support focused on reliability: updates, backups, security, donation/contact form QA, accessibility basics, technical SEO cleanup, and a short monthly report. ${leadAsk(language, input.leadCapture)}`,
      sources,
      model: "nonprofit-maintenance-guard",
    };
  }

  if (isEcommerceSupportQuestion(input.message)) {
    return {
      reply: language === "sr-latn" || language === "sr-cyrl"
        ? `Da. Za WooCommerce/ecommerce problem Dimaso može da proveri checkout, plaćanja, tracking/analytics, product page performance, plugin konflikte i SEO osnovu za kategorije/proizvode. ${leadAsk(language, input.leadCapture)}`
        : `Yes. For a WooCommerce/ecommerce issue, Dimaso can review checkout, payments, tracking/analytics, product-page performance, plugin conflicts, and SEO foundations for products/categories. ${leadAsk(language, input.leadCapture)}`,
      sources,
      model: "ecommerce-support-guard",
    };
  }

  if (isSaaSPerformanceQuestion(input.message)) {
    return {
      reply: language === "sr-latn" || language === "sr-cyrl"
        ? `Da. Za SaaS/marketing sajt Dimaso može da proveri Core Web Vitals, brzinu landing stranica, sigurniji workflow za izmene, forme/tracking i tehnički SEO. ${leadAsk(language, input.leadCapture)}`
        : `Yes. For a SaaS marketing site, Dimaso can review Core Web Vitals, landing-page speed, safer publishing workflows, forms/tracking, and technical SEO. ${leadAsk(language, input.leadCapture)}`,
      sources,
      model: "saas-performance-guard",
    };
  }

  if (isSupportRecommendationQuestion(input.message)) {
    return {
      reply: language === "sr-latn" || language === "sr-cyrl"
        ? `Za WordPress sajt sa održavanjem i povremenim developmentom, preporučio bih mesečnu podršku: update-i, backup, sigurnost, QA formi, sitni bug fixes, plus poseban backlog za veće development zadatke. To je bolji model od jednokratnih intervencija jer Dimaso vremenom zna sistem i može brže da reaguje. ${leadAsk(language, input.leadCapture)}`
        : `For a WordPress site that needs maintenance plus occasional development, I would recommend monthly support: updates, backups, security, form QA, small fixes, and a separate backlog for larger development tasks. That is usually better than one-off fixes because Dimaso builds context and can respond faster. ${leadAsk(language, input.leadCapture)}`,
      sources,
      model: "support-recommendation-guard",
    };
  }

  if (isProjectContextMessage(input.message)) {
    return {
      reply: language === "sr-latn" || language === "sr-cyrl"
        ? `To zvuči kao dobar fit za mesečnu WordPress podršku: redovni update-i, QA formi/trackinga, sitni fixes, sigurniji workflow za izmene i prioritetni backlog za veće zadatke. ${leadAsk(language, input.leadCapture)}`
        : `That sounds like a good fit for monthly WordPress support: regular updates, form/tracking QA, small fixes, safer page-editing workflows, and a prioritized backlog for larger tasks. ${leadAsk(language, input.leadCapture)}`,
      sources,
      model: "project-context-guard",
    };
  }

  const modelReply = await generateWithModel({ ...input, sources });
  if (modelReply) return { reply: modelReply, sources, model: process.env.DIMASOBOT_MODEL || "gpt-5.2" };

  if (input.intent === "rfp") {
    if (language === "sr-latn" || language === "sr-cyrl") {
      if (input.hasFile && input.hasContact) return { reply: "Hvala. Sačuvao sam RFP, kontakt podatke i kontekst razgovora za Dimaso tim. Možete dodati rokove, linkove ili posebne uslove ovde.", sources };
      if (input.hasFile) return { reply: "Primio sam attachment. Dodajte kratak opis cilja, rok ili kriterijume, i email ili telefon ako želite da vas Dimaso tim kontaktira.", sources };
      return { reply: "Možete opisati RFP ovde ili ga dodati preko ikonice za attachment. Sačuvaću razgovor, stranicu i fajl zajedno za Dimaso tim.", sources };
    }
    if (input.hasFile && input.hasContact) return { reply: "Thanks. I saved your RFP, contact details, and chat context for the Dimaso team. You can add any constraints, deadlines, or links here and they will stay attached to this request.", sources };
    if (input.hasFile) return { reply: "I received the attachment. Add a short note about the goal, deadline, or decision criteria, and include an email or phone if you want the Dimaso team to follow up.", sources };
    return { reply: "You can describe the RFP here or attach it with the paperclip. I will keep the conversation, page context, and uploaded file together for the Dimaso team.", sources };
  }

  if (input.intent === "offer") {
    if (language === "sr-latn" || language === "sr-cyrl") {
      return {
        reply: input.hasContact
          ? "Hvala. Sačuvao sam kontekst projekta i kontakt za Dimaso tim. Ako želite, dodajte URL trenutnog sajta, rok ili glavni poslovni cilj."
          : "Recite mi ukratko o projektu: trenutni sajt, cilj, rok i da li vam treba održavanje, development, dizajn, WordPress podrška, tehnički SEO ili AI podrška za sajt. Kontakt možete ostaviti prirodno u poruci kada budete spremni.",
        sources,
      };
    }
    return {
      reply: input.hasContact
        ? "Thanks. I saved the project context and contact details for the Dimaso team. If you want, add the current website URL, preferred timeline, or the main business goal."
        : "Tell me a little more about the project: current website, goal, timeline, and whether you need maintenance, development, design, WordPress support, technical SEO, or AI website support. You can leave contact details naturally in the message when ready.",
      sources,
    };
  }

  if (input.intent === "contact") {
    if (language === "sr-latn" || language === "sr-cyrl") {
      return {
        reply: input.hasContact
          ? "Hvala. Sačuvao sam kontakt uz ovaj razgovor. Dodajte još jednu rečenicu o temi da Dimaso tim može da odgovori sa pravim kontekstom."
          : "Možete upisati email ili telefon direktno u chat. Nije potrebna posebna forma.",
        sources,
      };
    }
    return {
      reply: input.hasContact
        ? "Thanks. I saved your contact details with this conversation. Add one sentence about the topic so the Dimaso team can respond with the right context."
        : "You can type your email or phone directly in the chat. No separate form is needed.",
      sources,
    };
  }

  if (primary) {
    const snippet = answerSnippet(primary).replace(/\.$/, "");
    if (language === "sr-latn" || language === "sr-cyrl") {
      if (primary.title === "Dimaso US presence") {
        return {
          reply: "Dimaso ima US prisustvo kroz Dimaso US LLC u Sheridan, Wyoming, United States, kao i evropsko/srpsko prisustvo kroz Dimaso RS u Novom Sadu, Serbia.",
          sources,
        };
      }
      return {
        reply: "Dimaso se bavi održavanjem sajtova, web developmentom, web dizajnom, WordPress podrškom, tehničkim SEO-om, AI vidljivošću sajta, hostingom, bezbednošću, analitikom i dugoročnom brigom o web platformama.",
        sources,
      };
    }
    return {
      reply: snippet.includes("Dimaso has a US presence") ? `${snippet}.` : `${snippet}.`,
      sources,
    };
  }

  return {
    reply: language === "sr-latn" || language === "sr-cyrl"
      ? "Mogu da pomognem oko Dimaso usluga, održavanja sajtova, web developmenta, web dizajna, WordPress podrške, tehničkog SEO-a, AI podrške za sajt ili RFP pitanja. Pišite prirodno šta vas zanima."
      : "I can help with Dimaso services, website maintenance, web development, web design, WordPress support, technical SEO, AI website support, or RFP questions. Ask naturally about whatever you want to understand.",
    sources,
  };
}

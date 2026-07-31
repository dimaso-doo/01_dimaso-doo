"use client";

import { ChangeEvent, FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { trackEvent, trackLead } from "@/lib/ga-events";

type BotIntent = "general" | "info" | "offer" | "rfp" | "contact";
type Message = { id: string; role: "bot" | "user" | "system"; text: string; pending?: boolean };

const acceptedFiles = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt", ".zip"];
const maxFileSize = 10 * 1024 * 1024;
const starterMessage = "Hi, I’m Dimaso AI bot. I’m here to help visitors navigate the site, understand Dimaso services, and answer questions.";

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(size >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function newMessage(role: Message["role"], text: string): Message {
  return { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, role, text };
}

function BotIcon({ className }: { className?: string }) {
  return <span className={className || "dimasobot-robot"} aria-hidden="true">
    <svg viewBox="0 0 64 64" focusable="false">
      <path className="bot-antenna" d="M32 11V6"/>
      <circle className="bot-antenna-dot" cx="32" cy="5" r="4"/>
      <path className="bot-arm" d="M10 34v9M54 34v9"/>
      <rect className="bot-face" x="17" y="20" width="30" height="29" rx="10"/>
      <circle className="bot-eye" cx="27" cy="34" r="3.3"/>
      <circle className="bot-eye" cx="37" cy="34" r="3.3"/>
      <path className="bot-mouth" d="M27 42h10"/>
    </svg>
  </span>;
}

function detectIntent(text: string, hasFile: boolean): BotIntent {
  const value = text.toLowerCase();
  const talksAboutForms = /contact forms?|kontakt form|kontaktne form|forme za upit|upit form/.test(value);
  if (hasFile || /\brfp\b|tender|brief|specification|document|requirements?|dokument|specifikacij/.test(value)) return "rfp";
  if (/price|pricing|quote|proposal|estimate|cost|project|engagement|redesign|build|new website|domain|recommend|treba nam|preporu|cena|cijena|košta|kosta|ponud|projekat|projekt|redizajn|izrada|pravljenje|novi sajt|nov sajt|novi vebsajt|nov vebsajt|websajt|vebsajt|web sajt|domen/.test(value)) return "offer";
  if (!talksAboutForms && /phone|email|contact|call|reach|talk|reply|telefon|kontakt|pozov|javite/.test(value)) return "contact";
  if (/where|what|how|service|website|web|maintenance|development|design|seo|wordpress|ai|support|gde|gdje|šta|sta|kako|uslug|sajt|održavanje|odrzavanje|bavi|dimaso/.test(value)) return "info";
  return "general";
}

function extractContact(text: string) {
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone = text.match(/(?:\+?\d[\d\s().-]{6,}\d)/)?.[0]?.trim() || "";
  return { email, phone };
}

function renderInlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    if (match[2]) nodes.push(<strong key={`${keyPrefix}-${match.index}`}>{match[2]}</strong>);
    if (match[3] && match[4]) nodes.push(<a key={`${keyPrefix}-${match.index}`} href={match[4]} target={match[4].startsWith("http") ? "_blank" : undefined} rel={match[4].startsWith("http") ? "noopener noreferrer" : undefined}>{match[3]}</a>);
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function MarkdownMessage({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const value = paragraph.join(" ").trim();
    if (value) blocks.push(<p key={`p-${blocks.length}`}>{renderInlineMarkdown(value, `p-${blocks.length}`)}</p>);
    paragraph = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push(<ul key={`ul-${blocks.length}`}>{listItems.map((item, index) => <li key={index}>{renderInlineMarkdown(item, `li-${blocks.length}-${index}`)}</li>)}</ul>);
    listItems = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const listMatch = trimmed.match(/^[-*]\s+(.+)/);
    if (listMatch) {
      flushParagraph();
      listItems.push(listMatch[1]);
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  return <>{blocks}</>;
}

export function DimasoBot() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [conversionInView, setConversionInView] = useState(false);
  const [messages, setMessages] = useState<Message[]>([newMessage("bot", starterMessage)]);
  const [draft, setDraft] = useState("");
  const [intent, setIntent] = useState<BotIntent>("general");
  const [sending, setSending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const [visitorId, setVisitorId] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const leadTracked = useRef(false);

  useEffect(() => {
    setMounted(true);
    const existingVisitorId = window.localStorage.getItem("dimasobot-visitor-id");
    const nextVisitorId = existingVisitorId || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    if (!existingVisitorId) window.localStorage.setItem("dimasobot-visitor-id", nextVisitorId);
    setVisitorId(nextVisitorId);
    let shown = false;
    const reveal = () => {
      if (shown) return;
      const scrolledEnough = window.scrollY > Math.max(520, window.innerHeight * 1.15);
      if (!scrolledEnough) return;
      shown = true;
      setVisible(true);
    };
    const timer = window.setTimeout(() => {
      shown = true;
      setVisible(true);
    }, 9500);
    window.addEventListener("scroll", reveal, { passive: true });
    reveal();
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", reveal);
    };
  }, []);

  useEffect(() => {
    const target = document.querySelector("#rfp");
    if (!target) {
      setConversionInView(false);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setConversionInView(Boolean(entry?.isIntersecting)), { threshold: 0.08 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function closeChat() {
    setOpen(false);
    setVisible(false);
  }

  function toggleChat() {
    if (open) {
      closeChat();
      return;
    }
    setVisible(true);
    setOpen(true);
  }

  function updateFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setError("");
    if (!file) {
      setFileInfo(null);
      return;
    }
    const extension = `.${file.name.split(".").pop()?.toLowerCase() || ""}`;
    if (!acceptedFiles.includes(extension)) {
      event.currentTarget.value = "";
      setFileInfo(null);
      setError("Please attach a PDF, Word, Excel, TXT, or ZIP file.");
      return;
    }
    if (file.size > maxFileSize) {
      event.currentTarget.value = "";
      setFileInfo(null);
      setError("Please attach a file smaller than 10MB.");
      return;
    }
    setFileInfo({ name: file.name, size: file.size });
    setSaved(false);
    setMessages((current) => [...current, newMessage("system", `Attachment added: ${file.name} (${formatFileSize(file.size)})`)]);
  }

  async function sendToBot(nextMessages: Message[], nextIntent: BotIntent, latestText: string) {
    const contact = extractContact(latestText);
    const data = new FormData();
    data.set("intent", nextIntent);
    data.set("name", "");
    data.set("company", "");
    data.set("email", contact.email);
    data.set("phone", contact.phone);
    data.set("message", latestText || "DimasoBot conversation");
    data.set("pageUrl", window.location.href);
    data.set("referrer", document.referrer);
    data.set("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone || "");
    data.set("language", navigator.language || "");
    data.set("visitorId", visitorId);
    data.set("conversation", nextMessages.map((message) => `${message.role}: ${message.text}`).join("\n"));
    const file = fileInput.current?.files?.[0];
    if (file) data.set("file", file);

    setSending(true);
    const thinkingId = `thinking-${Date.now()}`;
    const startedAt = Date.now();
    setMessages((current) => [...current, { id: thinkingId, role: "bot", text: "Thinking", pending: true }]);
    try {
      const res = await fetch("/api/dimasobot", { method: "POST", body: data });
      if (!res.ok) throw new Error("Request failed");
      const payload = await res.json() as { reply?: string };
      const waitMs = Math.max(0, 950 - (Date.now() - startedAt));
      if (waitMs) await new Promise((resolve) => window.setTimeout(resolve, waitMs));
      setMessages((current) => current.map((message) => message.id === thinkingId ? newMessage("bot", payload.reply || "Thanks. I saved the conversation for the Dimaso team.") : message));
      setSaved(true);
      setError("");
      const hasContact=Boolean(contact.email||contact.phone);
      const hasAttachment=Boolean(file);
      trackEvent("dimasobot_message",{intent:nextIntent,contact_provided:hasContact,file_attached:hasAttachment});
      if(!leadTracked.current&&(hasContact||hasAttachment)){
        trackLead("dimasobot",{intent:nextIntent,contact_provided:hasContact,file_attached:hasAttachment});
        leadTracked.current=true;
      }
    } catch {
      setMessages((current) => current.map((message) => message.id === thinkingId ? newMessage("bot", "I could not save that message right now. You can continue the conversation, and we will try again on the next message.") : message));
      setError("The conversation was not saved. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text && !fileInfo) return;

    const nextIntent = detectIntent(text, Boolean(fileInfo));
    const nextMessages = [...messages, ...(text ? [newMessage("user", text)] : [])];

    setMessages(nextMessages);
    setDraft("");
    setIntent(nextIntent);
    setSaved(false);
    await sendToBot(nextMessages, nextIntent, text);
  }

  function removeFile() {
    if (fileInput.current) fileInput.current.value = "";
    setFileInfo(null);
    setMessages((current) => [...current, newMessage("system", "Attachment removed.")]);
  }

  if (!mounted) return null;

  return <div className={`dimasobot ${visible ? "is-visible" : ""} ${open ? "is-open" : ""}`}>
    {(visible||open)&&(!conversionInView||open) && <button className="dimasobot-launcher" type="button" aria-label={open ? "Close DimasoBot" : "Open DimasoBot"} aria-expanded={open} onClick={toggleChat}>
      <BotIcon/>
    </button>}

    {open && <section className="dimasobot-panel" aria-label="DimasoBot chat">
      <div className="dimasobot-head">
        <div className="dimasobot-title"><BotIcon className="dimasobot-head-robot"/><div><span className="eyebrow">Dimaso AI</span><h2>DimasoBot</h2></div></div>
        <button type="button" aria-label="Close DimasoBot" onClick={closeChat}>x</button>
      </div>

      <div ref={messagesRef} className="dimasobot-messages" aria-live="polite">
        {messages.map((message) => <div key={message.id} className={`dimasobot-message ${message.role === "user" ? "is-user" : message.role === "system" ? "is-system" : "is-bot"} ${message.pending ? "is-thinking" : ""}`}>
          {message.role === "bot" && <BotIcon className="dimasobot-message-robot"/>}
          <div className="dimasobot-bubble">{message.pending ? <span className="dimasobot-typing" aria-label="DimasoBot is thinking"><span/><span/><span/></span> : <MarkdownMessage text={message.text}/>}</div>
        </div>)}
      </div>

      <form className="dimasobot-composer" onSubmit={submit}>
        {fileInfo && <div className="dimasobot-attachment"><span>{fileInfo.name}</span><small>{formatFileSize(fileInfo.size)}</small><button type="button" onClick={removeFile}>x</button></div>}
        <div className="dimasobot-compose-row">
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }} rows={1} placeholder="Write a message..."/>
          <div className="dimasobot-compose-actions">
            <label className="dimasobot-attach" aria-label="Add attachment">
              <input ref={fileInput} name="file" type="file" accept={acceptedFiles.join(",")} onChange={updateFile}/>
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M8.8 12.6 14.9 6.5a3.2 3.2 0 0 1 4.5 4.5l-7.7 7.7a5 5 0 0 1-7.1-7.1l8.2-8.2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
            </label>
            <button className="dimasobot-send" type="submit" disabled={sending || (!draft.trim() && !fileInfo)} aria-label="Send message"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m4 11.2 15.4-7.1-7.1 15.4-2-6.3L4 11.2Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg></button>
          </div>
        </div>
        <div className="dimasobot-meta" aria-live="polite">
          {error ? <small className="dimasobot-error">{error}</small> : saved ? <small>Conversation saved for the Dimaso team. AI-generated content may be inaccurate.</small> : sending ? <small>DimasoBot is thinking...</small> : <small>{intent === "general" ? "Spam protection enabled; AI-generated content may be inaccurate." : "This chat is saved with the relevant page and visitor context."}</small>}
        </div>
      </form>
    </section>}
  </div>;
}

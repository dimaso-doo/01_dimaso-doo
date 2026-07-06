import { hasPersistentDimasoBotStorage, readDimasoBotRecords } from "@/lib/dimasobot/storage";

type DimasoBotLead = {
  id: string;
  createdAt: string;
  intent: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  pageUrl: string;
  botReply?: string;
  sources?: { title: string; url: string }[];
  visitor?: {
    visitorId?: string;
    referrer?: string;
    userAgent?: string;
    language?: string;
    timezone?: string;
    ipHash?: string;
    ip?: string;
  };
  upload: null | {
    originalName: string;
    storedName: string;
    size: number;
    type: string;
  };
  status: string;
};

async function getLeads() {
  return await readDimasoBotRecords<DimasoBotLead>("leads", 500);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatDay(value: string) {
  return new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(new Date(`${value}T12:00:00Z`));
}

function dayKey(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

function formatIntent(intent: string) {
  if (intent === "rfp") return "RFP";
  if (intent === "offer") return "Offer";
  if (intent === "info") return "Website info";
  if (intent === "contact") return "Callback";
  return "General";
}

function adminHref(token: string, date?: string) {
  const params = new URLSearchParams();
  if (token) params.set("token", token);
  if (date) params.set("date", date);
  return `/admin/dimasobot?${params.toString()}`;
}

export default async function DimasoBotAdminPage({ searchParams }: { searchParams?: Promise<{ token?: string; date?: string }> }) {
  const token = process.env.DIMASOBOT_ADMIN_TOKEN;
  const params = await searchParams;
  const providedToken = params?.token || "";
  const isAllowed = process.env.NODE_ENV !== "production" || (token && providedToken === token);

  if (!isAllowed) {
    return <main className="admin-leads-page">
      <section className="shell admin-leads-shell">
        <div className="admin-leads-empty">
          <strong>DimasoBot admin is protected.</strong>
          <small>Set DIMASOBOT_ADMIN_TOKEN and open this page through an authenticated admin route.</small>
        </div>
      </section>
    </main>;
  }

  const leads = await getLeads();
  const hasPersistentStorage = hasPersistentDimasoBotStorage();
  const grouped = leads.reduce<Record<string, DimasoBotLead[]>>((days, lead) => {
    const key = dayKey(lead.createdAt);
    days[key] = days[key] || [];
    days[key].push(lead);
    return days;
  }, {});
  const days = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  const selectedDate = params?.date === "all" ? "all" : params?.date || days[0] || "";
  const visibleLeads = selectedDate === "all" ? leads : grouped[selectedDate] || [];
  const handoffCount = visibleLeads.filter((lead) => lead.status === "ready-for-handoff").length;

  return <main className="admin-leads-page">
    <section className="shell admin-leads-shell">
      <div className="admin-leads-head">
        <div>
          <span className="eyebrow">DimasoBot / Leads</span>
          <h1>Chat inbox</h1>
        </div>
        <div className="admin-leads-count"><strong>{visibleLeads.length}</strong><small>{selectedDate === "all" ? "shown requests" : "requests this day"}</small></div>
      </div>
      {!hasPersistentStorage && <div className="admin-leads-empty">
        <strong>Persistent production storage is not connected yet.</strong>
        <small>For Vercel production, add KV_REST_API_URL and KV_REST_API_TOKEN so chat leads remain available after serverless restarts.</small>
      </div>}

      {leads.length === 0 ? <div className="admin-leads-empty">
        <strong>No DimasoBot leads yet.</strong>
        <small>Submit a test request through the chat widget and it will appear here.</small>
      </div> : <>
        <div className="admin-leads-toolbar">
          <div className="admin-leads-summary">
            <span><strong>{leads.length}</strong> total</span>
            <span><strong>{days.length}</strong> days</span>
            <span><strong>{handoffCount}</strong> ready handoffs</span>
          </div>
          <form className="admin-leads-date-form">
            <input type="hidden" name="token" value={providedToken} />
            <label htmlFor="admin-date-filter">Day</label>
            <input id="admin-date-filter" type="date" name="date" defaultValue={selectedDate === "all" ? "" : selectedDate} />
            <button type="submit">Open</button>
          </form>
        </div>

        <nav className="admin-day-tabs" aria-label="DimasoBot days">
          <a className={selectedDate === "all" ? "is-active" : ""} href={adminHref(providedToken, "all")}>All <span>{leads.length}</span></a>
          {days.map((day) => <a key={day} className={selectedDate === day ? "is-active" : ""} href={adminHref(providedToken, day)}>
            {formatDay(day)} <span>{grouped[day].length}</span>
          </a>)}
        </nav>

        {visibleLeads.length === 0 ? <div className="admin-leads-empty">
          <strong>No chats for this day.</strong>
          <small>Choose another day from the list above.</small>
        </div> : <div className="admin-leads-list">
        {visibleLeads.map((lead) => <article key={lead.id} className="admin-lead-card">
          <div className="admin-lead-topline">
            <span>{formatIntent(lead.intent)}</span>
            <time dateTime={lead.createdAt}>{formatDate(lead.createdAt)}</time>
          </div>
          <div className="admin-lead-main">
            <h2>{lead.name}</h2>
            <p>{lead.message}</p>
            {lead.botReply && <p className="admin-lead-reply"><strong>DimasoBot:</strong> {lead.botReply}</p>}
          </div>
          <dl className="admin-lead-details">
            <div><dt>Company</dt><dd>{lead.company || "-"}</dd></div>
            <div><dt>Email</dt><dd>{lead.email || "-"}</dd></div>
            <div><dt>Phone</dt><dd>{lead.phone || "-"}</dd></div>
            <div><dt>Status</dt><dd>{lead.status}</dd></div>
            <div><dt>Page</dt><dd>{lead.pageUrl || "-"}</dd></div>
            <div><dt>Attachment</dt><dd>{lead.upload ? `${lead.upload.originalName} (${lead.upload.storedName})` : "-"}</dd></div>
            <div><dt>Visitor ID</dt><dd>{lead.visitor?.visitorId || "-"}</dd></div>
            <div><dt>IP Hash</dt><dd>{lead.visitor?.ipHash ? `${lead.visitor.ipHash.slice(0, 18)}...` : "-"}</dd></div>
            <div><dt>Referrer</dt><dd>{lead.visitor?.referrer || "-"}</dd></div>
            <div><dt>Language</dt><dd>{lead.visitor?.language || "-"}</dd></div>
            <div><dt>Timezone</dt><dd>{lead.visitor?.timezone || "-"}</dd></div>
            <div><dt>Sources</dt><dd>{lead.sources?.length ? lead.sources.map((source) => source.title).join(", ") : "-"}</dd></div>
          </dl>
        </article>)}
      </div>}
      </>}
    </section>
  </main>;
}

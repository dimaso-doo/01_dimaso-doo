import Link from "next/link";
import { serviceFaqs, services, ServiceKey } from "@/content/data";
import { Cases, FAQSection, ProcessStack, Reveal, SectionHead, Testimonials } from "./sections";
import { CTA, JsonLd } from "./site";
import { organizationId, site, websiteId } from "@/lib/site";
import { TechVisual } from "./tech-visual";

export function ServicePage({type}:{type:ServiceKey}) {
 const s=services[type];
 const faq=serviceFaqs[type];
 return <main>
  <JsonLd data={{"@context":"https://schema.org","@graph":[{"@type":"Service","@id":`${site.url}/${s.slug}#service`,name:s.label,url:`${site.url}/${s.slug}`,description:s.intro,provider:{"@id":organizationId},isPartOf:{"@id":websiteId},areaServed:["US","International"]},{"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`${site.url}/`},{"@type":"ListItem",position:2,name:s.label,item:`${site.url}/${s.slug}`}]},{"@type":"FAQPage",mainEntity:faq.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))}]}}/>
  <section className="grid-bg" style={{padding:"140px 0 100px",position:"relative",overflow:"hidden"}}><TechVisual/><div className="shell" style={{position:"relative",zIndex:2}}><span className="eyebrow">{s.eyebrow} · US & international</span><h1 style={{fontSize:"clamp(48px,8vw,92px)",lineHeight:1.02,maxWidth:1000,margin:"22px 0 28px"}}>{s.title}</h1><p className="lede">{s.intro}</p><div style={{display:"flex",gap:12,marginTop:35,flexWrap:"wrap"}}><Link href="#rfp" className="btn">Send us your RFP</Link><Link href="/case-studies" className="btn ghost">View case studies</Link></div></div></section>
  <section className="section service-section service-cover-section ambient-code ambient-left"><div className="shell"><SectionHead eyebrow="What we cover" title={`${s.label} with senior ownership.`} copy="We combine technical depth, delivery discipline, and business context so the work creates value beyond a list of completed tickets."/><div className="maintenance-cover-grid cards-grid">{s.keywords.map((x,i)=><Reveal key={x}><div className={`card maintenance-cover-card cover-card-${i+1}`}><div className="cover-motion"><span/><span/><span/></div><span>0{i+1}</span><h3>{x}</h3></div></Reveal>)}</div></div></section>
  {type==="development"&&<DevelopmentSystems/>}
  {type==="design"&&<DesignClarity/>}
  {type==="maintenance"&&<MaintenanceRhythm/>}
  {type==="maintenance"&&<MaintenanceSLA/>}
  {type==="maintenance"&&<CTA title="Need a maintenance partner who can protect the details?" label="Send us your RFP"/>}
  <section className="section service-section ambient-code ambient-right"><div className="shell"><SectionHead eyebrow="Problems we solve" title={type==="design"?"When the website is unclear, the offer feels weaker than it is.":"Technical friction should not become business drag."}/><div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:14,marginTop:50}} className="cards-grid">{s.problems.map((x,i)=><Reveal key={x}><div className="card"><span className="eyebrow">0{i+1}</span><h3 style={{fontSize:25,lineHeight:1.3}}>{x}</h3></div></Reveal>)}</div></div></section>
  <section className="section service-section ambient-code ambient-left"><div className="shell"><ProcessStack items={s.process} title="A process built for momentum and confidence."/></div></section>
  <section className="section service-section ambient-code ambient-right"><div className="shell"><SectionHead eyebrow="Relevant work" title="Outcomes shaped by context, not templates."/><div style={{marginTop:50}}><Cases limit={2} slugs={type==="development"?["forever-living-shop","call-the-waiter"]:type==="design"?["doctor-medica","brightside-kosmaj"]:undefined}/></div></div></section>
  <section className="section service-section ambient-code ambient-left"><div className="shell"><SectionHead eyebrow="Client perspective" title="A technical partner teams can rely on."/><div style={{marginTop:50}}><Testimonials/></div></div></section>
  <FAQSection eyebrow={`FAQ / ${s.label}`} title={`Questions about ${s.label.toLowerCase()}.`} copy="Practical answers about scope, collaboration, quality, and how the service works in real business conditions." items={faq}/>
 </main>;
}

function DesignClarity() {
 const systems = [
  { title:"Positioning & message", copy:"We shape the first screen, content hierarchy, and language around what the business needs visitors to understand quickly." },
  { title:"UX structure", copy:"Pages, sections, navigation, and user paths are organized so people can compare, decide, and move forward without confusion." },
  { title:"Visual direction", copy:"Typography, spacing, imagery, contrast, and interaction details create trust without making the interface feel decorative or unclear." },
  { title:"Conversion paths", copy:"Forms, landing pages, calls to action, and key decision points are designed around practical business outcomes, not just visual polish." },
 ];
 return <section className="section service-section design-clarity-section ambient-code ambient-right">
  <div className="shell">
   <div className="design-clarity-layout">
    <div className="design-clarity-intro">
     <div className="design-panel-motion" aria-hidden="true"><span/><span/><span/><span/></div>
     <span className="eyebrow">Design clarity system</span>
     <h2>Design should make the offer easier to trust, understand, and act on.</h2>
     <p className="lede">Strong web design is not only how the interface looks. It is how clearly the page explains the business, how naturally users move through decisions, and how confidently the website supports the next action.</p>
     <div className="design-flow" aria-hidden="true"><span>Message</span><span>Structure</span><span>Visuals</span><span>Action</span></div>
    </div>
    <div className="design-clarity-grid">
     {systems.map((item,i)=><Reveal key={item.title}><article className={`design-clarity-card design-card-${i+1}`}>
      <div className="design-card-motion"><span/><span/><span/></div>
      <span className="eyebrow">Clarity / 0{i+1}</span>
      <h3>{item.title}</h3>
      <p>{item.copy}</p>
     </article></Reveal>)}
    </div>
   </div>
  </div>
 </section>;
}

function DevelopmentSystems() {
 const systems = [
  { title:"Ecommerce logic", copy:"Customer groups, product rules, checkout flows, discounts, payment behavior, and admin workflows that need to match the real business model." },
  { title:"API integrations", copy:"Booking, CRM, payment, analytics, inventory, membership, and third-party services connected with practical error handling and QA." },
  { title:"CMS workflows", copy:"Editing experiences, custom content structures, reusable sections, permissions, and publishing patterns that help teams move faster." },
  { title:"Custom platforms", copy:"Portals, directories, dashboards, listing systems, and product websites where the website has to behave like a business tool." },
 ];
 return <section className="section service-section development-systems-section ambient-code ambient-right">
  <div className="shell">
   <div className="development-systems-layout">
    <div className="development-systems-intro">
     <span className="eyebrow">Development systems</span>
     <h2>We build the workflows behind the website, not just the pages people see.</h2>
     <p className="lede">Good development connects business rules, content, integrations, performance, QA, and long-term maintainability. The goal is a website that can support real operations after launch.</p>
     <div className="dev-flow" aria-hidden="true"><span>Brief</span><span>Logic</span><span>Build</span><span>QA</span><span>Deploy</span></div>
    </div>
    <div className="development-system-grid">
     {systems.map((item,i)=><Reveal key={item.title}><article className={`development-system-card dev-system-${i+1}`}>
      <div className="dev-system-motion"><span/><span/><span/></div>
      <span className="eyebrow">System / 0{i+1}</span>
      <h3>{item.title}</h3>
      <p>{item.copy}</p>
     </article></Reveal>)}
    </div>
   </div>
  </div>
 </section>;
}

function MaintenanceRhythm() {
 const monthly = ["Website, CMS, plugin, and dependency updates", "Backups, uptime, security, and performance checks", "QA on critical pages, forms, checkout, and responsive layouts", "Priority fixes, content support, and small technical improvements", "Monthly summary with completed work, open risks, and next recommendations"];
 const audit = ["Current website, hosting, CMS, plugins, and integrations", "Forms, analytics, tracking, redirects, and SEO-sensitive URLs", "Known bugs, technical debt, update risk, and business-critical flows", "Access, backup position, staging options, and release process"];
 return <section className="section service-section ambient-code ambient-right maintenance-rhythm-section">
  <div className="shell">
   <div className="maintenance-rhythm-layout">
    <div className="maintenance-rhythm-intro">
     <div className="rhythm-panel-motion" aria-hidden="true"><span/><span/><span/><span/></div>
     <span className="eyebrow">Maintenance rhythm</span>
     <h2>Clear monthly ownership before small issues become business problems.</h2>
     <p className="lede">Maintenance clients usually need more than occasional fixes. They need a senior team that knows what to check, what to protect first, and how to keep the website improving without turning every update into a small project.</p>
     <div className="rhythm-proof-row"><span>Audit</span><span>QA</span><span>Report</span><span>Improve</span></div>
    </div>
    <Reveal><article className="maintenance-rhythm-card monthly">
     <div className="rhythm-orbit"><span/><span/><span/></div>
     <span className="eyebrow">Every month</span>
     <h3>What ongoing support can include.</h3>
     <ul>{monthly.map((item)=><li key={item}>{item}</li>)}</ul>
    </article></Reveal>
    <Reveal><article className="maintenance-rhythm-card audit">
     <div className="rhythm-orbit"><span/><span/><span/></div>
     <span className="eyebrow">Before we take over</span>
     <h3>We audit the system, not just the homepage.</h3>
     <p>When another team built the website, we start by understanding the real setup before promising a maintenance plan.</p>
     <ul>{audit.map((item)=><li key={item}>{item}</li>)}</ul>
    </article></Reveal>
   </div>
  </div>
 </section>;
}

function MaintenanceSLA() {
 const tiers = [
  { title:"Critical issues", target:"1–2 hours", examples:["Website down","Checkout not working","Major broken functionality","Urgent security issue"] },
  { title:"High priority issues", target:"Same business day", examples:["Broken forms","Important content/page issue","Integration problem","Visible frontend bug"] },
  { title:"Standard support", target:"24–48 hours", examples:["Content updates","Minor bugs","Layout adjustments","Routine maintenance tasks"] },
 ];
 return <section className="section service-section maintenance-sla-section">
  <div className="shell">
   <SectionHead eyebrow="Support response" title="Response time expectations built for ongoing website support." copy="Maintenance work needs clear priority, calm communication, and realistic response targets. We define urgency with the client, protect critical website flows first, and keep routine updates moving through a predictable support rhythm."/>
   <div className="sla-grid">
    {tiers.map((tier)=><Reveal key={tier.title}><article className="sla-card">
     <span className="eyebrow">{tier.title}</span>
     <strong>{tier.target}</strong>
     <ul>{tier.examples.map((item)=><li key={item}>{item}</li>)}</ul>
    </article></Reveal>)}
   </div>
   <p className="sla-note">Final SLA terms can be defined based on the maintenance plan, project scope, and client requirements.</p>
  </div>
 </section>;
}

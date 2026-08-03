import Link from "next/link";
import { Cases, FAQSection, Reveal, SectionHead } from "@/components/sections";
import { CTA, JsonLd } from "@/components/site";
import { industries, industryFaqs, IndustryKey, services } from "@/content/data";
import { organizationId, site, websiteId } from "@/lib/site";
import { TechVisual } from "@/components/tech-visual";
import { TrackedLink } from "@/components/tracked-link";

const serviceBySlug = Object.values(services).reduce<Record<string, (typeof services)[keyof typeof services]>>((acc, service) => {
  acc[service.slug] = service;
  return acc;
}, {});

const industryGuides:Partial<Record<IndustryKey,readonly (readonly [string,string])[]>>={
  nonprofits:[["Nonprofit website redesign cost guide","/blog/nonprofit-website-redesign-cost"],["Nonprofit website maintenance checklist","/blog/website-maintenance-checklist-for-nonprofits"]],
  associations:[["WordPress maintenance for associations","/blog/wordpress-maintenance-for-associations"],["How to choose a maintenance partner","/blog/how-to-choose-a-website-maintenance-partner"]],
  agencies:[["White-label WordPress maintenance for agencies","/blog/white-label-wordpress-maintenance-for-agencies"],["Taking over an existing WordPress website","/blog/taking-over-an-existing-wordpress-website"]],
  smallBusinesses:[["Small business website maintenance checklist","/blog/small-business-website-maintenance-checklist"],["Website maintenance costs and pricing","/blog/website-maintenance-costs-and-pricing"]],
  education:[["How to choose a maintenance partner","/blog/how-to-choose-a-website-maintenance-partner"],["Why QA matters after every update","/blog/why-qa-matters-after-every-update"]],
  healthcare:[["Taking over an existing WordPress website","/blog/taking-over-an-existing-wordpress-website"],["What happens after a technical SEO audit","/blog/what-happens-after-a-technical-seo-audit"]],
  ecommerce:[["What happens after a technical SEO audit","/blog/what-happens-after-a-technical-seo-audit"],["Why QA matters after every update","/blog/why-qa-matters-after-every-update"]],
};

export function IndustryPage({ type }: { type: IndustryKey }) {
  const industry = industries[type];
  const faq = industryFaqs[type];
  const url = `${site.url}/${industry.slug}`;
  const teamLabel = type==="nonprofits"?"Nonprofit":industry.label;
  const requestLabel = type==="nonprofits"?"nonprofit":industry.label.toLowerCase();
  return <main>
    <JsonLd data={{"@context":"https://schema.org","@graph":[{"@type":"Service","@id":`${url}#service`,name:industry.title,serviceType:`Website support for ${industry.label}`,url,description:industry.intro,provider:{"@id":organizationId},isPartOf:{"@id":websiteId},areaServed:["United States","Europe","Serbia","International"],audience:{"@type":"Audience",audienceType:industry.label}},{"@type":"BreadcrumbList","@id":`${url}#breadcrumb`,itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`${site.url}/`},{"@type":"ListItem",position:2,name:"Industries",item:`${site.url}/industries`},{"@type":"ListItem",position:3,name:industry.label,item:url}]},{"@type":"FAQPage","@id":`${url}#faq`,mainEntity:faq.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))}]}}/>
    <section className="grid-bg" style={{padding:"140px 0 100px",position:"relative",overflow:"hidden"}}>
      <TechVisual/>
      <div className="shell" style={{position:"relative",zIndex:2}}>
        <span className="eyebrow">Industry support · US & international</span>
        <h1 style={{fontSize:"clamp(48px,8vw,92px)",lineHeight:1.02,maxWidth:1050,margin:"22px 0 28px"}}>{industry.title}</h1>
        <p className="lede">{industry.intro}</p>
        {type==="nonprofits"?<ul className="nonprofit-hero-signals" aria-label="Nonprofit website support highlights"><li>Donation &amp; form QA</li><li>30/60/90-day action plan</li><li>Monthly WordPress care</li></ul>:null}
        <div style={{display:"flex",gap:12,marginTop:35,flexWrap:"wrap"}}>{type==="nonprofits"?<><TrackedLink tracking="cta" trackingLocation="nonprofit_hero" trackingLabel="Request a nonprofit website audit" href="#nonprofit-audit" className="btn">Request a nonprofit website audit</TrackedLink><TrackedLink tracking="cta" trackingLocation="nonprofit_hero" trackingLabel="Discuss monthly website care" href="#rfp" className="btn ghost">Discuss monthly care</TrackedLink></>:<><TrackedLink tracking="cta" trackingLocation="industry_hero" trackingLabel="Discuss your website" href="#rfp" className="btn">Discuss your website</TrackedLink><Link href="/case-studies" className="btn ghost">View case studies</Link></>}</div>
      </div>
    </section>
    {type==="nonprofits"&&<NonprofitPrioritySection/>}
    <section className="section ambient-code ambient-left"><div className="shell">
      <SectionHead eyebrow="Who this is for" title={`${teamLabel} teams that need dependable website ownership.`} copy={industry.who}/>
      <CardGrid items={industry.problems} eyebrow="Problems Dimaso solves"/>
    </div></section>
    <section className="section ambient-code ambient-right"><div className="shell">
      <SectionHead eyebrow="Services and deliverables" title={type==="nonprofits"?"Nonprofit website maintenance across the full lifecycle.":type==="agencies"?"White-label WordPress support and web development capacity.":"Practical support across the website lifecycle."} copy={industry.deliverablesCopy}/>
      <CardGrid items={industry.deliverables} eyebrow="Deliverable"/>
      <div style={{display:"flex",gap:24,flexWrap:"wrap",marginTop:36}}>{industry.relatedServices.map((slug)=><Link key={slug} className="text-link" href={`/${slug}`}>{serviceBySlug[slug]?.label || slug} →</Link>)}</div>
    </div></section>
    <section className="section ambient-code ambient-left"><div className="shell">
      <SectionHead eyebrow="Common requests" title={`Website work ${requestLabel} teams often need handled.`} copy="These are practical request types that fit ongoing website support, redesign planning, technical SEO, CMS care, or development backlog work."/>
      <CardGrid items={industry.commonRequests} eyebrow="Request"/>
      <div style={{display:"flex",gap:24,flexWrap:"wrap",marginTop:36}}>{industryGuides[type]?.map(([label,href])=><Link key={href} className="text-link" href={href}>{label} →</Link>)}</div>
    </div></section>
    <section className="section ambient-code ambient-right"><div className="shell">
      <SectionHead eyebrow="Why Dimaso" title="Remote senior support with clear structure and long-term care." copy={industry.whyCopy}/>
      <CardGrid items={["Remote collaboration with US and international teams","Senior technical ownership across maintenance, development, design, QA, and SEO","Crawlable service and industry content that is easier for search and AI tools to understand","Support shaped around real constraints, RFPs, budgets, and long-term website care"]} eyebrow="Reason"/>
    </div></section>
    <section className="section ambient-code ambient-left"><div className="shell">
      <SectionHead eyebrow="Relevant examples" title="Related work from the Dimaso portfolio." copy={industry.caseStudyIntro}/>
      <div style={{marginTop:50}}><Cases slugs={[...industry.caseSlugs]} limit={3}/></div>
    </div></section>
    <FAQSection eyebrow={`FAQ / ${industry.label}`} title={`Questions about website support for ${industry.label.toLowerCase()}.`} copy="Short answers about scope, remote collaboration, maintenance, technical SEO, and ongoing support." items={faq}/>
    <CTA title={type==="nonprofits"?"Need a reliable partner for your nonprofit website?":`Need website support for ${industry.label.toLowerCase()}?`} label={type==="nonprofits"?"Request your website audit":"Send your RFP"}/>
  </main>;
}

function NonprofitPrioritySection(){
  const auditItems=["Donation, contact, volunteer, and event form QA","WordPress or CMS health, updates, backups, and security review","Accessibility basics, mobile behavior, and priority-page clarity","Analytics, technical SEO, indexation, and tracking checks","A prioritized 30-, 60-, and 90-day action plan"];
  const monthlyItems=["Preventive website and form checks","CMS updates, fixes, and content support","Security, backups, uptime, and performance review","Accessibility and technical SEO improvements","Monthly reporting and a prioritized improvement backlog"];
  return <section id="nonprofit-audit" className="section nonprofit-priority"><div className="shell">
    <SectionHead eyebrow="A practical first step" title="Start with a focused nonprofit website audit." copy="We review the parts of the website that protect donations, participation, public trust, and day-to-day publishing. You receive a clear list of risks, quick wins, and the work that deserves budget next."/>
    <div className="nonprofit-offer-grid">
      <Reveal><article className="card nonprofit-offer-card"><span className="eyebrow">Initial audit</span><h3>Know what needs attention before committing to a larger project.</h3><ul>{auditItems.map(item=><li key={item}>{item}</li>)}</ul><TrackedLink tracking="cta" trackingLocation="nonprofit_audit" trackingLabel="Request the audit" className="btn" href="#rfp">Request the audit</TrackedLink></article></Reveal>
      <Reveal><article className="card nonprofit-offer-card"><span className="eyebrow">Monthly website care</span><h3>Keep critical website work moving without adding an internal web team.</h3><ul>{monthlyItems.map(item=><li key={item}>{item}</li>)}</ul><TrackedLink tracking="cta" trackingLocation="nonprofit_monthly_care" trackingLabel="Discuss monthly support" className="btn ghost" href="#rfp">Discuss monthly support</TrackedLink></article></Reveal>
    </div>
    <Reveal><aside className="nonprofit-proof"><div><span className="eyebrow">Relevant institutional work</span><h3>Art &amp; Science</h3><p>We structured and supported an information-rich platform that connects scientific, educational, event, and editorial content. The work included information architecture, content migration planning, responsive templates, metadata, and technical SEO. These patterns are directly relevant to mission-driven organizations.</p></div><Link className="text-link" href="/case-studies/art-and-science">See the case study →</Link></aside></Reveal>
    <p className="nonprofit-guide-link">Planning internally first? Use our <Link href="/blog/website-maintenance-checklist-for-nonprofits">nonprofit website maintenance checklist</Link> to review current risks, then compare <Link href="/blog/nonprofit-website-redesign-cost">nonprofit website redesign costs</Link> when the findings point to structural work.</p>
  </div></section>;
}

function CardGrid({ items, eyebrow }: { items: readonly string[]; eyebrow: string }) {
  return <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:14,marginTop:50}} className="cards-grid">{items.map((item,index)=><Reveal key={item}><div className="card"><span className="eyebrow">{eyebrow} / 0{index+1}</span><h3 style={{fontSize:25,lineHeight:1.3}}>{item}</h3></div></Reveal>)}</div>;
}

import Link from "next/link";
import { Cases, FAQSection, Reveal, SectionHead } from "@/components/sections";
import { CTA, JsonLd } from "@/components/site";
import { industries, industryFaqs, IndustryKey, services } from "@/content/data";
import { organizationId, site, websiteId } from "@/lib/site";
import { TechVisual } from "@/components/tech-visual";

const serviceBySlug = Object.values(services).reduce<Record<string, (typeof services)[keyof typeof services]>>((acc, service) => {
  acc[service.slug] = service;
  return acc;
}, {});

export function IndustryPage({ type }: { type: IndustryKey }) {
  const industry = industries[type];
  const faq = industryFaqs[type];
  const url = `${site.url}/${industry.slug}`;
  return <main>
    <JsonLd data={{"@context":"https://schema.org","@graph":[{"@type":"Service","@id":`${url}#service`,name:industry.title,serviceType:`Website support for ${industry.label}`,url,description:industry.intro,provider:{"@id":organizationId},isPartOf:{"@id":websiteId},areaServed:["United States","Europe","Serbia","International"],audience:{"@type":"Audience",audienceType:industry.label}},{"@type":"BreadcrumbList","@id":`${url}#breadcrumb`,itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`${site.url}/`},{"@type":"ListItem",position:2,name:"Industries",item:`${site.url}/#industries`},{"@type":"ListItem",position:3,name:industry.label,item:url}]},{"@type":"FAQPage","@id":`${url}#faq`,mainEntity:faq.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))}]}}/>
    <section className="grid-bg" style={{padding:"140px 0 100px",position:"relative",overflow:"hidden"}}>
      <TechVisual/>
      <div className="shell" style={{position:"relative",zIndex:2}}>
        <span className="eyebrow">Industry support · US & international</span>
        <h1 style={{fontSize:"clamp(48px,8vw,92px)",lineHeight:1.02,maxWidth:1050,margin:"22px 0 28px"}}>{industry.title}</h1>
        <p className="lede">{industry.intro}</p>
        <div style={{display:"flex",gap:12,marginTop:35,flexWrap:"wrap"}}><Link href="#rfp" className="btn">Send your RFP</Link><Link href="/case-studies" className="btn ghost">View case studies</Link></div>
      </div>
    </section>
    <section className="section ambient-code ambient-left"><div className="shell">
      <SectionHead eyebrow="Who this is for" title={`${industry.label} teams that need dependable website ownership.`} copy={industry.who}/>
      <CardGrid items={industry.problems} eyebrow="Problems Dimaso solves"/>
    </div></section>
    <section className="section ambient-code ambient-right"><div className="shell">
      <SectionHead eyebrow="Services and deliverables" title="Practical support across the website lifecycle." copy={industry.deliverablesCopy}/>
      <CardGrid items={industry.deliverables} eyebrow="Deliverable"/>
      <div style={{display:"flex",gap:24,flexWrap:"wrap",marginTop:36}}>{industry.relatedServices.map((slug)=><Link key={slug} className="text-link" href={`/${slug}`}>{serviceBySlug[slug]?.label || slug} →</Link>)}</div>
    </div></section>
    <section className="section ambient-code ambient-left"><div className="shell">
      <SectionHead eyebrow="Common requests" title={`Website work ${industry.label.toLowerCase()} teams often need handled.`} copy="These are practical request types that fit ongoing website support, redesign planning, technical SEO, CMS care, or development backlog work."/>
      <CardGrid items={industry.commonRequests} eyebrow="Request"/>
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
    <CTA title={`Need website support for ${industry.label.toLowerCase()}?`} label="Send your RFP"/>
  </main>;
}

function CardGrid({ items, eyebrow }: { items: readonly string[]; eyebrow: string }) {
  return <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:14,marginTop:50}} className="cards-grid">{items.map((item,index)=><Reveal key={item}><div className="card"><span className="eyebrow">{eyebrow} / 0{index+1}</span><h3 style={{fontSize:25,lineHeight:1.3}}>{item}</h3></div></Reveal>)}</div>;
}

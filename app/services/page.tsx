import Link from "next/link";
import { Cases, FAQSection, IndustryCards, ProcessStack, Reveal, SectionHead, ServiceCards } from "@/components/sections";
import { CTA, JsonLd } from "@/components/site";
import { TechVisual } from "@/components/tech-visual";
import { services } from "@/content/data";
import { metadata as meta, organizationId, site, websiteId } from "@/lib/site";

export const metadata = meta(
  "Website Maintenance, Development & Design Services",
  "Explore Dimaso website maintenance, web development, web design, WordPress support, technical SEO, and AI website support for US and international teams.",
  "/services",
);

const serviceFaq = [
  ["Can Dimaso support an existing website?", "Yes. Dimaso can audit, maintain, repair, redesign, or extend an existing website. Many engagements begin with a support backlog, takeover review, technical audit, or urgent production issue."],
  ["Does Dimaso work with US and international organizations?", "Yes. The team works remotely with US and international organizations from Novi Sad, Serbia, using clear ownership, documented priorities, structured QA, and practical time-zone overlap."],
  ["Can one engagement include design, development, and maintenance?", "Yes. Dimaso can connect design, development, technical SEO, QA, and post-launch maintenance so decisions stay consistent across the full website lifecycle."],
  ["Do you offer ongoing monthly website support?", "Yes. Monthly support can include updates, fixes, QA, backups, security checks, performance work, analytics, technical SEO, content support, reporting, and prioritized improvements."],
  ["How does a new engagement start?", "We first review the business context, current platform, risks, goals, access, stakeholders, and timeline. Then we define the most useful starting scope, delivery rhythm, and measurable priorities."],
] as const;

const engagementPaths = [
  ["Protect an active website", "Ongoing maintenance, WordPress support, QA, backups, security, performance, analytics, and a visible improvement backlog.", "/services/website-maintenance"],
  ["Build or extend a system", "Custom development, CMS workflows, ecommerce logic, migrations, integrations, APIs, and business-specific website functionality.", "/services/web-development"],
  ["Clarify and redesign the experience", "Website strategy, UX structure, responsive design, landing pages, conversion paths, and developer-ready interface systems.", "/services/web-design"],
  ["Improve discovery and measurement", "Technical SEO, crawlability, schema, internal links, Core Web Vitals, GA4, GSC, and practical AI search visibility.", "/services/technical-seo"],
] as const;

export default function ServicesPage() {
  const url = `${site.url}/services`;
  const serviceList = Object.values(services);

  return <main>
    <JsonLd data={{"@context":"https://schema.org","@graph":[{"@type":"CollectionPage","@id":`${url}#collection`,url,name:"Dimaso website services",description:"Website maintenance, development, design, WordPress, technical SEO, and AI website support for US and international organizations.",isPartOf:{"@id":websiteId},about:{"@id":organizationId},mainEntity:{"@id":`${url}#services`}},{"@type":"ItemList","@id":`${url}#services`,name:"Dimaso website services",numberOfItems:serviceList.length,itemListElement:serviceList.map((service,index)=>({"@type":"ListItem",position:index+1,name:service.label,url:`${site.url}/${service.slug}`}))},{"@type":"BreadcrumbList","@id":`${url}#breadcrumb`,itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`${site.url}/`},{"@type":"ListItem",position:2,name:"Services",item:url}]},{"@type":"FAQPage","@id":`${url}#faq`,mainEntity:serviceFaq.map(([question,answer])=>({"@type":"Question",name:question,acceptedAnswer:{"@type":"Answer",text:answer}}))}]}}/>

    <section className="grid-bg" style={{padding:"140px 0 100px",position:"relative",overflow:"hidden"}}>
      <TechVisual/>
      <div className="shell" style={{position:"relative",zIndex:2}}>
        <span className="eyebrow">Website services · US & international</span>
        <h1 style={{fontSize:"clamp(44px,8vw,92px)",lineHeight:1.02,maxWidth:1080,margin:"22px 0 28px",overflowWrap:"anywhere"}}>Website services for teams that need a dependable technical partner.</h1>
        <p className="lede">Dimaso connects website maintenance, web development, web design, WordPress support, technical SEO, QA, analytics, and AI website visibility. Clients can start with one focused project or build a long-term support relationship around the full website lifecycle.</p>
        <div style={{display:"flex",gap:12,marginTop:35,flexWrap:"wrap"}}><Link href="#service-directory" className="btn">Explore services</Link><Link href="/case-studies" className="btn ghost">View case studies</Link></div>
      </div>
    </section>

    <section id="service-directory" className="section ambient-code ambient-left"><div className="shell">
      <SectionHead eyebrow="Service directory" title="Choose the capability that matches the problem in front of you." copy="Each service page explains typical requests, deliverables, process, proof, related industries, and practical questions before an RFP or first conversation."/>
      <div style={{marginTop:55}}><ServiceCards/></div>
    </div></section>

    <section className="section ambient-code ambient-right"><div className="shell">
      <SectionHead eyebrow="Where to start" title="The right starting point depends on what the website needs to do next." copy="You do not need to diagnose the technical solution before contacting us. These common situations help identify the most useful first conversation."/>
      <div className="cards-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:14,marginTop:50}}>
        {engagementPaths.map(([title,copy,href],index)=><Reveal key={title}><article className="card" style={{minHeight:260,display:"flex",flexDirection:"column"}}><span className="eyebrow">Starting point / 0{index+1}</span><h3 style={{fontSize:27,lineHeight:1.25,margin:"24px 0 16px"}}>{title}</h3><p className="muted">{copy}</p><Link className="text-link" style={{marginTop:"auto"}} href={href}>Explore the relevant service →</Link></article></Reveal>)}
      </div>
    </div></section>

    <section className="section ambient-code ambient-left"><div className="shell"><ProcessStack title="One delivery model from first review to continuous improvement."/></div></section>

    <section className="section ambient-code ambient-right"><div className="shell">
      <SectionHead eyebrow="Industries" title="Technical work shaped around the organization behind the website." copy="The same platform problem can carry different operational risk for a nonprofit, association, agency, healthcare provider, education team, small business, or ecommerce company."/>
      <div style={{marginTop:50}}><IndustryCards/></div>
      <Link className="btn ghost" style={{marginTop:30}} href="/industries">Explore all industries</Link>
    </div></section>

    <section className="section ambient-code ambient-left"><div className="shell">
      <SectionHead eyebrow="Selected work" title="See how service decisions connect to real business context." copy="The case studies explain the original problem, technical and design work, delivery decisions, and the outcome the website needed to support."/>
      <div style={{marginTop:50}}><Cases limit={2}/></div>
      <Link className="btn ghost" style={{marginTop:30}} href="/case-studies">View all case studies</Link>
    </div></section>

    <FAQSection eyebrow="FAQ / Services" title="Questions about working with Dimaso." copy="A practical overview of scope, international collaboration, ongoing support, and how a new engagement begins." items={serviceFaq}/>
    <CTA title="Not sure which service fits the current problem?" label="Send the context for review"/>
  </main>;
}

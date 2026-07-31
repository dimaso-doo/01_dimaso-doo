import Link from "next/link";
import { Cases, FAQSection, IndustryCards, Reveal, SectionHead, ServiceCards } from "@/components/sections";
import { CTA, JsonLd } from "@/components/site";
import { TechVisual } from "@/components/tech-visual";
import { industries } from "@/content/data";
import { metadata as meta, organizationId, site, websiteId } from "@/lib/site";

export const metadata = meta(
  "Website Support by Industry",
  "Website maintenance, development, WordPress, technical SEO, and support for nonprofits, associations, agencies, SMBs, education, healthcare, and ecommerce.",
  "/industries",
);

const industryFaq = [
  ["Which industries does Dimaso support?", "Dimaso works with nonprofits, associations, agencies, small businesses, education organizations, healthcare organizations, ecommerce teams, and other organizations with active websites that need dependable technical ownership."],
  ["Can Dimaso learn a specialized business or content model?", "Yes. Every engagement begins with the organization, audience, workflows, risks, publishing needs, and technical constraints. The website is treated as part of the operating model, not as an isolated design task."],
  ["Do you work with internal marketing and technical teams?", "Yes. Dimaso can own a defined scope or collaborate with internal marketing, communications, product, design, and engineering teams with clear responsibilities and release processes."],
  ["Can industry support include ongoing maintenance?", "Yes. Maintenance can include platform updates, forms, content, QA, security, backups, performance, analytics, technical SEO, reporting, and an ordered improvement backlog."],
  ["Can you respond to an RFP?", "Yes. Share the business context, current platform, goals, constraints, required services, timeline, and any available files. A senior team member will review the material directly."],
] as const;

const sharedNeeds = [
  ["Reliable public journeys", "Donation, membership, inquiry, admissions, booking, checkout, and contact flows need deliberate QA because they connect the website to real organizational outcomes."],
  ["Content teams can work safely", "CMS structures, reusable page patterns, documentation, and controlled releases help nontechnical teams publish without creating avoidable technical risk."],
  ["Risk stays visible", "Updates, security, backups, accessibility, performance, integrations, analytics, and technical SEO need a clear owner and an understandable priority order."],
  ["The website keeps improving", "A useful support relationship connects recurring maintenance with evidence-based design, development, content, and acquisition improvements."],
] as const;

export default function IndustriesPage() {
  const url = `${site.url}/industries`;
  const industryList = Object.values(industries);

  return <main>
    <JsonLd data={{"@context":"https://schema.org","@graph":[{"@type":"CollectionPage","@id":`${url}#collection`,url,name:"Industries Dimaso supports",description:"Website support for nonprofits, associations, agencies, small businesses, education, healthcare, and ecommerce organizations.",isPartOf:{"@id":websiteId},about:{"@id":organizationId},mainEntity:{"@id":`${url}#industries`}},{"@type":"ItemList","@id":`${url}#industries`,name:"Industries Dimaso supports",numberOfItems:industryList.length,itemListElement:industryList.map((industry,index)=>({"@type":"ListItem",position:index+1,name:industry.label,url:`${site.url}/${industry.slug}`}))},{"@type":"BreadcrumbList","@id":`${url}#breadcrumb`,itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`${site.url}/`},{"@type":"ListItem",position:2,name:"Industries",item:url}]},{"@type":"FAQPage","@id":`${url}#faq`,mainEntity:industryFaq.map(([question,answer])=>({"@type":"Question",name:question,acceptedAnswer:{"@type":"Answer",text:answer}}))}]}}/>

    <section className="grid-bg" style={{padding:"140px 0 100px",position:"relative",overflow:"hidden"}}>
      <TechVisual/>
      <div className="shell" style={{position:"relative",zIndex:2}}>
        <span className="eyebrow">Industries · US & international</span>
        <h1 style={{fontSize:"clamp(44px,8vw,92px)",lineHeight:1.02,maxWidth:1080,margin:"22px 0 28px",overflowWrap:"anywhere"}}>Website support shaped around how your organization actually works.</h1>
        <p className="lede">Dimaso supports organizations whose websites carry operational responsibility: generating inquiries, collecting donations, serving members, publishing programs, supporting patients or students, enabling agency delivery, and processing ecommerce orders.</p>
        <div style={{display:"flex",gap:12,marginTop:35,flexWrap:"wrap"}}><Link href="#industry-directory" className="btn">Explore industries</Link><Link href="/services" className="btn ghost">View all services</Link></div>
      </div>
    </section>

    <section id="industry-directory" className="section ambient-code ambient-left"><div className="shell">
      <SectionHead eyebrow="Industry directory" title="Relevant experience starts with understanding the operating context." copy="Each industry page connects common website risks, deliverables, service options, practical requests, case studies, and questions specific to that kind of organization."/>
      <div style={{marginTop:50}}><IndustryCards/></div>
    </div></section>

    <section className="section ambient-code ambient-right"><div className="shell">
      <SectionHead eyebrow="Shared priorities" title="Different organizations still depend on the same foundations of trust." copy="Industry context changes the details, but dependable websites share a few operating principles that should remain visible in every engagement."/>
      <div className="cards-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:14,marginTop:50}}>
        {sharedNeeds.map(([title,copy],index)=><Reveal key={title}><article className="card" style={{minHeight:250}}><span className="eyebrow">Priority / 0{index+1}</span><h3 style={{fontSize:27,lineHeight:1.25,margin:"24px 0 16px"}}>{title}</h3><p className="muted">{copy}</p></article></Reveal>)}
      </div>
    </div></section>

    <section className="section ambient-code ambient-left"><div className="shell">
      <SectionHead eyebrow="Capabilities" title="Bring in the service the organization needs now, then keep the wider system connected." copy="Dimaso can own a focused maintenance, development, design, WordPress, technical SEO, or AI visibility scope, or coordinate those capabilities as one long-term website partner."/>
      <div style={{marginTop:55}}><ServiceCards/></div>
      <Link className="btn ghost" style={{marginTop:30}} href="/services">Explore all services</Link>
    </div></section>

    <section className="section ambient-code ambient-right"><div className="shell">
      <SectionHead eyebrow="Project evidence" title="Industry knowledge becomes useful when it changes delivery decisions." copy="Selected work shows how Dimaso connects audience needs, content structure, business workflows, technical implementation, QA, and long-term support."/>
      <div style={{marginTop:50}}><Cases limit={4}/></div>
      <Link className="btn ghost" style={{marginTop:30}} href="/case-studies">View all case studies</Link>
    </div></section>

    <FAQSection eyebrow="FAQ / Industries" title="Questions about industry-focused website support." copy="How Dimaso learns the context, works with internal teams, handles ongoing support, and reviews RFPs." items={industryFaq}/>
    <CTA title="Need a website partner who understands the operating context?" label="Send your RFP or project brief"/>
  </main>;
}

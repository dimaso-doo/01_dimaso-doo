import Link from "next/link";
import { serviceFaqs, services, ServiceKey } from "@/content/data";
import { Cases, FAQSection, ProcessStack, Reveal, SectionHead } from "./sections";
import { CTA, JsonLd } from "./site";
import { organizationId, site, websiteId } from "@/lib/site";
import { TechVisual } from "./tech-visual";

const relevantCaseStudies: Record<ServiceKey, readonly string[]> = {
 maintenance:["forever-living-shop","mega-baza"],
 development:["forever-living-shop","call-the-waiter"],
 design:["doctor-medica","brightside-kosmaj"],
 wordpress:["med-supply-solutions","one-llama-travels"],
 technicalSeo:["art-and-science","med-supply-solutions"],
 aiSupport:["one-llama-travels","art-and-science"],
};

const relatedIndustries: Record<ServiceKey, readonly (readonly [string,string])[]> = {
 maintenance:[["Nonprofit website maintenance","/industries/nonprofits"],["Association website support","/industries/associations"],["Small business website support","/industries/small-businesses"],["Ecommerce website support","/industries/ecommerce"]],
 development:[["White-label web development for agencies","/industries/agencies"],["Ecommerce development","/industries/ecommerce"],["Healthcare website development","/industries/healthcare"],["Education website development","/industries/education"]],
 design:[["Small business web design","/industries/small-businesses"],["Healthcare web design","/industries/healthcare"],["Ecommerce web design","/industries/ecommerce"],["Nonprofit web design","/industries/nonprofits"]],
 wordpress:[["WordPress support for nonprofits","/industries/nonprofits"],["Association WordPress support","/industries/associations"],["WooCommerce support","/industries/ecommerce"],["White-label WordPress support","/industries/agencies"]],
 technicalSeo:[["Ecommerce technical SEO","/industries/ecommerce"],["Healthcare technical SEO","/industries/healthcare"],["Education technical SEO","/industries/education"],["Nonprofit technical SEO","/industries/nonprofits"]],
 aiSupport:[["Agency AI workflow support","/industries/agencies"],["Nonprofit AI visibility","/industries/nonprofits"],["Association AI visibility","/industries/associations"],["Education AI support","/industries/education"]],
};

const serviceHeroCopy:Record<ServiceKey,string>={
 maintenance:"Ongoing website care for teams that need updates, fixes, QA, backups, security, performance, and small improvements owned by one dependable partner.",
 development:"Custom web development for business rules, integrations, ecommerce, migrations, and workflows that standard website tools cannot support reliably.",
 design:"Web design that connects positioning, UX structure, responsive interfaces, conversion paths, and the technical reality of implementation.",
 wordpress:"Senior WordPress support for safer updates, WooCommerce, Elementor, fixes, performance, migrations, security, and ongoing care.",
 technicalSeo:"Technical SEO that turns crawl, indexing, metadata, schema, internal linking, and Core Web Vitals findings into implemented improvements.",
 aiSupport:"Practical AI visibility and workflow support built around clearer content, structured data, internal knowledge, and useful automation.",
};

export function ServicePage({type}:{type:ServiceKey}) {
 const s=services[type];
 const faq=serviceFaqs[type];
 return <main>
 <JsonLd data={{"@context":"https://schema.org","@graph":[{"@type":"Service","@id":`${site.url}/${s.slug}#service`,name:s.label,serviceType:s.serviceType,url:`${site.url}/${s.slug}`,description:s.intro,provider:{"@id":organizationId},isPartOf:{"@id":websiteId},audience:{"@type":"BusinessAudience",audienceType:"Businesses"},areaServed:["US","International"]},{"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`${site.url}/`},{"@type":"ListItem",position:2,name:"Services",item:`${site.url}/services`},{"@type":"ListItem",position:3,name:s.label,item:`${site.url}/${s.slug}`}]},{"@type":"FAQPage",mainEntity:faq.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))}]}}/>
  <section className="grid-bg service-hero"><TechVisual/><div className="shell"><span className="eyebrow">{s.eyebrow} · US & international</span><h1>{s.title}</h1><p className="lede">{serviceHeroCopy[type]}</p><div className="hero-actions"><Link href="#rfp" className="btn">Discuss your website</Link><Link href="/case-studies" className="btn ghost">See relevant work</Link></div><p className="hero-assurance">Direct senior review · Brief optional · Practical next step</p></div></section>
  <section className="section service-section service-cover-section ambient-code ambient-left"><div className="shell"><SectionHead eyebrow="What we cover" title={`${s.label} with senior ownership.`} copy={s.coverCopy}/><div className="maintenance-cover-grid cards-grid">{s.keywords.map((x,i)=><Reveal key={x}><div className={`card maintenance-cover-card cover-card-${i+1}`}><div className="cover-motion"><span/><span/><span/></div><span>0{i+1}</span><h3>{x}</h3></div></Reveal>)}</div></div></section>
  <ServiceQualification type={type}/>
  {type==="development"&&<DevelopmentSystems/>}
  {type==="design"&&<DesignClarity/>}
  {type==="maintenance"&&<MaintenanceRhythm/>}
  {type==="maintenance"&&<MaintenanceSLA/>}
  {type!=="maintenance"&&type!=="development"&&type!=="design"&&<ServiceProofSnippets type={type}/>}
  <CTA title={`Need senior ownership for ${s.label.toLowerCase()}?`} label="Discuss the current website"/>
  <section className="section service-section ambient-code ambient-right"><div className="shell"><SectionHead eyebrow="Relevant work" title="Outcomes shaped by context, not templates."/><div style={{marginTop:50}}><Cases limit={2} slugs={[...relevantCaseStudies[type]]}/></div><div style={{display:"flex",gap:24,flexWrap:"wrap",marginTop:36}}>{relatedIndustries[type].map(([label,href])=><Link key={href} className="text-link" href={href}>{label} →</Link>)}</div></div></section>
  <section className="section service-section service-process-section ambient-code ambient-left"><div className="shell"><ProcessStack items={s.process} title="A process built for momentum and confidence."/></div></section>
  <FAQSection eyebrow={`FAQ / ${s.label}`} title={`Questions about ${s.label.toLowerCase()}.`} copy="Practical answers about scope, collaboration, quality, and how the service works in real business conditions." items={faq}/>
 </main>;
}

function ServiceQualification({type}:{type:ServiceKey}) {
 const content={
  maintenance:{eyebrow:"Who it is for",title:"Built for teams that cannot leave website reliability to chance.",points:["Active business websites","Recurring updates","Important lead or checkout flows","Teams without dedicated internal technical ownership"]},
  development:{eyebrow:"Investment fit",title:"When custom web development is the right investment.",points:["Standard plugins cannot support the workflow","Systems need to exchange data reliably","Manual administration is slowing the team down","Legacy implementation blocks performance or growth","The website needs operational product behavior"]},
  design:{eyebrow:"Engagement deliverables",title:"What a web design engagement can deliver.",points:["Page and navigation structure","Content hierarchy and conversion paths","Responsive page designs","Reusable interface patterns","Landing-page concepts","Developer-ready specifications and implementation support"]},
  wordpress:{eyebrow:"Who it is for",title:"WordPress support for teams that need the website to stay dependable.",points:["WordPress sites with recurring update needs","Elementor and theme maintenance","WooCommerce stores and important forms","Teams that need security, backups, and performance owned"]},
  technicalSeo:{eyebrow:"Deliverables",title:"Technical SEO that turns audits into implemented fixes.",points:["Indexing and crawlability review","Metadata, schema, sitemap, and robots.txt cleanup","Internal linking and URL hygiene","Core Web Vitals, GA4, and GSC support"]},
  aiSupport:{eyebrow:"Practical AI support",title:"AI visibility and workflow support without overcomplicating the business.",points:["AI-readable service and industry structure","Schema.org, llms.txt, and internal links","AI-assisted audits and reporting","Workflow automation and knowledge-base support"]},
 } satisfies Record<ServiceKey,{eyebrow:string;title:string;points:readonly string[]}>;
 const item=content[type];
 const service=services[type];
 return <section className="section service-section ambient-code ambient-left"><div className="shell">
  <SectionHead eyebrow={item.eyebrow} title={item.title} copy={type==="maintenance"?"Dimaso provides ongoing website maintenance and support for teams that need dependable technical ownership without building a full internal web team.":type==="development"?"Custom development is most valuable when the website must support real business rules, connected systems, and workflows that generic tools cannot handle reliably.":type==="design"?"The engagement connects business context, UX, responsive design, and implementation detail so the resulting website is clear, consistent, and ready to build.":type==="wordpress"?"WordPress support is most valuable when updates, fixes, security, backups, and page-builder changes need a calm technical owner.":type==="technicalSeo"?"Technical SEO should make important pages easier to crawl, index, understand, measure, and improve.":"AI website support should make the business easier for people, search engines, and AI tools to understand without pretending every team needs a large AI program."}/>
  <div className="service-decision-grid">
   <div className="service-decision-column"><span className="eyebrow">Good fit when</span>{item.points.slice(0,4).map((point,index)=><div className="service-decision-item" key={point}><span>0{index+1}</span><strong>{point}</strong></div>)}</div>
   <div className="service-decision-column"><span className="eyebrow">Common requests</span>{service.commonRequests.slice(0,4).map((request,index)=><div className="service-decision-item" key={request}><span>0{index+1}</span><strong>{request}</strong></div>)}</div>
  </div>
  <RelatedServiceLinks type={type}/>
 </div></section>;
}

function RelatedServiceLinks({type}:{type:ServiceKey}) {
 const links:Record<ServiceKey,readonly (readonly [string,string])[]>={
  maintenance:[["Website maintenance costs and pricing","/blog/website-maintenance-costs-and-pricing"],["Small business website maintenance checklist","/blog/small-business-website-maintenance-checklist"],["Nonprofit website maintenance checklist","/blog/website-maintenance-checklist-for-nonprofits"],["How to choose a maintenance partner","/blog/how-to-choose-a-website-maintenance-partner"]],
  development:[["When custom development is worth it","/blog/when-custom-web-development-is-worth-it"],["Website migration guide","/blog/website-migration-without-losing-seo-value"],["Post-launch website care","/services/website-maintenance"],["Ecommerce support","/industries/ecommerce"]],
  design:[["Website redesign checklist","/blog/what-to-check-before-redesigning"],["Nonprofit website redesign cost guide","/blog/nonprofit-website-redesign-cost"],["Development and implementation","/services/web-development"],["Post-launch website care","/services/website-maintenance"]],
  wordpress:[["Taking over an existing WordPress website","/blog/taking-over-an-existing-wordpress-website"],["White-label WordPress maintenance","/blog/white-label-wordpress-maintenance-for-agencies"],["Nonprofit website maintenance checklist","/blog/website-maintenance-checklist-for-nonprofits"],["Website maintenance services","/services/website-maintenance"]],
  technicalSeo:[["What happens after a technical SEO audit","/blog/what-happens-after-a-technical-seo-audit"],["Website migration guide","/blog/website-migration-without-losing-seo-value"],["AI visibility support","/services/ai-website-workflow-support"],["Custom web development","/services/web-development"]],
  aiSupport:[["Technical SEO","/services/technical-seo"],["Website maintenance","/services/website-maintenance"],["Website RFP checklist","/blog/how-to-prepare-a-website-rfp"],["Nonprofit support","/industries/nonprofits"]],
 };
 return <div style={{display:"flex",gap:24,flexWrap:"wrap",marginTop:36}}>{links[type].map(([label,href])=><Link key={href} className="text-link" href={href}>{label} →</Link>)}</div>;
}


function ServiceProofSnippets({type}:{type:ServiceKey}) {
 const service=services[type];
 const content={
  maintenance:{
   eyebrow:"Service proof",
   title:"What reliable website support should make visible.",
   copy:"Good maintenance reduces uncertainty. The proof is not only that tasks were completed, but that risks, releases, and next priorities are easier for the business to understand.",
   points:["Critical forms, checkout flows, and lead paths checked after meaningful changes","Monthly summaries that separate completed work, open risks, and next recommendations","Security, backup, uptime, and performance checks kept in a regular operating rhythm","Support decisions tied to business impact, not only technical ticket order"],
  },
  development:{
   eyebrow:"Service proof",
   title:"Examples of development work that creates operational value.",
   copy:"Useful development is easier to trust when the business can see what changed: workflows become clearer, integrations become safer, and production behavior becomes easier to support.",
   points:["Custom ecommerce rules, payment behavior, membership logic, and checkout workflows","Booking, CRM, analytics, inventory, and third-party API integrations with QA coverage","CMS structures that make publishing and page creation easier for internal teams","Migration-sensitive development that protects redirects, metadata, analytics, and launch stability"],
  },
  design:{
   eyebrow:"Service proof",
   title:"What should improve after a serious redesign.",
   copy:"A redesign should make the business easier to understand, not only make the interface look newer. The strongest proof is clearer structure, stronger conversion paths, and a system the team can extend.",
   points:["Clearer page hierarchy for services, proof, objections, and next actions","Navigation and landing-page concepts that reduce decision friction","Responsive layouts and reusable patterns prepared for real implementation","Design decisions connected to development, QA, accessibility, and post-launch care"],
  },
  wordpress:{
   eyebrow:"Service proof",
   title:"What reliable WordPress support should make visible.",
   copy:"WordPress support should reduce uncertainty around updates, plugins, forms, performance, security, backups, and editing workflows.",
   points:["Updates tested against important pages, forms, and responsive states","Plugin, theme, backup, and security risks documented clearly","WooCommerce or Elementor issues prioritized by business impact","Support summaries that explain what changed and what needs attention next"],
  },
  technicalSeo:{
   eyebrow:"Service proof",
   title:"What useful technical SEO work should produce.",
   copy:"Technical SEO should create implemented improvements, not only a long audit document.",
   points:["Important pages reachable through crawlable internal links","Metadata, schema, breadcrumbs, and sitemap signals aligned","Redirect, canonical, and indexation issues validated after changes","Performance and Core Web Vitals work tied to page templates and user journeys"],
  },
  aiSupport:{
   eyebrow:"Service proof",
   title:"What practical AI website support should improve.",
   copy:"AI support should make the website easier to understand, classify, cite, and operate.",
   points:["Clear service and industry pages with AI-readable opening paragraphs","Schema.org and llms.txt describing the real business accurately","Internal links that connect services, industries, case studies, blog, and contact paths","Workflow notes and reporting that help teams keep improving the site"],
  },
 } satisfies Record<ServiceKey,{eyebrow:string;title:string;copy:string;points:readonly string[]}>;
 const item=content[type];
 return <section className="section service-section ambient-code ambient-left"><div className="shell">
  <SectionHead eyebrow={item.eyebrow} title={item.title} copy={service.proofCopy || item.copy}/>
  <div className={`cards-grid service-proof-grid service-proof-${type}`}>
   {item.points.map((point,index)=><Reveal key={point}><div className={`card service-proof-card proof-visual-${index+1}`}>
    <div className="service-proof-visual" aria-hidden="true"><span/><span/><span/></div>
    <span className="eyebrow">Proof / 0{index+1}</span>
    <h3>{point}</h3>
   </div></Reveal>)}
  </div>
 </div></section>;
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

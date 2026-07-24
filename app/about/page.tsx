import Link from "next/link";
import { JsonLd } from "@/components/site";
import { SectionHead, Team } from "@/components/sections";
import { metadata as meta, organizationId, site, websiteId } from "@/lib/site";

export const metadata = meta("About Dimaso", "Meet the Dimaso team in Novi Sad, Serbia: senior specialists in website maintenance, web development, design, WordPress, technical SEO, and QA.", "/about");

const people = [
  ["Predrag Stojanovic", "Web Design & WordPress Developer"],
  ["Branislav Stojanovic", "Full Stack Developer"],
  ["Sandra Lukic", "QA & Technical Support"],
  ["Marko Milojevic", "Senior Web Developer"],
  ["Sanja Mazic", "Web QA & Project Support"],
] as const;

export default function AboutPage() {
  return <main>
    <JsonLd data={{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":organizationId,name:"Dimaso",url:site.url,email:site.email,telephone:site.phone,location:{"@type":"Place",name:"Novi Sad, Serbia"},areaServed:["United States","Europe","Serbia","International"],knowsAbout:["Website Maintenance","Web Development","Web Design","WordPress Support","Technical SEO","AI Website & Workflow Support","CMS Support","Hosting, Security, Backups","QA and Testing"]},{"@type":"WebPage","@id":`${site.url}/about#webpage`,url:`${site.url}/about`,name:"About Dimaso",isPartOf:{"@id":websiteId},about:{"@id":organizationId}},...people.map(([name,jobTitle])=>({"@type":"Person",name,jobTitle,worksFor:{"@id":organizationId}}))]}}/>
    <section className="grid-bg" style={{padding:"140px 0 100px",position:"relative",overflow:"hidden"}}>
      <div className="shell">
        <span className="eyebrow">About Dimaso</span>
        <h1 style={{fontSize:"clamp(48px,8vw,92px)",lineHeight:1.02,maxWidth:1020,margin:"22px 0 28px"}}>A practical website team for long-term digital care.</h1>
        <p className="lede">Dimaso is a web development, website maintenance, web design, WordPress support, technical SEO, and AI website support team based in Novi Sad, Serbia, working remotely with US and international nonprofits, associations, agencies, SMBs, education organizations, healthcare organizations, and ecommerce businesses.</p>
        <div style={{display:"flex",gap:12,marginTop:35,flexWrap:"wrap"}}><Link href="#rfp" className="btn">Send RFP</Link><Link href="/case-studies" className="btn ghost">View case studies</Link></div>
      </div>
    </section>
    <section className="section ambient-code ambient-left"><div className="shell"><SectionHead eyebrow="How we work" title="Senior ownership across maintenance, development, design, QA, and search visibility." copy="Dimaso is built for organizations that need calm technical execution after launch as much as they need good first delivery. We help teams keep websites reliable, structured, measurable, and ready to improve."/><div style={{display:"flex",gap:24,flexWrap:"wrap",marginTop:28}}><Link className="text-link" href="/services/website-maintenance">Website Maintenance →</Link><Link className="text-link" href="/services/web-development">Web Development →</Link><Link className="text-link" href="/services/technical-seo">Technical SEO →</Link><Link className="text-link" href="/services/ai-website-workflow-support">AI Website Support →</Link></div></div></section>
    <section className="section ambient-code ambient-right"><div className="shell"><SectionHead eyebrow="Team" title="The people doing the work stay close to the work."/><div style={{marginTop:50}}><Team/></div></div></section>
  </main>;
}

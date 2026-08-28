import { ContactForm } from "@/components/forms";
import { JsonLd } from "@/components/site";
import { TrackedLink } from "@/components/tracked-link";
import { metadata as meta,site } from "@/lib/site";

const linkedinUrl="https://www.linkedin.com/company/dimaso.co/";
const serviceOptions=["Website Maintenance","Web Development","Web Design","WordPress Support","WooCommerce Support","Technical SEO","AI Website & Workflow Support"] as const;

export const metadata=meta("Contact Our Website Support Team","Discuss website maintenance, development, redesign, WordPress, technical SEO, or support needs directly with a senior Dimaso team member.","/contact");

const nextSteps=[
  ["Send the context","Share the current website, the main problem, business goal, and any deadline or platform constraint you already know."],
  ["Senior review","A senior team member reviews the request, identifies the likely service fit, and notes the most important risks or questions."],
  ["Practical next step","We reply with focused questions and a recommended first step instead of routing you through a generic sales script."],
] as const;

export default async function Page({searchParams}:{searchParams:Promise<{service?:string|string[]}>}){
  const query=await searchParams;
  const requestedService=Array.isArray(query.service)?query.service[0]:query.service;
  const defaultService=requestedService&&serviceOptions.includes(requestedService as (typeof serviceOptions)[number])?requestedService:"";
  return <main>
    <JsonLd data={{"@context":"https://schema.org","@type":"ContactPage",url:`${site.url}/contact`,name:"Contact Dimaso"}}/>
    <section className="grid-bg contact-conversion-hero">
      <div className="shell contact-page-grid">
        <div className="contact-conversion-copy">
          <span className="eyebrow">Contact · senior review</span>
          <h1>Send the website and one priority.</h1>
          <p className="lede">A short description is enough. A senior Dimaso team member reviews the website, the main risk or backlog, and the most practical next step.</p>
        </div>
        <div className="contact-supporting-copy">
          <ul className="contact-confidence-list">
            <li>Direct access to the people responsible for delivery</li>
            <li>US and international collaboration</li>
            <li>Project briefs and RFP files welcome, but not required</li>
          </ul>
          <div className="contact-direct-links">
            <TrackedLink tracking="email" trackingLocation="contact_page" className="footer-contact-link email" href="mailto:office@dimaso.co">office@dimaso.co</TrackedLink>
            <TrackedLink tracking="phone" trackingLocation="contact_page" className="footer-contact-link phone" href="tel:+381611375150">+381 61 137 5150</TrackedLink>
            <TrackedLink tracking="linkedin" trackingLocation="contact_page" className="footer-contact-link linkedin" href={linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</TrackedLink>
          </div>
        </div>
        <div id="rfp" className="contact-rfp-column">
          <div className="footer-rfp-head contact-rfp-head"><span className="eyebrow">Request a senior review</span><h2>Share the current website.</h2><p>Work email and one clear priority are enough. Name, service selection, and a project brief are optional.</p></div>
          <ContactForm source="Contact Page" subject="New Contact / Project Request - Contact Page - dimaso.co" defaultService={defaultService}/>
          <p className="form-expectation">Reviewed by a senior team member · No generic sales handoff</p>
        </div>
      </div>
    </section>
    <section className="section contact-process-section">
      <div className="shell">
        <span className="eyebrow">What happens next</span>
        <h2 className="contact-process-title">Clear from the first message.</h2>
        <div className="contact-next-grid">
          {nextSteps.map(([title,copy],index)=><article className="card" key={title}><span className="eyebrow">Step / 0{index+1}</span><h3>{title}</h3><p className="muted">{copy}</p></article>)}
        </div>
        <div className="contact-fit-grid">
          <article className="card"><span className="eyebrow">Best fit</span><h3>Active websites that need technical ownership.</h3><p className="muted">Maintenance retainers, custom development, redesigns with implementation support, migrations, QA, integrations, and technical SEO tied to a real business website.</p></article>
          <article className="card"><span className="eyebrow">Usually not a fit</span><h3>Isolated visual or content-only tasks.</h3><p className="muted">Dimaso is usually not the right partner for logo-only work, template-only builds, or very small edits where no ongoing technical ownership is needed.</p></article>
        </div>
      </div>
    </section>
  </main>;
}

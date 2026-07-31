import { ContactForm } from "@/components/forms";
import { JsonLd } from "@/components/site";
import { TrackedLink } from "@/components/tracked-link";
import { metadata as meta,site } from "@/lib/site";

const linkedinUrl="https://www.linkedin.com/company/dimaso.co/";

export const metadata=meta("Contact Our Website Support Team","Discuss website maintenance, development, redesign, WordPress, technical SEO, or support needs directly with a senior Dimaso team member.","/contact");

const nextSteps=[
  ["Send the context","Share the current website, the main problem, business goal, and any deadline or platform constraint you already know."],
  ["Senior review","A senior team member reviews the request, identifies the likely service fit, and notes the most important risks or questions."],
  ["Practical next step","We reply with focused questions and a recommended first step instead of routing you through a generic sales script."],
] as const;

export default function Page(){
  return <main>
    <JsonLd data={{"@context":"https://schema.org","@type":"ContactPage",url:`${site.url}/contact`,name:"Contact Dimaso"}}/>
    <section className="grid-bg contact-conversion-hero">
      <div className="shell contact-page-grid">
        <div className="contact-conversion-copy">
          <span className="eyebrow">Contact · senior review</span>
          <h1>Bring us the brief, backlog, or hard problem.</h1>
          <p className="lede">Tell us what the website needs to do next. A senior member of the Dimaso team reviews the context directly and responds with a practical starting point.</p>
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
          <div className="footer-rfp-head contact-rfp-head"><span className="eyebrow">Start a conversation</span><h2>Discuss your website.</h2><p>A short note is enough. Attach a brief only if you already have one.</p></div>
          <ContactForm source="Contact Page" subject="New Contact / Project Request - Contact Page - dimaso.co"/>
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

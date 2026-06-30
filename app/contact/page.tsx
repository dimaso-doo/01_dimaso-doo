import { JsonLd } from "@/components/site";
import { TrackedLink } from "@/components/tracked-link";
import { metadata as meta,site } from "@/lib/site";

const linkedinUrl="https://www.linkedin.com/company/dimaso.co/";

export const metadata=meta("Contact Dimaso","Send Dimaso your website maintenance, development, or design RFP and talk with a senior technical team.","/contact");

export default function Page(){
  return <main>
    <JsonLd data={{"@context":"https://schema.org","@type":"ContactPage",url:`${site.url}/contact`,name:"Contact Dimaso"}}/>
    <section className="grid-bg" style={{padding:"130px 0 90px"}}>
      <div className="shell">
        <span className="eyebrow">Contact · RFP</span>
        <h1 style={{fontSize:"clamp(52px,9vw,100px)",lineHeight:.94,margin:"20px 0",maxWidth:950}}>Bring us the brief, backlog, or hard problem.</h1>
        <p className="lede">Dimaso works with US and international clients, with flexible communication and overlap with US business hours when needed.</p>
      </div>
    </section>
    <section className="section">
      <div className="shell">
        <div>
          <span className="eyebrow">Direct contact</span>
          <h2 style={{fontSize:"clamp(38px,5vw,64px)"}}>Let&apos;s understand what the website needs next.</h2>
          <div className="location-grid">
            <div className="card location-card"><span className="eyebrow">Serbia / Europe</span><h3>Dimaso RS</h3><p className="muted">Novi Sad, Serbia</p></div>
            <div className="card location-card"><span className="eyebrow">United States</span><h3>Dimaso US</h3><p className="muted">New York, USA</p></div>
          </div>
          <div className="card contact-direct-card" style={{marginTop:14,display:"grid",gap:14}}>
            <TrackedLink tracking="email" trackingLocation="contact_page" className="footer-contact-link email" href="mailto:office@dimaso.co">office@dimaso.co</TrackedLink>
            <a className="footer-contact-link phone" href="tel:+381611375150">+381 61 137 5150</a>
            <TrackedLink tracking="linkedin" trackingLocation="contact_page" className="footer-contact-link linkedin" href={linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</TrackedLink>
          </div>
        </div>
      </div>
    </section>
  </main>;
}

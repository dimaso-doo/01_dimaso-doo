import { ContactForm } from "@/components/forms";
import { JsonLd } from "@/components/site";
import { TrackedLink } from "@/components/tracked-link";
import { services } from "@/content/data";
import { metadata as meta, site } from "@/lib/site";
export const metadata = meta("Contact Dimaso", "Tell us about your website or project. Contact Dimaso for design, development, and ongoing support.", "/contact");

export default async function ContactPage({searchParams}:{searchParams:Promise<{service?:string|string[]}>}) {
  const query = await searchParams;
  const requested = Array.isArray(query.service) ? query.service[0] : query.service;
  const defaultService = Object.values(services).find(service => service.label === requested)?.label || "";
  return <main className="simple-page">
    <JsonLd data={{"@context":"https://schema.org","@type":"ContactPage",url:`${site.url}/contact`,name:"Contact Dimaso"}} />
    <section className="simple-contact"><div className="shell simple-contact-grid"><div>
      <h1>Let’s talk.</h1><p className="lede">Tell us what you need. For an RFP, attach the brief or share a link and include the submission deadline.</p>
      <div className="simple-contact-links"><TrackedLink tracking="email" trackingLocation="contact_page" href="mailto:office@dimaso.co">office@dimaso.co</TrackedLink><TrackedLink tracking="phone" trackingLocation="contact_page" href="tel:+381611375150">+381 61 137 5150</TrackedLink></div>
      <p className="simple-proof">Novi Sad, Serbia · Working worldwide</p>
    </div><div id="rfp"><ContactForm source="Contact Page" subject="New Contact / Project Request - Contact Page - dimaso.co" defaultService={defaultService} /></div></div></section>
  </main>;
}

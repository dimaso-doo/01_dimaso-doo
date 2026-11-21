import Link from "next/link";
import { Cases, SectionHead, ServiceCards } from "@/components/sections";
import { Testimonials } from "@/components/interactive-sections";
import { JsonLd } from "@/components/site";
import { organizationId, organizationSchema, site, websiteId } from "@/lib/site";
import { TrackedLink } from "@/components/tracked-link";

export default function Home() {
  return <main className="simple-page">
    <JsonLd data={{"@context":"https://schema.org","@graph":[organizationSchema,{"@type":"ProfessionalService","@id":`${site.url}/#professionalservice`,name:site.name,url:site.url,email:site.email,telephone:site.phone,address:organizationSchema.address,areaServed:organizationSchema.areaServed,serviceType:["Website Maintenance","Web Development","Web Design"],provider:{"@id":organizationId}},{"@type":"WebSite","@id":websiteId,url:site.url,name:site.name,publisher:{"@id":organizationId}}]}} />
    <section className="grid-bg simple-hero"><div className="shell">
      <h1>Website design,<br />development &amp; support.</h1>
      <p className="lede">We build new websites and keep existing ones fast, secure, and easy to use.</p>
      <div className="hero-actions"><TrackedLink tracking="cta" trackingLocation="home_hero" trackingLabel="Talk to us" href="/contact" className="btn">Talk to us</TrackedLink><Link href="/case-studies" className="btn ghost">View our work</Link></div>
      <p className="simple-proof">Since 2008 · Based in Serbia · Working worldwide</p>
    </div></section>
    <section id="support-paths" className="simple-section"><div id="services" className="shell">
      <SectionHead eyebrow="Services" title="One team for your website." /><ServiceCards limit={3} />
      <div className="simple-link-row"><Link className="text-link" href="/services">All services</Link><span className="simple-audiences">Support for <Link href="/industries/agencies">agencies</Link>, <Link href="/industries/nonprofits">nonprofits</Link>, and <Link href="/industries/ecommerce">online stores</Link>.</span></div>
    </div></section>
    <section className="simple-section"><div className="shell"><SectionHead eyebrow="Selected work" title="See what we’ve built." /><Cases limit={2} /><Link className="text-link simple-section-link" href="/case-studies">View all work</Link></div></section>
    <section className="simple-section"><div className="shell"><SectionHead eyebrow="Client feedback" title="What our clients say." /><Testimonials /></div></section>
  </main>;
}

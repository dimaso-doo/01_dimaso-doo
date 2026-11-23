import Link from "next/link";
import { Cases, ServiceCards } from "@/components/sections";
import { testimonials } from "@/content/testimonials";
import { JsonLd } from "@/components/site";
import { organizationId, organizationSchema, site, websiteId } from "@/lib/site";
import { TrackedLink } from "@/components/tracked-link";

export default function Home() {
  return <main className="simple-page">
    <JsonLd data={{"@context":"https://schema.org","@graph":[organizationSchema,{"@type":"ProfessionalService","@id":`${site.url}/#professionalservice`,name:site.name,url:site.url,email:site.email,telephone:site.phone,address:organizationSchema.address,areaServed:organizationSchema.areaServed,serviceType:["Website Maintenance","Web Development","Web Design","AI Application Development"],provider:{"@id":organizationId}},{"@type":"WebSite","@id":websiteId,url:site.url,name:site.name,publisher:{"@id":organizationId}}]}} />
    <section className="grid-bg simple-hero">
      <div className="shell">
        <h1>Web design, development &amp; ongoing support.</h1>
        <p className="lede">We build websites and AI applications, and keep them running after launch.</p>
        <div className="hero-actions">
          <TrackedLink tracking="cta" trackingLocation="home_hero" trackingLabel="Talk to us" href="/contact" className="btn">Talk to us</TrackedLink>
          <Link href="#work" className="btn ghost">View our work</Link>
        </div>
        <p className="simple-proof">Since 2008 · Based in Serbia · Working worldwide</p>
      </div>
    </section>
    <section id="work" className="simple-section">
      <div className="shell">
        <h2>Selected work</h2>
        <Cases slugs={["forever-living-shop", "one-llama-travels"]} />
        <Link className="text-link simple-section-link" href="/case-studies">View all work</Link>
      </div>
    </section>
    <section id="support-paths" className="simple-section">
      <div id="services" className="shell">
        <h2>Our services</h2>
        <ServiceCards limit={4} />
        <div className="simple-link-row">
          <Link className="text-link" href="/services">All services</Link>
          <Link className="text-link" href="/industries/agencies">Support for agencies</Link>
        </div>
      </div>
    </section>
    <section className="simple-section" aria-labelledby="client-stories">
      <div className="shell">
        <h2 id="client-stories">What our clients say</h2>
        <div className="client-videos">
          {testimonials.filter(item => item.youtubeId).map(item => (
            <figure key={item.youtubeId}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}`}
                title={`Video testimonial from ${item.person}, ${item.name}`}
                loading="lazy"
                allow="encrypted-media; picture-in-picture; fullscreen"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              <figcaption><strong>{item.person}</strong><span>{item.name}</span></figcaption>
              <a className="text-link" href={`https://www.youtube.com/watch?v=${item.youtubeId}`} aria-label={`Watch ${item.person} on YouTube`}>Watch on YouTube</a>
            </figure>
          ))}
        </div>
      </div>
    </section>
  </main>;
}

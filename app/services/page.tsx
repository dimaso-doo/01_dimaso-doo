import { Cases, SectionHead, ServiceCards } from "@/components/sections";
import { JsonLd } from "@/components/site";
import { services } from "@/content/data";
import { metadata as meta, organizationId, site, websiteId } from "@/lib/site";
export const metadata = meta("Web & AI Application Services", "Website design, development, AI applications, maintenance, WordPress, WooCommerce, and technical SEO from Dimaso.", "/services");

export default function ServicesPage() {
  const url = `${site.url}/services`, items = Object.values(services);
  return <main className="simple-page">
    <JsonLd data={{"@context":"https://schema.org","@graph":[{"@type":"CollectionPage","@id":`${url}#collection`,url,name:"Dimaso services",isPartOf:{"@id":websiteId},about:{"@id":organizationId}},{"@type":"ItemList",numberOfItems:items.length,itemListElement:items.map((service,index)=>({"@type":"ListItem",position:index+1,name:service.label,url:`${site.url}/${service.slug}`}))}]}} />
    <section className="grid-bg simple-hero simple-hero-short"><div className="shell"><h1>Everything your <br />website needs.</h1><p className="lede">Websites, AI applications, and ongoing care. Start with a project or monthly support.</p></div></section>
    <section className="simple-section"><div className="shell"><ServiceCards /></div></section>
    <section className="simple-section"><div className="shell"><SectionHead eyebrow="Selected work" title="Our services in action." /><Cases limit={2} /></div></section>
  </main>;
}

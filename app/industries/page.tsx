import { IndustryCards } from "@/components/sections";
import { JsonLd } from "@/components/site";
import { industries } from "@/content/data";
import { metadata as meta, site, websiteId } from "@/lib/site";
export const metadata=meta("Industries We Support","Website design, development, and support for agencies, nonprofits, associations, businesses, education, healthcare, and online stores.","/industries");
export default function IndustriesPage() {
  return <main className="simple-page"><JsonLd data={{"@context":"https://schema.org","@type":"CollectionPage",url:`${site.url}/industries`,name:"Industries we support",isPartOf:{"@id":websiteId},mainEntity:{"@type":"ItemList",itemListElement:Object.values(industries).map((industry,index)=>({"@type":"ListItem",position:index+1,name:industry.label,url:`${site.url}/${industry.slug}`}))}}} />
    <section className="grid-bg simple-hero simple-hero-short"><div className="shell"><h1>Who we help.</h1><p className="lede">Website support shaped around your team and the work you do.</p></div></section>
    <section className="simple-section"><div className="shell"><IndustryCards /></div></section>
  </main>;
}

import { Cases } from "@/components/sections";
import { JsonLd } from "@/components/site";
import { caseStudies } from "@/content/data";
import { metadata as meta, site, websiteId } from "@/lib/site";
export const metadata=meta("Our Work","Explore Dimaso projects in web design, development, ecommerce, and ongoing website support.","/case-studies");
export default function WorkPage() {
  return <main className="simple-page"><JsonLd data={{"@context":"https://schema.org","@graph":[{"@type":"CollectionPage",url:`${site.url}/case-studies`,name:"Dimaso projects",isPartOf:{"@id":websiteId}},{"@type":"ItemList",itemListElement:caseStudies.map((study,index)=>({"@type":"ListItem",position:index+1,name:study.name,url:`${site.url}/case-studies/${study.slug}`}))}]}} />
    <section className="grid-bg simple-hero simple-hero-short"><div className="shell"><h1>Our work.</h1><p className="lede">Websites, stores, and platforms we’ve designed, built, and supported.</p></div></section>
    <section id="case-study-list" className="simple-section"><div className="shell"><Cases /></div></section>
  </main>;
}

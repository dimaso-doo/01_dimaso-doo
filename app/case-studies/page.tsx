import Link from "next/link";
import { Cases, SectionHead } from "@/components/sections";
import { CTA, JsonLd } from "@/components/site";
import { caseStudies } from "@/content/data";
import { metadata as meta, site, websiteId } from "@/lib/site";

export const metadata=meta("Web Development & Maintenance Case Studies","Explore Dimaso case studies across website maintenance, custom development, ecommerce, web design, technical SEO, QA, and platform support.","/case-studies");

export default function Page(){
 const url=`${site.url}/case-studies`;
 return <main>
  <JsonLd data={{"@context":"https://schema.org","@graph":[{"@type":"CollectionPage","@id":`${url}#collection`,url,name:"Dimaso case studies",description:"Website maintenance, custom development, ecommerce, web design, technical SEO, QA, and platform support case studies from Dimaso.",isPartOf:{"@id":websiteId}},{"@type":"ItemList","@id":`${url}#itemlist`,itemListElement:caseStudies.map((study,index)=>({"@type":"ListItem",position:index+1,url:`${site.url}/case-studies/${study.slug}`,name:study.name}))}]}}/>
  <section className="grid-bg cases-index-hero"><div className="shell"><span className="eyebrow">Case studies · documented delivery</span><h1>Work that improved the system behind the website.</h1><p className="lede">See the context, decisions, technical scope, and practical outcome behind selected maintenance, development, ecommerce, and design engagements.</p><div className="hero-actions"><Link className="btn" href="#case-study-list">Explore client work</Link><Link className="btn ghost" href="#rfp">Discuss a similar project</Link></div><div className="case-index-signals"><span>10 selected engagements</span><span>Delivery scope documented</span><span>Live project captures</span></div></div></section>
  <section id="case-study-list" className="section"><div className="shell"><SectionHead eyebrow="Maintenance · Development · Design" title="Context, decisions, and outcomes." copy="Each story separates the original problem, the work Dimaso owned, and the change the website needed to support."/><div style={{marginTop:50}}><Cases/></div></div></section>
  <CTA title="Have a website problem that needs senior ownership?" label="Discuss your website"/>
 </main>;
}

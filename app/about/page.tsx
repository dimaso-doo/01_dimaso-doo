import { JsonLd } from "@/components/site";
import { SectionHead } from "@/components/sections";
import { Team } from "@/components/interactive-sections";
import { metadata as meta, organizationId, organizationSchema, site, websiteId } from "@/lib/site";
export const metadata=meta("About Dimaso","Meet the Dimaso team in Novi Sad, Serbia. Website design, development, maintenance, and QA for clients worldwide.","/about");
const people = [
  ["Branislav Stojanovic", "Project Lead & Lead Integration Developer"],
  ["Predrag Stojanovic", "Front-end & WordPress Integration Developer"],
  ["Sandra Lukic", "QA Engineer & Technical Support"],
  ["Marko Milojevic", "Senior Web Developer"],
  ["Sanja Mazic", "Web QA & Project Support"],
] as const;


export default function AboutPage() {
  return <main className="simple-page">
    <JsonLd data={{"@context":"https://schema.org","@graph":[organizationSchema,{"@type":"WebPage",url:`${site.url}/about`,name:"About Dimaso",isPartOf:{"@id":websiteId},about:{"@id":organizationId}},...people.map(([name,jobTitle])=>({"@type":"Person",name,jobTitle,worksFor:{"@id":organizationId}}))]}} />
    <section className="grid-bg simple-hero simple-hero-short"><div className="shell"><h1>A small team. <br />Long-term support.</h1><p className="lede">We design, build, and maintain websites from Novi Sad, Serbia. Since 2008, we’ve worked with businesses and teams around the world.</p></div></section>
    <section className="simple-section"><div className="shell"><SectionHead eyebrow="Our team" title="Meet the people behind Dimaso." /><Team /></div></section>
  </main>;
}

import Link from "next/link";
import { industries, IndustryKey } from "@/content/data";
import { Cases, FAQSection, SectionHead } from "./sections";
import { JsonLd } from "./site";
import { TrackedLink } from "./tracked-link";
import { organizationId, site, websiteId } from "@/lib/site";

const agencyFaq=[
  ["Will you contact our clients?","We agree on visibility and communication before work starts. Your agency keeps the client relationship."],
  ["Can you use our project tools?","Yes. We can work through your ticketing, review, and approval process."],
  ["Can we start with one task?","Yes. Start with a pilot task, an overflow block, or ongoing support."]
] as const;

export function IndustryPage({type}:{type:IndustryKey}) {
  const industry=industries[type], url=`${site.url}/${industry.slug}`;
  const offers=type==="agencies"?["White-label WordPress and frontend development","Landing pages and client website maintenance","QA and launch support","Work through your existing process","Agreed confidentiality and client-contact boundaries"]:industry.deliverables;
  return <main className="simple-page">
    <JsonLd data={{"@context":"https://schema.org","@graph":[{"@type":"Service","@id":`${url}#service`,name:industry.title,url,description:industry.intro,provider:{"@id":organizationId},isPartOf:{"@id":websiteId},audience:{"@type":"Audience",audienceType:industry.label}},{"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:site.url},{"@type":"ListItem",position:2,name:"Industries",item:`${site.url}/industries`},{"@type":"ListItem",position:3,name:industry.label,item:url}]},...(type==="agencies"?[{"@type":"FAQPage",mainEntity:agencyFaq.map(([question,answer])=>({"@type":"Question",name:question,acceptedAnswer:{"@type":"Answer",text:answer}}))}]:[])]}} />
    <section className="grid-bg simple-hero simple-hero-short"><div className="shell"><Link className="text-link" href="/industries">Industries</Link><h1>{type==="agencies"?"Your agency’s technical team.":industry.title.replace(/ Services$/,"")}</h1><p className="lede">{industry.intro}</p><div className="hero-actions"><TrackedLink tracking="cta" trackingLocation={`${type}_industry_hero`} trackingLabel="Talk to us" href="/contact" className="btn">Talk to us</TrackedLink></div></div></section>
    <section className="simple-section"><div className="shell simple-scope"><SectionHead eyebrow="Support" title="How we can help." /><ul className="simple-scope-list">{offers.map(item=><li key={item}>{item}</li>)}</ul></div></section>
    <section className="simple-section"><div className="shell"><SectionHead eyebrow="Selected work" title="Related projects." copy={type==="education"?"Relevant CMS and content work; these are not school projects.":type==="nonprofits"?"Related experience in content, publishing, and platform support.":undefined} /><Cases slugs={[...industry.caseSlugs]} limit={2} /><nav className="simple-related-links" aria-label="Related services">{industry.relatedServices.slice(0,3).map(slug=><Link key={slug} href={`/${slug}`}>{slug.split("/").pop()?.replace(/-/g," ")}</Link>)}</nav></div></section>
    {type==="agencies"&&<FAQSection eyebrow="FAQ" title="Working behind the scenes." items={agencyFaq} />}
  </main>;
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CountUpMetric } from "@/components/count-up-metric";
import { CTA, JsonLd } from "@/components/site";
import { caseStudies } from "@/content/data";
import { organizationId, site, websiteId } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) return {};
  const title = `${study.name} ${study.serviceTags[0]} Case Study`;
  const detailedDescription = `${study.summary} See the challenge, Dimaso's technical approach, services, and project outcome.`;
  const description = detailedDescription.length <= 160
    ? detailedDescription
    : `${study.summary} See Dimaso's technical approach and project outcome.`;
  const url = `${site.url}/case-studies/${study.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.name, type: "article", images: [{ url: `${site.url}${study.image}`, alt: study.imageAlt }] },
    twitter: { card: "summary_large_image", title, description, images:[`${site.url}${study.image}`] },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) notFound();
  const isForeverLiving = study.slug === "forever-living-shop";
  const screenshot = `/case-studies/screenshots/${study.slug}.jpg`;
  const visualClass = `case-study-visual case-study-visual-wide ${isForeverLiving ? "case-study-visual-display" : ""}`;
  const relatedStudies = caseStudies
    .filter((item) => item.slug !== study.slug)
    .map((item) => ({ item, score: item.serviceTags.filter((tag) => study.serviceTags.includes(tag)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item);
  return <main>
    <JsonLd data={{"@context":"https://schema.org","@graph":[{"@type":"BreadcrumbList","@id":`${site.url}/case-studies/${study.slug}#breadcrumb`,itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:site.url},{"@type":"ListItem",position:2,name:"Case Studies",item:`${site.url}/case-studies`},{"@type":"ListItem",position:3,name:study.name,item:`${site.url}/case-studies/${study.slug}`}]},{"@type":"CreativeWork","@id":`${site.url}/case-studies/${study.slug}#case-study`,name:study.name,url:`${site.url}/case-studies/${study.slug}`,description:study.summary,image:`${site.url}${study.image}`,about:study.serviceTags,genre:study.category,provider:{"@id":organizationId},isPartOf:{"@id":websiteId}}]}}/>
    <section className="case-study-hero grid-bg">
      <div className="shell case-study-hero-grid">
        <div>
          <div className="breadcrumb-row"><Link href="/">Home</Link><span>/</span><Link href="/case-studies">Case studies</Link><span>/</span><span>{study.name}</span></div>
          <span className="eyebrow">{study.category}</span>
          <h1>{study.name}</h1>
          <p className="lede">{study.summary}</p>
          <div className="case-study-actions"><Link className="btn" href="#rfp">Discuss a similar project</Link><a className="btn ghost" href={study.website} target="_blank" rel="noopener noreferrer">Visit website</a></div>
          <Link className="text-link case-study-service-link" href={study.href}>{study.cta} →</Link>
        </div>
        <div className="case-study-hero-media"><Image src={study.image} alt={study.imageAlt} width={1200} height={700} priority sizes="(max-width: 900px) calc(100vw - 28px), 560px"/><span>{study.services}</span></div>
      </div>
    </section>
    {study.metrics.length > 0 && <section className="section">
      <div className="shell case-study-stats">
        {study.metrics.map(([value,label])=><div className="case-stat" key={label}><CountUpMetric value={value}/><span>{label}</span></div>)}
      </div>
    </section>}
    <section className="section case-study-body-section">
      <div className="shell case-study-body">
        <div className="case-study-main">
          <article className="case-study-panel"><span className="eyebrow">Project overview</span><h2>Why {study.name} needed a stronger digital foundation.</h2><p>{study.overview}</p></article>
          <article className="case-study-panel"><span className="eyebrow">Challenge</span><h2>What needed to be solved for {study.category.toLowerCase()}.</h2><p>{study.problem}</p></article>
          <article className="case-study-panel"><span className="eyebrow">Solution</span><h2>How Dimaso approached {study.services.toLowerCase()}.</h2><p>{study.solution}</p></article>
          <article className="case-study-panel case-study-results"><span className="eyebrow">Results</span><h2>What changed for {study.name} after the work.</h2><p>{study.result}</p><div className="case-delivery-evidence"><span className="eyebrow">Documented delivery</span><ul>{study.work.slice(0,3).map((item)=><li key={item}>{item}</li>)}</ul></div><Link href="#rfp" className="btn">Discuss a similar project</Link></article>
        </div>
        <aside className="case-study-side">
          <div className="case-study-panel"><span className="eyebrow">What Dimaso worked on</span><p>{study.workSummary}</p><ul>{study.work.map((item)=><li key={item}>{item}</li>)}</ul></div>
          <div className="case-study-panel"><span className="eyebrow">Services used</span><div className="case-tech-list">{study.serviceTags.map((item)=><span key={item}>{item}</span>)}</div></div>
          <div className="case-study-panel"><span className="eyebrow">Technical scope</span><div className="case-tech-list">{study.technologies.map((item)=><span key={item}>{item}</span>)}</div></div>
          <Link href="/case-studies" className="text-link">Back to all case studies →</Link>
        </aside>
      </div>
    </section>
    <section className="section case-study-visuals-section">
      <div className="shell">
        <div className={`case-study-visuals-head ${isForeverLiving ? "case-study-visuals-head-display" : ""}`}>
          <span className="eyebrow">Project visuals</span>
          <h2>Live website captures from the project.</h2>
        </div>
        <figure className={visualClass}>
          {isForeverLiving ? <div className="case-study-display-model" role="img" aria-label={`${study.name} desktop homepage screenshot`}>
            <div className="case-study-display-screen">
              <Image src={screenshot} alt="" width={1600} height={980} sizes="(max-width: 900px) calc(100vw - 56px), 900px"/>
            </div>
            <span className="case-study-display-neck"/>
            <span className="case-study-display-foot"/>
          </div> : <Image src={screenshot} alt={`${study.name} desktop homepage screenshot`} width={1600} height={980} sizes="(max-width: 900px) calc(100vw - 28px), 1180px"/>}
          <figcaption>Desktop homepage screenshot</figcaption>
        </figure>
      </div>
    </section>
    <section className="section ambient-code ambient-right">
      <div className="shell">
        <span className="eyebrow">Related case studies</span>
        <h2 style={{fontSize:"clamp(34px,4.6vw,60px)",maxWidth:850,margin:"16px 0 22px"}}>More website work connected to {study.serviceTags[0].toLowerCase()}.</h2>
        <div className="cards-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:14,marginTop:42}}>
          {relatedStudies.map((item)=><Link key={item.slug} href={`/case-studies/${item.slug}`} className="card" style={{color:"#fff",minHeight:220,display:"flex",flexDirection:"column"}}><span className="eyebrow">{item.category}</span><h3 style={{fontSize:24,margin:"22px 0 14px"}}>{item.name}</h3><p className="muted" style={{lineHeight:1.65}}>{item.summary}</p><span className="text-link" style={{marginTop:"auto"}}>View case study →</span></Link>)}
        </div>
      </div>
    </section>
    <CTA title={`Have a similar ${study.category.toLowerCase()} challenge?`} label="Discuss a similar project"/>
  </main>;
}

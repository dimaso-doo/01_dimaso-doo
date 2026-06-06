import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CountUpMetric } from "@/components/count-up-metric";
import { CTA, JsonLd } from "@/components/site";
import { caseStudies } from "@/content/data";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) return {};
  const title = `${study.name} case study`;
  const description = `${study.summary} Read how Dimaso approached ${study.category.toLowerCase()} for ${study.name}.`;
  const url = `${site.url}/case-studies/${study.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.name, type: "article", images: [{ url: study.image, alt: `${study.name} case study visual` }] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) notFound();
  return <main>
    <JsonLd data={{"@context":"https://schema.org","@graph":[{"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:site.url},{"@type":"ListItem",position:2,name:"Case Studies",item:`${site.url}/case-studies`},{"@type":"ListItem",position:3,name:study.name,item:`${site.url}/case-studies/${study.slug}`}]},{"@type":"CreativeWork",name:study.name,url:`${site.url}/case-studies/${study.slug}`,description:study.summary,image:`${site.url}${study.image}`} ]}}/>
    <section className="case-study-hero grid-bg">
      <div className="shell case-study-hero-grid">
        <div>
          <div className="breadcrumb-row"><Link href="/">Home</Link><span>/</span><Link href="/case-studies">Case studies</Link><span>/</span><span>{study.name}</span></div>
          <span className="eyebrow">{study.category}</span>
          <h1>{study.name}</h1>
          <p className="lede">{study.summary}</p>
          <div className="case-study-actions"><a className="btn" href={study.website} target="_blank" rel="noopener noreferrer">Visit website</a><Link className="btn ghost" href={study.href}>{study.cta}</Link></div>
        </div>
        <div className="case-study-hero-media"><Image src={study.image} alt={`${study.name} case study visual`} width={1200} height={700} priority unoptimized/><span>{study.services}</span></div>
      </div>
    </section>
    <section className="section">
      <div className="shell case-study-stats">
        {study.metrics.map(([value,label])=><div className="case-stat" key={label}><CountUpMetric value={value}/><span>{label}</span></div>)}
      </div>
    </section>
    <section className="section case-study-body-section">
      <div className="shell case-study-body">
        <div className="case-study-main">
          <article className="case-study-panel"><span className="eyebrow">Project overview</span><h2>Why the work mattered.</h2><p>{study.overview}</p></article>
          <article className="case-study-panel"><span className="eyebrow">Challenge</span><h2>What needed to be solved.</h2><p>{study.problem}</p></article>
          <article className="case-study-panel"><span className="eyebrow">Solution</span><h2>How Dimaso approached it.</h2><p>{study.solution}</p></article>
          <article className="case-study-panel"><span className="eyebrow">Results</span><h2>What changed for the project.</h2><p>{study.result}</p></article>
        </div>
        <aside className="case-study-side">
          <div className="case-study-panel"><span className="eyebrow">What Dimaso worked on</span><p>{study.workSummary}</p><ul>{study.work.map((item)=><li key={item}>{item}</li>)}</ul></div>
          <div className="case-study-panel"><span className="eyebrow">Services used</span><div className="case-tech-list">{study.serviceTags.map((item)=><span key={item}>{item}</span>)}</div></div>
          <div className="case-study-panel"><span className="eyebrow">Technical scope</span><div className="case-tech-list">{study.technologies.map((item)=><span key={item}>{item}</span>)}</div></div>
          <Link href="/case-studies" className="text-link">Back to all case studies →</Link>
        </aside>
      </div>
    </section>
    <CTA title={`Have a similar ${study.category.toLowerCase()} challenge?`} label="Send your RFP"/>
  </main>;
}

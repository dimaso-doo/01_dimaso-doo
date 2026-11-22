import Link from "next/link";
import Image from "next/image";
import { caseStudies, industries, posts, services } from "@/content/data";

export function Reveal({children}:{children:React.ReactNode}) { return <div className="reveal">{children}</div>; }
export function SectionHead({eyebrow,title,copy}:{eyebrow:string;title:string;copy?:string}){return <Reveal><span className="eyebrow">{eyebrow}</span><h2 style={{fontSize:"clamp(34px,4.6vw,60px)",maxWidth:850,margin:"16px 0 22px"}}>{title}</h2>{copy&&<p className="lede">{copy}</p>}</Reveal>}

export function TrustStrip(){
 const proof=[
  ["Since 2008","Long-term website delivery and care"],
  ["Senior access","Work directly with the people responsible"],
  ["US + international","Remote collaboration across time zones"],
  ["Build + maintain","One team across the website lifecycle"],
 ];
 return <section className="trust-strip" aria-label="Why teams choose Dimaso"><div className="shell"><div className="trust-strip-head"><span className="eyebrow">Built for long-term confidence</span><span className="client-note">Practical proof before the technical detail</span></div><div className="trust-grid">{proof.map(([value,label])=><div className="trust-item" key={value}><strong>{value}</strong><span>{label}</span></div>)}</div></div></section>;
}

export function ServiceCards({limit=Object.keys(services).length}:{limit?:number}) {
  return <div className={`simple-service-grid ${limit===4?"simple-service-grid-featured":""}`}>{Object.values(services).slice(0,limit).map(service => <Link key={service.slug} href={`/${service.slug}`} className="simple-service-card">
    <h3>{service.label}</h3><p>{service.intro}</p><span className="text-link">Learn more</span>
  </Link>)}</div>;
}

export function IndustryCards() {
  return <div className="simple-service-grid">{Object.values(industries).map(industry => <Link key={industry.slug} href={`/${industry.slug}`} className="simple-service-card"><h3>{industry.label}</h3><p>{industry.intro}</p><span className="text-link">Learn more</span></Link>)}</div>;
}

export function Cases({limit,slugs}:{limit?:number;slugs?:string[]}) {
  const studies=slugs?slugs.map(slug=>caseStudies.find(study=>study.slug===slug)).filter((study):study is (typeof caseStudies)[number]=>Boolean(study)):caseStudies;
  return <div className="simple-work-grid">{studies.slice(0,limit).map(study => <article className="card case-card" key={study.slug}>
    <Link href={`/case-studies/${study.slug}`} className="case-visual" aria-label={`View ${study.name} project`}>{study.image&&<Image className="case-visual-image" src={study.image} alt={study.imageAlt} width={1200} height={700} sizes="(max-width: 700px) 100vw, 580px" loading="lazy" />}</Link>
    <div className="case-content"><span className="simple-case-category">{study.category}</span><h3><Link href={`/case-studies/${study.slug}`}>{study.name}</Link></h3><p className="muted case-summary">{study.summary}</p><Link href={`/case-studies/${study.slug}`} className="text-link">View project</Link></div>
  </article>)}</div>;
}

export function BlogCards({limit,page=1,perPage}:{limit?:number;page?:number;perPage?:number}){
 const start=perPage?(page-1)*perPage:0;
 const items=posts.slice(start,perPage?start+perPage:limit);
 return <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:15}} className="cards-grid blog-grid">{items.map((p,i)=>{const number=start+i+1;return <Link href={`/blog/${p.slug}`} className="card blog-card" key={p.slug} style={{color:"#fff"}}><div className={`blog-card-visual blog-card-visual-${(number%6)||6}`}><span>{String(number).padStart(2,"0")}</span><i/><b/></div><span className="eyebrow">{p.category} · {new Date(p.date).toLocaleDateString("en-US",{month:"short",year:"numeric"})}</span><h3>{p.title}</h3><p className="muted">{p.excerpt}</p><span className="text-link">Read article</span></Link>})}</div>
}
export function ProcessStack({items=["Understand the context","Define priorities","Build and verify","Improve continuously"],title="Clear from first conversation to continuous improvement."}:{items?:readonly string[];title?:string}) {
 const motions=["audit","plan","build","improve"];
 const copy=["We map business priorities, technical constraints, risk, and the people who depend on the platform.","We turn context into an ordered roadmap with clear ownership, outcomes, and a practical delivery rhythm.","Senior specialists execute the work while QA stays inside every release, not after it.","We measure what changed, protect the system, and keep the next valuable improvement visible."];
 return <div className="process-layout"><div className="process-intro"><span className="eyebrow">How we work</span><h2 style={{fontSize:"clamp(36px,4vw,54px)",lineHeight:1.08,margin:"16px 0 20px"}}>{title}</h2><p className="lede" style={{fontSize:17}}>The process keeps context, delivery, quality, and continuous improvement connected.</p></div><div className="process-stack">{items.map((item,i)=><article className="process-step" key={item}><div className={`phase-motion ${motions[i]}`}><span/></div><div className="process-step-inner"><span className="eyebrow">Phase / 0{i+1}</span><div className="process-step-copy"><h3>{item}</h3><p className="muted">{copy[i]}</p></div></div></article>)}</div></div>
}

export function FAQSection({eyebrow,title,copy,items}:{eyebrow:string;title:string;copy?:string;items:readonly (readonly [string,string])[]}) {
 return <section className="section faq-section"><div className="shell faq-layout"><div className="faq-intro"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy&&<p className="lede">{copy}</p>}</div><div className="faq-list">{items.map(([q,a],i)=><details className="faq-item" name="dimaso-faq" key={q}><summary><span className="faq-number">0{i+1}</span><span>{q}</span><span className="faq-toggle" aria-hidden="true"/></summary><div className="faq-answer"><p className="muted">{a}</p></div></details>)}</div></div></section>;
}

/* eslint-disable @next/next/no-img-element -- external Simple Icons SVGs are lazy, tiny, and intentionally fetched from their CDN */

import Link from "next/link";
import Image from "next/image";
import { caseStudies, industries, posts, services } from "@/content/data";

export function Reveal({children}:{children:React.ReactNode}) { return <div className="reveal">{children}</div>; }
export function SectionHead({eyebrow,title,copy}:{eyebrow:string;title:string;copy?:string}){return <Reveal><span className="eyebrow">{eyebrow}</span><h2 style={{fontSize:"clamp(34px,4.6vw,60px)",maxWidth:850,margin:"16px 0 22px"}}>{title}</h2>{copy&&<p className="lede">{copy}</p>}</Reveal>}

export function ClientLogos(){
 const tech=[
  ["wordpress","WordPress"],["woocommerce","WooCommerce"],["nextdotjs","Next.js"],["react","React"],["typescript","TypeScript"],["nodedotjs","Node.js"],["php","PHP"],["mysql","MySQL"],["openapiinitiative","REST APIs"],["stripe","Stripe"],["googleanalytics","Google Analytics"],["googlesearchconsole","Google Search Console"],["figma","Figma"],["cloudflare","Cloudflare"]
 ];
 return <section className="client-strip"><div className="shell"><div className="client-strip-head"><span className="eyebrow">Technology stack</span><span className="client-note">Tools we use to maintain, build, measure, and improve websites</span></div></div><div className="client-logo-viewport"><div className="client-logo-track">{[...tech,...tech].map(([slug,name],i)=><div className="client-logo tech-logo" key={`${slug}-${i}`} title={name}><img src={`https://cdn.simpleicons.org/${slug}/57d99a`} alt={name} width="39" height="39" loading="lazy" decoding="async" fetchPriority="low"/><span>{name}</span></div>)}</div></div></section>;
}

export function ServiceCards(){
 const symbols=["↻","〈/〉","□","WP","SEO","AI"];
 return <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:18}} className="cards-grid service-cards">{Object.values(services).map((s,i)=><Link href={`/${s.slug}`} key={s.slug} className={`service-card service-card-${(i%3)+1}`} style={{minHeight:500,display:"flex",flexDirection:"column",color:"#fff"}}><div className="service-graphic"><div className="service-signal"/><div className="service-symbol">{symbols[i]}</div></div><span className="eyebrow">0{i+1} / {s.eyebrow}</span><h3 style={{fontSize:29,margin:"30px 0 18px"}}>{s.label}</h3><p className="muted" style={{lineHeight:1.76}}>{s.intro}</p><span className="text-link" style={{marginTop:"auto"}}>Explore service →</span></Link>)}</div>
}

export function IndustryCards(){
 return <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:14}} className="cards-grid industry-grid">{Object.values(industries).map((industry,index)=><Link key={industry.slug} href={`/${industry.slug}`} className="card" style={{color:"#fff",minHeight:220,display:"flex",flexDirection:"column"}}><span className="eyebrow">Industry / {String(index+1).padStart(2,"0")}</span><h3 style={{fontSize:24,margin:"22px 0 14px"}}>{industry.label}</h3><p className="muted" style={{lineHeight:1.65}}>{industry.who}</p><span className="text-link" style={{marginTop:"auto"}}>Explore industry →</span></Link>)}</div>;
}
export function Cases({limit,slugs}:{limit?:number;slugs?:string[]}){const studies=slugs?slugs.map(slug=>caseStudies.find(c=>c.slug===slug)).filter((c):c is (typeof caseStudies)[number]=>Boolean(c)):caseStudies;return <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:18}} className="cards-grid work-grid">{studies.slice(0,limit).map((c,i)=><article className="card case-card" key={c.name}><Link href={`/case-studies/${c.slug}`} className={`case-visual case-visual-${i+1}`} aria-label={`Read ${c.name} case study`}>{c.image&&<Image className="case-visual-image" src={c.image} alt={c.imageAlt} width={1200} height={700} sizes="(max-width: 900px) calc(100vw - 28px), 580px" loading="lazy"/>}<span className="case-logo-mark">{c.name.split(" ").map(x=>x[0]).join("").slice(0,2)}</span><span className="case-logo-name">{c.name}</span><span className="case-visual-line one"/><span className="case-visual-line two"/></Link><div className="case-content"><div className="case-meta"><span className="tag">{c.category}</span><span>{c.services}</span></div><h3><Link href={`/case-studies/${c.slug}`}>{c.name}</Link></h3><p className="muted case-summary">{c.summary}</p><div className="case-links"><Link href={`/case-studies/${c.slug}`} className="text-link">View case study →</Link></div></div></article>)}</div>}
export function BlogCards({limit,page=1,perPage}:{limit?:number;page?:number;perPage?:number}){
 const start=perPage?(page-1)*perPage:0;
 const items=posts.slice(start,perPage?start+perPage:limit);
 return <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:15}} className="cards-grid blog-grid">{items.map((p,i)=>{const number=start+i+1;return <Link href={`/blog/${p.slug}`} className="card blog-card" key={p.slug} style={{color:"#fff"}}><div className={`blog-card-visual blog-card-visual-${(number%6)||6}`}><span>{String(number).padStart(2,"0")}</span><i/><b/></div><span className="eyebrow">{p.category} · {new Date(p.date).toLocaleDateString("en-US",{month:"short",year:"numeric"})}</span><h3>{p.title}</h3><p className="muted">{p.excerpt}</p><span className="text-link">Read insight →</span></Link>})}</div>
}
export function ProcessStack({items=["Understand the context","Define priorities","Build and verify","Improve continuously"],title="Clear from first conversation to continuous improvement."}:{items?:readonly string[];title?:string}) {
 const motions=["audit","plan","build","improve"];
 const copy=["We map business priorities, technical constraints, risk, and the people who depend on the platform.","We turn context into an ordered roadmap with clear ownership, outcomes, and a practical delivery rhythm.","Senior specialists execute the work while QA stays inside every release, not after it.","We measure what changed, protect the system, and keep the next valuable improvement visible."];
 return <div className="process-layout"><div className="process-intro"><span className="eyebrow">How we work</span><h2 style={{fontSize:"clamp(36px,4vw,54px)",lineHeight:1.08,margin:"16px 0 20px"}}>{title}</h2><p className="lede" style={{fontSize:17}}>The process keeps context, delivery, quality, and continuous improvement connected.</p></div><div className="process-stack">{items.map((item,i)=><article className="process-step" key={item}><div className={`phase-motion ${motions[i]}`}><span/></div><div className="process-step-inner"><span className="eyebrow">Phase / 0{i+1}</span><div className="process-step-copy"><h3>{item}</h3><p className="muted">{copy[i]}</p></div></div></article>)}</div></div>
}

export function FAQSection({eyebrow,title,copy,items}:{eyebrow:string;title:string;copy:string;items:readonly (readonly [string,string])[]}) {
 return <section className="section faq-section"><div className="shell faq-layout"><div className="faq-intro"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p className="lede">{copy}</p></div><div className="faq-list">{items.map(([q,a],i)=><details className="faq-item" name="dimaso-faq" key={q} open={i===0}><summary><span className="faq-number">0{i+1}</span><span>{q}</span><span className="faq-toggle" aria-hidden="true"/></summary><div className="faq-answer"><p className="muted">{a}</p></div></details>)}</div></div></section>;
}

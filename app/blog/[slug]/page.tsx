import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/site";
import { TrackedLink } from "@/components/tracked-link";
import { blogFaqs } from "@/content/blog-faqs";
import { posts } from "@/content/data";
import { blogContent, BlogInline } from "@/content/blog-content";
import { organizationId, site, social, websiteId } from "@/lib/site";

type BuyerQualifier = {
  eyebrow:string;
  title:string;
  copy:string;
  ctaLabel:string;
  secondaryLabel:string;
  secondaryHref:string;
};

const buyerQualifierBySlug:Record<string,BuyerQualifier>={
  "website-maintenance-proposal":{
    eyebrow:"For teams requesting support proposals",
    title:"Compare ownership and risk before comparing monthly prices.",
    copy:"Dimaso can review the current website and prepare a maintenance proposal covering the systems, response terms, QA, reporting, and development capacity you actually need.",
    ctaLabel:"Request a maintenance proposal",
    secondaryLabel:"Explore website maintenance",
    secondaryHref:"/services/website-maintenance",
  },
  "website-support-retainer-vs-hourly":{
    eyebrow:"For website support buyers",
    title:"Choose the engagement model around real workload and business risk.",
    copy:"Share the current request pattern, platform, priorities, and response needs. Dimaso can recommend a retained, project, or hybrid support model.",
    ctaLabel:"Discuss a support model",
    secondaryLabel:"View maintenance services",
    secondaryHref:"/services/website-maintenance",
  },
  "wordpress-maintenance-plans":{
    eyebrow:"For businesses comparing WordPress plans",
    title:"Get a WordPress care plan built around the website—not a generic tier.",
    copy:"We can review plugins, theme, hosting, forms, WooCommerce, custom code, recovery, and support needs before recommending the right scope.",
    ctaLabel:"Request a WordPress support plan",
    secondaryLabel:"Explore WordPress support",
    secondaryHref:"/services/wordpress-support",
  },
  "hire-wordpress-developer-existing-website":{
    eyebrow:"For owners of existing WordPress websites",
    title:"Need a senior developer to take over, repair, or extend the current site?",
    copy:"Dimaso can begin with a bounded technical review, establish a safe baseline, and turn the findings into focused work or ongoing support.",
    ctaLabel:"Request a WordPress takeover review",
    secondaryLabel:"View WordPress services",
    secondaryHref:"/services/wordpress-support",
  },
  "woocommerce-maintenance-cost":{
    eyebrow:"For WooCommerce support buyers",
    title:"Price support around revenue paths, integrations, and response risk.",
    copy:"Share the store, transaction model, integrations, and current problems. Dimaso can review the setup and propose the right maintenance scope.",
    ctaLabel:"Request a WooCommerce estimate",
    secondaryLabel:"Explore WooCommerce support",
    secondaryHref:"/services/woocommerce-maintenance",
  },
  "technical-seo-audit-cost":{
    eyebrow:"For teams buying technical SEO",
    title:"Get an audit that can move from findings to production fixes.",
    copy:"Dimaso can scope the crawl, indexation, templates, performance, analytics, implementation, and validation work around the website's actual acquisition risk.",
    ctaLabel:"Request a technical SEO review",
    secondaryLabel:"Explore technical SEO",
    secondaryHref:"/services/technical-seo",
  },
  "choose-website-redesign-agency":{
    eyebrow:"For organizations selecting a redesign partner",
    title:"Compare the team that will own strategy, build, migration, and launch.",
    copy:"Dimaso can review the current website, goals, content, integrations, timeline, and post-launch needs before recommending a redesign scope.",
    ctaLabel:"Discuss a website redesign",
    secondaryLabel:"Explore web design",
    secondaryHref:"/services/web-design",
  },
  "nonprofit-website-support-options":{
    eyebrow:"For nonprofit decision-makers",
    title:"Build the right blend of internal ownership and external technical support.",
    copy:"Dimaso can review donation and form journeys, CMS health, accessibility, integrations, analytics, and team capacity, then recommend a practical support model.",
    ctaLabel:"Request a nonprofit website review",
    secondaryLabel:"Explore nonprofit support",
    secondaryHref:"/industries/nonprofits",
  },
  "white-label-web-development-partner":{
    eyebrow:"For agencies selecting a delivery partner",
    title:"Add senior web development capacity while protecting the client relationship.",
    copy:"Dimaso supports agencies with clearly defined white-label delivery, WordPress, custom development, ecommerce, migrations, QA, and ongoing support.",
    ctaLabel:"Discuss white-label capacity",
    secondaryLabel:"Explore agency partnerships",
    secondaryHref:"/industries/agencies",
  },
  "choose-website-migration-company":{
    eyebrow:"For organizations planning a migration",
    title:"Choose a partner that protects content, integrations, analytics, and SEO.",
    copy:"Dimaso can assess the current and target platforms, migration inventory, technical dependencies, launch risk, and post-launch support before defining scope.",
    ctaLabel:"Request a migration review",
    secondaryLabel:"Explore web development",
    secondaryHref:"/services/web-development",
  },
  "website-redesign-rfp-checklist":{
    eyebrow:"For organizations issuing an RFP",
    title:"Hiring a website agency? Use the checklist, then invite Dimaso to respond.",
    copy:"This page is for buyer teams defining a redesign and evaluating qualified partners. Dimaso does not list open tenders; we review website RFPs submitted by prospective clients.",
    ctaLabel:"Invite Dimaso to review your RFP",
    secondaryLabel:"Explore web design",
    secondaryHref:"/services/web-design",
  },
  "how-to-prepare-a-website-rfp":{
    eyebrow:"Buyer-side website planning",
    title:"Preparing to hire a web partner? Start with a brief the right team can act on.",
    copy:"Share the business problem, scope, constraints, timeline, and decision process. Dimaso can review the brief directly and recommend the right mix of design, development, SEO, and ongoing support.",
    ctaLabel:"Send us your website brief",
    secondaryLabel:"View website services",
    secondaryHref:"/services",
  },
  "how-to-choose-a-website-maintenance-partner":{
    eyebrow:"For teams comparing support providers",
    title:"Need a company to take ongoing ownership of the website?",
    copy:"Dimaso can review the platform, current risks, critical journeys, support backlog, and response needs, then propose a practical monthly maintenance model.",
    ctaLabel:"Request a maintenance proposal",
    secondaryLabel:"Explore website maintenance",
    secondaryHref:"/services/website-maintenance",
  },
  "white-label-wordpress-maintenance-for-agencies":{
    eyebrow:"For agencies buying delivery capacity",
    title:"Add senior WordPress support without weakening the client relationship.",
    copy:"Dimaso supports agencies with white-label maintenance, overflow development, release QA, reporting, and clearly defined ownership behind the scenes.",
    ctaLabel:"Discuss white-label support",
    secondaryLabel:"Explore agency support",
    secondaryHref:"/industries/agencies",
  },
};

export function generateStaticParams(){return posts.map(p=>({slug:p.slug}))}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const p=posts.find(x=>x.slug===slug);
  if(!p)return{};
  const url=`${site.url}/blog/${p.slug}`;
  const modifiedDate="modifiedDate" in p&&typeof p.modifiedDate==="string"?p.modifiedDate:p.date;
  return{title:p.title,description:p.description,alternates:{canonical:url},openGraph:{title:p.title,description:p.description,url,siteName:site.name,type:"article",publishedTime:p.date,modifiedTime:modifiedDate,images:[{url:social.image,alt:social.imageAlt}]},twitter:{card:"summary_large_image",title:p.title,description:p.description,images:[social.image]}};
}

export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const postIndex=posts.findIndex(x=>x.slug===slug);
  const p=posts[postIndex];
  if(!p)notFound();
  const previous=postIndex>0?posts[postIndex-1]:null;
  const next=postIndex<posts.length-1?posts[postIndex+1]:null;
  const content=blogContent[p.slug];
  const faqs=blogFaqs[p.slug]??[];
  const modifiedDate="modifiedDate" in p&&typeof p.modifiedDate==="string"?p.modifiedDate:p.date;
  const tocSections=content.flatMap((block)=>block.type==="h2"&&block.id?[{id:block.id,text:block.text}]:[]);
  const isNonprofitChecklist=p.slug==="website-maintenance-checklist-for-nonprofits";
  const isNonprofitRedesignCost=p.slug==="nonprofit-website-redesign-cost";
  const isSmallBusinessChecklist=p.slug==="small-business-website-maintenance-checklist";
  const isEcommerceChecklist=p.slug==="ecommerce-website-maintenance-checklist";
  const isMaintenancePricing=p.slug==="website-maintenance-costs-and-pricing";
  const buyerQualifier=buyerQualifierBySlug[p.slug];
  const articleTopics=isNonprofitChecklist?["Nonprofit website maintenance","WordPress maintenance for nonprofit organizations","Donation form QA","Website accessibility","Technical SEO","Website analytics"]:isNonprofitRedesignCost?["Nonprofit website redesign cost","Nonprofit web design","Website redesign budget","Website accessibility","Content migration","Technical SEO"]:isSmallBusinessChecklist?["Small business website maintenance","Website maintenance checklist","WordPress maintenance","Lead form QA","Local SEO","Website analytics"]:isEcommerceChecklist?["Ecommerce website maintenance","Ecommerce maintenance checklist","WooCommerce maintenance","Checkout QA","Product SEO","Ecommerce analytics"]:isMaintenancePricing?["Website maintenance cost","WordPress maintenance cost","WooCommerce maintenance cost","Managed WordPress support","Website support pricing"]:p.category;
  const faqTitle=isNonprofitChecklist?"Nonprofit website maintenance FAQ":isNonprofitRedesignCost?"Nonprofit website redesign cost FAQ":isSmallBusinessChecklist?"Small business website maintenance FAQ":isEcommerceChecklist?"Ecommerce website maintenance FAQ":isMaintenancePricing?"Website and WordPress maintenance pricing FAQ":`${p.category} FAQ`;
  const titleSizeClass=p.title.length>58?"blog-title-extra-long":p.title.length>45?"blog-title-long":"";
  const url=`${site.url}/blog/${p.slug}`;
  const curatedRelatedSlugs=isNonprofitRedesignCost?["website-maintenance-checklist-for-nonprofits","website-redesign-rfp-checklist","website-migration-without-losing-seo-value"]:isSmallBusinessChecklist?["website-maintenance-costs-and-pricing","why-ongoing-website-maintenance-matters","how-to-choose-a-website-maintenance-partner"]:isEcommerceChecklist?["why-qa-matters-after-every-update","website-maintenance-costs-and-pricing","what-happens-after-a-technical-seo-audit"]:isMaintenancePricing?["taking-over-an-existing-wordpress-website","small-business-website-maintenance-checklist","ecommerce-website-maintenance-checklist"]:null;
  const relatedPosts=curatedRelatedSlugs?curatedRelatedSlugs.map((relatedSlug)=>posts.find((item)=>item.slug===relatedSlug)).filter((item):item is (typeof posts)[number]=>Boolean(item)):posts
    .filter((item)=>item.slug!==p.slug)
    .map((item)=>({item,score:(item.service===p.service?2:0)+(item.category===p.category?1:0)}))
    .sort((a,b)=>b.score-a.score)
    .slice(0,3)
    .map(({item})=>item);
  return <main>
    <JsonLd data={{"@context":"https://schema.org","@graph":[{"@type":"Article","@id":`${url}#article`,headline:p.title,description:p.description,url,mainEntityOfPage:{"@type":"WebPage","@id":url},image:social.image,datePublished:p.date,dateModified:modifiedDate,inLanguage:"en",about:articleTopics,author:{"@id":organizationId},publisher:{"@id":organizationId},isPartOf:{"@id":websiteId}},{"@type":"BreadcrumbList","@id":`${url}#breadcrumb`,itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`${site.url}/`},{"@type":"ListItem",position:2,name:"Blog",item:`${site.url}/blog`},{"@type":"ListItem",position:3,name:p.title,item:url}]},...(faqs.length?[{"@type":"FAQPage","@id":`${url}#faq`,mainEntity:faqs.map(([question,answer])=>({"@type":"Question",name:question,acceptedAnswer:{"@type":"Answer",text:answer}}))}]:[])]}}/>
    <article>
      <header className="grid-bg blog-hero">
        <div className="shell blog-hero-grid">
          <div>
            <span className="eyebrow">{p.category} · Published <time dateTime={p.date}>{formatDate(p.date)}</time>{modifiedDate!==p.date?<> · Updated <time dateTime={modifiedDate}>{formatDate(modifiedDate)}</time></>:null}</span>
            <h1 className={titleSizeClass}>{p.title}</h1>
            <p className="lede">{p.excerpt}</p>
          </div>
          <div className={`blog-hero-visual blog-card-visual-${(postIndex%6)+1}`} aria-hidden="true">
            <span>{String(postIndex+1).padStart(2,"0")}</span><i/><b/>
          </div>
        </div>
      </header>
      <section className="section blog-article-section">
        <div className="shell blog-article-layout">
          <aside className="blog-article-aside">
            <span className="eyebrow">Dimaso insight</span>
            <p>Prepared by the Dimaso website team for organizations that need dependable strategy, design, development, technical SEO, and support.</p>
            <Link className="blog-author-link" href="/about">About Dimaso →</Link>
            {tocSections.length?<nav className="blog-toc" aria-label="Article contents"><strong>On this page</strong>{tocSections.map((section)=><a key={section.id} href={`#${section.id}`}>{section.text}</a>)}</nav>:null}
          </aside>
          <div className="blog-article-body">
            {buyerQualifier?<aside className="blog-conversion-card blog-buyer-intent-card" aria-label="Commercial service information">
              <span className="eyebrow">{buyerQualifier.eyebrow}</span>
              <h2>{buyerQualifier.title}</h2>
              <p>{buyerQualifier.copy}</p>
              <div className="blog-conversion-actions"><TrackedLink tracking="cta" trackingLocation={`buyer_qualifier_${p.slug}`} trackingLabel={buyerQualifier.ctaLabel} href="#rfp" className="btn">{buyerQualifier.ctaLabel}</TrackedLink><Link href={buyerQualifier.secondaryHref} className="btn ghost">{buyerQualifier.secondaryLabel}</Link></div>
            </aside>:null}
            {content.map((block,index)=>block.type==="p"?<p key={index}>{renderInline(block.content)}</p>:block.type==="ul"?<ul key={index}>{block.items.map((item,itemIndex)=><li key={itemIndex}>{renderInline(item)}</li>)}</ul>:block.type==="table"?<div className="blog-table-wrap" key={index}><table className="blog-comparison-table">{block.caption?<caption>{block.caption}</caption>:null}<thead><tr>{block.headers.map((header)=><th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{block.rows.map((row,rowIndex)=><tr key={rowIndex}>{row.map((cell,cellIndex)=><td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>:block.type==="h2"?<h2 key={index} id={block.id}>{block.text}</h2>:<h3 key={index} id={block.id}>{block.text}</h3>)}
            {isNonprofitChecklist?<>
              <aside className="blog-proof-card" aria-label="Relevant nonprofit website experience">
                <span className="eyebrow">Relevant institutional work</span>
                <h2>Structured content, migration planning, and technical SEO for Art &amp; Science.</h2>
                <p>See how Dimaso supported an information-rich platform with editorial structure, responsive templates, metadata, migration planning, and maintainable publishing patterns relevant to mission-driven organizations.</p>
                <Link className="text-link" href="/case-studies/art-and-science">View the case study →</Link>
              </aside>
              <aside className="blog-conversion-card" aria-label="Request nonprofit website support">
                <span className="eyebrow">A practical next step</span>
                <h2>Turn the checklist into a prioritized website plan.</h2>
                <p>We can review donation paths, WordPress or CMS health, accessibility, security, analytics, technical SEO, and monthly support needs, then organize the findings into immediate risks, quick wins, and a 30/60/90-day roadmap.</p>
                <div className="blog-conversion-actions"><TrackedLink tracking="cta" trackingLocation="nonprofit_checklist" trackingLabel="Request a nonprofit website audit" href="/industries/nonprofits#nonprofit-audit" className="btn">Request a nonprofit website audit</TrackedLink><Link href="/services/website-maintenance" className="btn ghost">Explore monthly website care</Link></div>
              </aside>
            </>:isNonprofitRedesignCost?<>
              <aside className="blog-proof-card" aria-label="Relevant nonprofit website redesign experience">
                <span className="eyebrow">Relevant institutional work</span>
                <h2>Information architecture, migration planning, and maintainable publishing for Art &amp; Science.</h2>
                <p>See how Dimaso supported an information-rich institutional platform with editorial structure, responsive templates, metadata, technical SEO, and content migration planning.</p>
                <Link className="text-link" href="/case-studies/art-and-science">View the case study →</Link>
              </aside>
              <aside className="blog-conversion-card" aria-label="Request a nonprofit website redesign review">
                <span className="eyebrow">Plan the right level of investment</span>
                <h2>Find out whether the website needs a refresh, redesign, or stabilization phase.</h2>
                <p>We can review the current content, donation and form journeys, CMS, accessibility, integrations, technical SEO, analytics, and migration risk, then organize the findings into a practical scope, budget range, and roadmap.</p>
                <div className="blog-conversion-actions"><TrackedLink tracking="cta" trackingLocation="nonprofit_redesign_cost" trackingLabel="Request a nonprofit website review" href="/industries/nonprofits#nonprofit-audit" className="btn">Request a nonprofit website review</TrackedLink><Link href="/services/web-design" className="btn ghost">Explore web design</Link></div>
              </aside>
            </>:isSmallBusinessChecklist?<>
              <aside className="blog-proof-card" aria-label="Relevant small business website experience">
                <span className="eyebrow">Relevant business platform work</span>
                <h2>Portal structure, business profiles, forms, QA, and maintenance-ready patterns for Mega Baza.</h2>
                <p>See how Dimaso supported a growing business directory with structured browsing, profile content, forms, technical support, and a foundation prepared for ongoing improvement.</p>
                <Link className="text-link" href="/case-studies/mega-baza">View the case study →</Link>
              </aside>
              <aside className="blog-conversion-card" aria-label="Request small business website support">
                <span className="eyebrow">A practical next step</span>
                <h2>Turn the 30 checks into an owned monthly website plan.</h2>
                <p>We can review lead delivery, WordPress or CMS health, backups, security, mobile performance, search visibility, analytics, and the current support process, then prioritize immediate risks, quick wins, and planned improvements.</p>
                <div className="blog-conversion-actions"><TrackedLink tracking="cta" trackingLocation="small_business_checklist" trackingLabel="Request a website review" href="/contact" className="btn">Request a website review</TrackedLink><Link href="/services/website-maintenance" className="btn ghost">Explore website maintenance</Link></div>
              </aside>
            </>:isEcommerceChecklist?<>
              <aside className="blog-proof-card" aria-label="Relevant ecommerce website experience">
                <span className="eyebrow">Relevant high-volume ecommerce work</span>
                <h2>Product architecture, payment flow, responsive QA, and launch support for Med Supply Solutions.</h2>
                <p>See how Dimaso supported a WordPress ecommerce platform from sitemap and product taxonomy through checkout, technical SEO, QA, and a maintenance-ready foundation for serious visitor and order volume.</p>
                <Link className="text-link" href="/case-studies/med-supply-solutions">View the case study →</Link>
              </aside>
              <aside className="blog-conversion-card" aria-label="Request ecommerce website support">
                <span className="eyebrow">Protect revenue-sensitive journeys</span>
                <h2>Turn the 30 checks into an owned ecommerce support plan.</h2>
                <p>We can review products, pricing rules, checkout, payments, inventory, updates, recovery, performance, technical SEO, feeds, analytics, and integrations, then prioritize immediate revenue risks and the development roadmap.</p>
                <div className="blog-conversion-actions"><TrackedLink tracking="cta" trackingLocation="ecommerce_checklist" trackingLabel="Request an ecommerce website review" href="/contact" className="btn">Request an ecommerce website review</TrackedLink><Link href="/services/woocommerce-maintenance" className="btn ghost">Explore WooCommerce support</Link></div>
              </aside>
            </>:isMaintenancePricing?<>
              <aside className="blog-proof-card" aria-label="Relevant WordPress ecommerce experience">
                <span className="eyebrow">Relevant WordPress work</span>
                <h2>A maintenance-ready WordPress ecommerce foundation for serious visitor and order volume.</h2>
                <p>See how Dimaso planned Med Supply Solutions from sitemap and product taxonomy through payment flow, responsive implementation, technical SEO, QA, launch readiness, and ongoing improvement.</p>
                <Link className="text-link" href="/case-studies/med-supply-solutions">View the case study →</Link>
              </aside>
              <aside className="blog-conversion-card" aria-label="Request a website maintenance estimate">
                <span className="eyebrow">Price the real responsibility</span>
                <h2>Get a support estimate based on the website, risk, and work you actually need.</h2>
                <p>We can review the current platform, hosting, updates, backups, security, forms or checkout, integrations, analytics, technical SEO, response needs, and improvement backlog, then recommend the right support model and scope.</p>
                <div className="blog-conversion-actions"><TrackedLink tracking="cta" trackingLocation="maintenance_pricing_guide" trackingLabel="Request a maintenance estimate" href="/contact" className="btn">Request a maintenance estimate</TrackedLink><Link href="/services/wordpress-support" className="btn ghost">Explore WordPress support</Link></div>
              </aside>
            </>:<aside className="blog-conversion-card" aria-label="Discuss website services with Dimaso">
              <span className="eyebrow">Move from research to implementation</span>
              <h2>Need a senior website partner to own the next step?</h2>
              <p>Share the current website, the business priority, and any known risks or deadlines. Dimaso will review the context directly and recommend a focused project or ongoing support model.</p>
              <div className="blog-conversion-actions"><TrackedLink tracking="cta" trackingLocation={`article_conversion_${p.slug}`} trackingLabel="Discuss this website requirement" href="#rfp" className="btn">Discuss this website requirement</TrackedLink><Link href={p.service} className="btn ghost">View the relevant service</Link></div>
            </aside>}
            {faqs.length?<section className="blog-article-faq" aria-labelledby="blog-faq-title"><span className="eyebrow">Common questions</span><h2 id="blog-faq-title">{faqTitle}</h2><div className="faq-list">{faqs.map(([question,answer],index)=><details className="faq-item" key={question}><summary><span className="faq-number">{String(index+1).padStart(2,"0")}</span><span>{question}</span><span className="faq-toggle" aria-hidden="true"/></summary><div className="faq-answer"><p>{answer}</p></div></details>)}</div></section>:null}
            <section aria-labelledby="related-insights-title" style={{marginTop:70,paddingTop:28,borderTop:"1px solid rgba(255,255,255,.07)"}}>
              <span className="eyebrow">Related insights</span>
              <h2 id="related-insights-title" style={{marginTop:16}}>Continue exploring this website topic.</h2>
              <div className="cards-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:12,marginTop:28}}>
                {relatedPosts.map((item)=><Link key={item.slug} href={`/blog/${item.slug}`} className="blog-post-nav-card"><span className="eyebrow">{item.category}</span><strong>{item.title}</strong></Link>)}
              </div>
            </section>
            <nav className="blog-post-nav" aria-label="Blog post navigation">
              <Link href="/blog" className="blog-back-link">Back to all posts</Link>
              <div className="blog-post-nav-grid">
                {previous?<Link href={`/blog/${previous.slug}`} className="blog-post-nav-card"><span className="eyebrow">Previous</span><strong>{previous.title}</strong></Link>:<span/>}
                {next?<Link href={`/blog/${next.slug}`} className="blog-post-nav-card next"><span className="eyebrow">Next</span><strong>{next.title}</strong></Link>:<span/>}
              </div>
            </nav>
          </div>
        </div>
      </section>
    </article>
  </main>;
}

function renderInline(content:BlogInline[]){
  return content.map((part,index)=>typeof part==="string"?part:<Link href={part.href} key={index}>{part.text}</Link>);
}

function formatDate(date:string){
  return new Intl.DateTimeFormat("en-US",{year:"numeric",month:"long",day:"numeric",timeZone:"UTC"}).format(new Date(`${date}T00:00:00Z`));
}

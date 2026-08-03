import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/site";
import { TrackedLink } from "@/components/tracked-link";
import { blogFaqs } from "@/content/blog-faqs";
import { posts } from "@/content/data";
import { blogContent, BlogInline } from "@/content/blog-content";
import { organizationId, site, social, websiteId } from "@/lib/site";

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
  const articleTopics=isNonprofitChecklist?["Nonprofit website maintenance","WordPress maintenance for nonprofit organizations","Donation form QA","Website accessibility","Technical SEO","Website analytics"]:isNonprofitRedesignCost?["Nonprofit website redesign cost","Nonprofit web design","Website redesign budget","Website accessibility","Content migration","Technical SEO"]:isSmallBusinessChecklist?["Small business website maintenance","Website maintenance checklist","WordPress maintenance","Lead form QA","Local SEO","Website analytics"]:isEcommerceChecklist?["Ecommerce website maintenance","Ecommerce maintenance checklist","WooCommerce maintenance","Checkout QA","Product SEO","Ecommerce analytics"]:p.category;
  const faqTitle=isNonprofitChecklist?"Nonprofit website maintenance FAQ":isNonprofitRedesignCost?"Nonprofit website redesign cost FAQ":isSmallBusinessChecklist?"Small business website maintenance FAQ":isEcommerceChecklist?"Ecommerce website maintenance FAQ":`${p.category} FAQ`;
  const titleSizeClass=p.title.length>58?"blog-title-extra-long":p.title.length>45?"blog-title-long":"";
  const url=`${site.url}/blog/${p.slug}`;
  const curatedRelatedSlugs=isNonprofitRedesignCost?["website-maintenance-checklist-for-nonprofits","website-redesign-rfp-checklist","website-migration-without-losing-seo-value"]:isSmallBusinessChecklist?["website-maintenance-costs-and-pricing","why-ongoing-website-maintenance-matters","how-to-choose-a-website-maintenance-partner"]:isEcommerceChecklist?["why-qa-matters-after-every-update","website-maintenance-costs-and-pricing","what-happens-after-a-technical-seo-audit"]:null;
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
            {content.map((block,index)=>block.type==="p"?<p key={index}>{renderInline(block.content)}</p>:block.type==="ul"?<ul key={index}>{block.items.map((item,itemIndex)=><li key={itemIndex}>{renderInline(item)}</li>)}</ul>:block.type==="h2"?<h2 key={index} id={block.id}>{block.text}</h2>:<h3 key={index} id={block.id}>{block.text}</h3>)}
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
                <div className="blog-conversion-actions"><TrackedLink tracking="cta" trackingLocation="ecommerce_checklist" trackingLabel="Request an ecommerce website review" href="/contact" className="btn">Request an ecommerce website review</TrackedLink><Link href="/industries/ecommerce" className="btn ghost">Explore ecommerce support</Link></div>
              </aside>
            </>:<Link href={p.service} className="btn">Explore the relevant service</Link>}
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

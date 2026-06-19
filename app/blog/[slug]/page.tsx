import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/site";
import { posts } from "@/content/data";
import { blogContent, BlogInline } from "@/content/blog-content";
import { organizationId, site, social, websiteId } from "@/lib/site";

export function generateStaticParams(){return posts.map(p=>({slug:p.slug}))}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const p=posts.find(x=>x.slug===slug);
  if(!p)return{};
  const url=`${site.url}/blog/${p.slug}`;
  return{title:p.title,description:p.excerpt,alternates:{canonical:url},openGraph:{title:p.title,description:p.excerpt,url,siteName:site.name,type:"article",publishedTime:p.date,modifiedTime:p.date,images:[{url:social.image,alt:social.imageAlt}]},twitter:{card:"summary_large_image",title:p.title,description:p.excerpt,images:[social.image]}};
}

export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const postIndex=posts.findIndex(x=>x.slug===slug);
  const p=posts[postIndex];
  if(!p)notFound();
  const previous=postIndex>0?posts[postIndex-1]:null;
  const next=postIndex<posts.length-1?posts[postIndex+1]:null;
  const content=blogContent[p.slug];
  const url=`${site.url}/blog/${p.slug}`;
  return <main>
    <JsonLd data={{"@context":"https://schema.org","@graph":[{"@type":"Article","@id":`${url}#article`,headline:p.title,description:p.excerpt,url,mainEntityOfPage:{"@type":"WebPage","@id":url},image:social.image,datePublished:p.date,dateModified:p.date,author:{"@id":organizationId},publisher:{"@id":organizationId},isPartOf:{"@id":websiteId}},{"@type":"BreadcrumbList","@id":`${url}#breadcrumb`,itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`${site.url}/`},{"@type":"ListItem",position:2,name:"Blog",item:`${site.url}/blog`},{"@type":"ListItem",position:3,name:p.title,item:url}]}]}}/>
    <article>
      <header className="grid-bg blog-hero">
        <div className="shell blog-hero-grid">
          <div>
            <span className="eyebrow">{p.category} · {p.date}</span>
            <h1>{p.title}</h1>
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
            <p>Written for teams that need the website to keep supporting sales, operations, search visibility, and trust after launch.</p>
          </aside>
          <div className="blog-article-body">
            {content.map((block,index)=>block.type==="p"?<p key={index}>{renderInline(block.content)}</p>:block.type==="h2"?<h2 key={index}>{block.text}</h2>:<h3 key={index}>{block.text}</h3>)}
            <Link href={p.service} className="btn">Explore the relevant service</Link>
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

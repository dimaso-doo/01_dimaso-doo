import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/site";
import { posts } from "@/content/data";
import { site } from "@/lib/site";

export function generateStaticParams(){return posts.map(p=>({slug:p.slug}))}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const p=posts.find(x=>x.slug===slug);
  if(!p)return{};
  return{title:p.title,description:p.excerpt,alternates:{canonical:`${site.url}/blog/${p.slug}`}};
}

export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const postIndex=posts.findIndex(x=>x.slug===slug);
  const p=posts[postIndex];
  if(!p)notFound();
  const previous=postIndex>0?posts[postIndex-1]:null;
  const next=postIndex<posts.length-1?posts[postIndex+1]:null;
  return <main>
    <JsonLd data={{"@context":"https://schema.org","@type":"Article",headline:p.title,datePublished:p.date,description:p.excerpt,author:{"@type":"Organization",name:"Dimaso"}}}/>
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
            <h2>Treat the website as an operating system, not a one-time asset.</h2>
            <p>Strong websites compound value when ownership, quality assurance, performance, and continuous improvement are part of the operating model. The difficult part is rarely a single update. It is maintaining clarity and technical confidence across hundreds of decisions.</p>
            <p>A useful website process connects business goals with technical reality: content structure, responsive behavior, forms, integrations, analytics, search visibility, security, and the release rhythm behind every change.</p>
            <h2>Make risk visible before it becomes urgent.</h2>
            <p>Small website problems often become expensive because no one sees the full system. A plugin update can affect forms. A redesign can break URLs. A migration can erase search value. A rushed feature can slow down the pages that already convert.</p>
            <p>That is why maintenance, development, design, and technical SEO should not be isolated conversations. Each decision needs context: what the user needs, what the business measures, what the platform can support, and what needs to stay stable.</p>
            <h2>Start with a clear baseline.</h2>
            <p>Before the next redesign, feature, or support plan, establish what is working now. Review critical URLs, forms, mobile layouts, performance, analytics, content hierarchy, CMS editing paths, and the areas where the team is already losing time.</p>
            <p>From there, prioritize the work that lowers risk and creates momentum. The right roadmap does not try to do everything at once. It gives the team a dependable sequence: stabilize, improve, measure, and keep learning.</p>
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

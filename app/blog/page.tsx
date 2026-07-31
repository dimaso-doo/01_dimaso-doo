import Link from "next/link";
import { Newsletter } from "@/components/forms";
import { BlogCards, SectionHead } from "@/components/sections";
import { JsonLd } from "@/components/site";
import { posts } from "@/content/data";
import { metadata as meta, site, websiteId } from "@/lib/site";

const perPage=9;
const totalPages=Math.ceil(posts.length/perPage);

export const metadata=meta("Website Maintenance & Development Insights","Practical guidance from Dimaso on website maintenance, web development, WordPress, QA, technical SEO, redesigns, migrations, and long-term support.","/blog");

export default function Page(){
  const url=`${site.url}/blog`;
  const pagePosts=posts.slice(0,perPage);
  return <main>
    <JsonLd data={{"@context":"https://schema.org","@graph":[{"@type":"Blog","@id":`${url}#blog`,url,name:"Website insights",description:"Practical website support, development, QA, design, and technical SEO insights from Dimaso.",isPartOf:{"@id":websiteId}},{"@type":"ItemList","@id":`${url}#itemlist`,itemListElement:pagePosts.map((post,index)=>({"@type":"ListItem",position:index+1,url:`${site.url}/blog/${post.slug}`,name:post.title}))}]}}/>
    <section className="grid-bg" style={{padding:"130px 0 90px"}}>
      <div className="shell">
        <span className="eyebrow">Insights</span>
        <h1 style={{fontSize:"clamp(52px,9vw,100px)",margin:"20px 0"}}>Better website decisions start here.</h1>
        <p className="lede">Clear thinking about maintenance, development, design, QA, and technical SEO.</p>
      </div>
    </section>
    <section className="section">
      <div className="shell">
        <SectionHead eyebrow="Latest" title="Practical, technical, useful."/>
        <div style={{marginTop:50}}><BlogCards page={1} perPage={perPage}/></div>
        <nav className="blog-pagination" aria-label="Blog pagination">
          {Array.from({length:totalPages}).map((_,i)=>{
            const page=i+1;
            return <Link key={page} href={page===1?"/blog":`/blog/page/${page}`} className={page===1?"is-active":""}>{page}</Link>;
          })}
          {totalPages>1&&<Link href="/blog/page/2" className="blog-pagination-next">Next</Link>}
        </nav>
        <div className="card" style={{maxWidth:650,marginTop:50}}><Newsletter/></div>
      </div>
    </section>
  </main>;
}

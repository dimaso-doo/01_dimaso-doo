import Link from "next/link";
import { notFound } from "next/navigation";
import { Newsletter } from "@/components/forms";
import { BlogCards, SectionHead } from "@/components/sections";
import { JsonLd } from "@/components/site";
import { posts } from "@/content/data";
import { site, social, websiteId } from "@/lib/site";

const perPage=9;
const totalPages=Math.ceil(posts.length/perPage);

export function generateStaticParams(){
  return Array.from({length:Math.max(totalPages-1,0)}).map((_,i)=>({page:String(i+2)}));
}

export async function generateMetadata({params}:{params:Promise<{page:string}>}){
  const {page}=await params;
  const title=`Website insights - page ${page}`;
  const description="More practical Dimaso articles on website maintenance, redesign planning, migration, reporting, design systems, and custom development.";
  const url=`${site.url}/blog/page/${page}`;
  return {title,description,alternates:{canonical:url},openGraph:{title,description,url,siteName:site.name,type:"website",images:[{url:social.image,alt:social.imageAlt}]},twitter:{card:"summary_large_image",title,description,images:[social.image]}};
}

export default async function Page({params}:{params:Promise<{page:string}>}){
  const {page}=await params;
  const current=Number(page);
  if(!Number.isInteger(current)||current<2||current>totalPages)notFound();
  const prevHref=current===2?"/blog":`/blog/page/${current-1}`;
  const nextHref=current<totalPages?`/blog/page/${current+1}`:null;
  const url=`${site.url}/blog/page/${current}`;
  const pagePosts=posts.slice((current-1)*perPage,current*perPage);
  return <main>
    <JsonLd data={{"@context":"https://schema.org","@graph":[{"@type":"Blog","@id":`${url}#blog`,url,name:`Website insights - page ${current}`,description:"More practical Dimaso articles on website maintenance, redesign planning, migration, reporting, design systems, and custom development.",isPartOf:{"@id":websiteId}},{"@type":"ItemList","@id":`${url}#itemlist`,itemListElement:pagePosts.map((post,index)=>({"@type":"ListItem",position:(current-1)*perPage+index+1,url:`${site.url}/blog/${post.slug}`,name:post.title}))}]}}/>
    <section className="grid-bg" style={{padding:"130px 0 90px"}}>
      <div className="shell">
        <span className="eyebrow">Insights · Page {current}</span>
        <h1 style={{fontSize:"clamp(52px,9vw,100px)",margin:"20px 0"}}>More website maintenance, design, and development insights.</h1>
        <p className="lede">Clear thinking about maintenance, development, design, QA, and technical SEO.</p>
      </div>
    </section>
    <section className="section">
      <div className="shell">
        <SectionHead eyebrow="Archive" title="More practical website notes."/>
        <div style={{marginTop:50}}><BlogCards page={current} perPage={perPage}/></div>
        <nav className="blog-pagination" aria-label="Blog pagination">
          <Link href={prevHref} className="blog-pagination-prev">Previous</Link>
          {Array.from({length:totalPages}).map((_,i)=>{
            const pageNumber=i+1;
            return <Link key={pageNumber} href={pageNumber===1?"/blog":`/blog/page/${pageNumber}`} className={pageNumber===current?"is-active":""}>{pageNumber}</Link>;
          })}
          {nextHref&&<Link href={nextHref} className="blog-pagination-next">Next</Link>}
        </nav>
        <div className="card" style={{maxWidth:650,marginTop:50}}><Newsletter/></div>
      </div>
    </section>
  </main>;
}

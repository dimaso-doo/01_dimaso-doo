import Link from "next/link";
import { notFound } from "next/navigation";
import { Newsletter } from "@/components/forms";
import { BlogCards, SectionHead } from "@/components/sections";
import { posts } from "@/content/data";
import { site } from "@/lib/site";

const perPage=9;
const totalPages=Math.ceil(posts.length/perPage);

export function generateStaticParams(){
  return Array.from({length:Math.max(totalPages-1,0)}).map((_,i)=>({page:String(i+2)}));
}

export async function generateMetadata({params}:{params:Promise<{page:string}>}){
  const {page}=await params;
  return {title:`Website insights - page ${page}`,description:"Practical website support, development, QA, design, and technical SEO insights from Dimaso.",alternates:{canonical:`${site.url}/blog/page/${page}`}};
}

export default async function Page({params}:{params:Promise<{page:string}>}){
  const {page}=await params;
  const current=Number(page);
  if(!Number.isInteger(current)||current<2||current>totalPages)notFound();
  const prevHref=current===2?"/blog":`/blog/page/${current-1}`;
  const nextHref=current<totalPages?`/blog/page/${current+1}`:null;
  return <main>
    <section className="grid-bg" style={{padding:"130px 0 90px"}}>
      <div className="shell">
        <span className="eyebrow">Insights · Page {current}</span>
        <h1 style={{fontSize:"clamp(52px,9vw,100px)",margin:"20px 0"}}>Better website decisions start here.</h1>
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

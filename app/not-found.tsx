import Link from "next/link";

export default function NotFound(){
  return <main>
    <section className="not-found-section grid-bg">
      <div className="shell not-found-layout">
        <div className="not-found-visual" aria-hidden="true">
          <div className="not-found-orbit one"><span/><span/></div>
          <div className="not-found-orbit two"><span/><span/></div>
          <div className="not-found-core">
            <span>404</span>
          </div>
          <div className="not-found-scan"/>
        </div>
        <div className="not-found-copy">
          <span className="eyebrow">Page not found / Dimaso</span>
          <h1>Unfortunately, this page does not exist.</h1>
          <p className="lede">The link may be outdated, the address may be mistyped, or the page may have moved during a website update.</p>
          <Link href="/" className="btn">Back to homepage</Link>
        </div>
      </div>
    </section>
  </main>;
}

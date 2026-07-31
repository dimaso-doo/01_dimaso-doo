"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { motion, useScroll } from "framer-motion";
import { ContactForm, Newsletter } from "./forms";
import { TrackedLink } from "./tracked-link";

const serviceLinks = [["Website Maintenance","/services/website-maintenance"],["Web Development","/services/web-development"],["Web Design","/services/web-design"],["WordPress Support","/services/wordpress-support"],["Technical SEO","/services/technical-seo"],["AI Website & Workflow Support","/services/ai-website-workflow-support"]] as const;
const industryLinks = [["Nonprofits","/industries/nonprofits"],["Associations","/industries/associations"],["Agencies","/industries/agencies"],["Small Businesses","/industries/small-businesses"],["Education","/industries/education"],["Healthcare","/industries/healthcare"],["Ecommerce","/industries/ecommerce"]] as const;
const links = [["Home","/"],["Case Studies","/case-studies"],["Blog","/blog"],["About","/about"],["Contact","/contact"]] as const;
const linkedinUrl = "https://www.linkedin.com/company/dimaso.co/";
const formContextByPath:Record<string,{source:string;subject:string;defaultService?:string}>={
  "/website-maintenance":{source:"Website Maintenance",subject:"New RFP Request - Website Maintenance - dimaso.co",defaultService:"Website Maintenance"},
  "/web-development":{source:"Web Development",subject:"New RFP Request - Web Development - dimaso.co",defaultService:"Web Development"},
  "/web-design":{source:"Web Design",subject:"New RFP Request - Web Design - dimaso.co",defaultService:"Web Design"},
  "/services/website-maintenance":{source:"Website Maintenance",subject:"New RFP Request - Website Maintenance - dimaso.co",defaultService:"Website Maintenance"},
  "/services/web-development":{source:"Web Development",subject:"New RFP Request - Web Development - dimaso.co",defaultService:"Web Development"},
  "/services/web-design":{source:"Web Design",subject:"New RFP Request - Web Design - dimaso.co",defaultService:"Web Design"},
  "/services/wordpress-support":{source:"WordPress Support",subject:"New RFP Request - WordPress Support - dimaso.co",defaultService:"WordPress Support"},
  "/services/technical-seo":{source:"Technical SEO",subject:"New RFP Request - Technical SEO - dimaso.co",defaultService:"Technical SEO"},
  "/services/ai-website-workflow-support":{source:"AI Website & Workflow Support",subject:"New RFP Request - AI Website & Workflow Support - dimaso.co",defaultService:"AI Website & Workflow Support"},
  "/industries/nonprofits":{source:"Nonprofit Website Support",subject:"New Nonprofit Website Audit / Support Request - dimaso.co",defaultService:"Website Maintenance"},
  "/contact":{source:"Contact Page",subject:"New Contact / RFP Request - Contact Page - dimaso.co"},
};

const logoPaths=[
  "M210.35 141.39H143.72C142.43 141.39 141.38 142.44 141.38 143.73V276.98C141.38 278.27 142.43 279.32 143.72 279.32H210.35C248.44 279.32 279.31 248.45 279.31 210.36C279.31 172.27 248.44 141.4 210.35 141.4V141.39ZM208.43 245C189.29 245 173.78 229.49 173.78 210.35C173.78 191.21 189.29 175.7 208.43 175.7C227.57 175.7 243.08 191.21 243.08 210.35C243.08 229.49 227.57 245 208.43 245Z",
  "M349.27 141.4H398C432.93 141.4 455.62 165.87 455.62 200.59V220.32C455.62 255.05 432.93 279.51 398 279.51H349.27V141.39V141.4ZM397.61 264.72C423.06 264.72 439.44 245.58 439.44 218.15V202.76C439.44 175.14 423.06 156 397.61 156H365.25V264.72H397.61Z",
  "M470.41 152.65C470.41 146.53 474.75 141.6 481.26 141.6C487.77 141.6 491.91 146.53 491.91 152.65C491.91 158.77 487.77 163.5 481.26 163.5C474.75 163.5 470.41 158.77 470.41 152.65ZM473.38 182.64H489.16V279.52H473.38V182.64Z",
  "M511.65 182.64H527.04L526.84 197.04C532.56 185.6 543.21 180.07 556.24 180.07C570.05 180.07 580.9 186.78 585.64 198.62C591.95 185.99 603.59 180.07 616.62 180.07C638.13 180.07 651.15 193.09 651.15 214.8V279.52H635.37V217.96C635.37 201.98 628.66 193.5 615.05 193.5C599.46 193.5 589.4 206.13 589.4 227.44V279.53H573.62V217.97C573.62 201.99 566.91 193.51 553.29 193.51C537.51 193.51 527.45 206.14 527.45 227.45V279.54H511.67V182.66L511.65 182.64Z",
  "M662.59 252.29C662.59 235.72 673.05 224.67 694.55 223.29L711.91 222.11C722.37 221.51 726.11 218.36 726.11 211.26V209.88C726.11 201 720.19 192.52 705.2 192.52C692.37 192.52 683.1 198.83 681.72 212.05H665.94C667.91 192.71 681.92 180.08 705.2 180.08C730.85 180.08 741.11 195.47 741.11 213.43V258.61C741.11 263.94 743.28 265.72 748.01 265.72H753.14V279.53H746.24C735.39 279.53 730.26 275.19 728.68 266.9L728.48 264.53C723.15 274.59 712.1 281.1 695.92 281.1C676.39 281.1 662.58 270.05 662.58 252.29H662.59ZM726.32 242.03V228.81C722.76 232.16 717.44 233.74 710.73 234.33L696.53 235.32C684.49 236.31 677.98 242.03 677.98 251.3C677.98 261.36 685.67 267.47 698.5 267.47C712.91 267.47 726.33 260.37 726.33 242.02L726.32 242.03Z",
  "M754.92 248.94H771.3C773.28 261.57 783.14 268.87 798.33 268.87C813.52 268.87 822.79 262.75 822.79 253.08C822.79 244.4 817.66 240.26 804.24 238.28L788.26 235.91C771.48 233.35 760.44 225.65 760.44 209.08C760.44 190.93 775.63 180.08 796.74 180.08C817.85 180.08 831.47 190.74 834.62 209.08H818.64C816.27 198.43 809.17 192.7 796.15 192.7C783.13 192.7 775.44 199.01 775.44 207.5C775.44 215.99 779.78 220.52 792.8 222.3L808.98 224.86C826.15 227.42 838.38 234.52 838.38 252.88C838.38 271.24 820.03 282.08 798.72 282.08C774.65 282.08 758.08 270.44 754.92 248.93V248.94Z",
  "M849.04 239.66V222.5C849.04 200.2 865.61 180.08 893.83 180.08C922.05 180.08 938.62 200.21 938.62 222.5V239.66C938.62 261.76 922.05 282.08 893.83 282.08C865.61 282.08 849.04 261.76 849.04 239.66ZM923.03 237.49V224.46C923.03 204.34 910.4 193.68 893.82 193.68C877.24 193.68 864.62 204.34 864.62 224.46V237.49C864.62 257.62 877.25 268.46 893.82 268.46C910.39 268.46 923.03 257.61 923.03 237.49Z",
] as const;

export function Logo({animated=false}:{animated?:boolean}) {
  if(animated) {
    return <Link href="/" aria-label="Dimaso home" className="animated-logo">
      <span className="sr-only">Dimaso home</span>
      <svg className="animated-logo-svg" viewBox="141 141 798 142" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="logoMarkBubble" x1="158" y1="151" x2="258" y2="270" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#b9ffe4"/>
            <stop offset=".35" stopColor="#00f0a4"/>
            <stop offset=".72" stopColor="#00b87c"/>
            <stop offset="1" stopColor="#006f4d"/>
          </linearGradient>
          <linearGradient id="logoMarkSide" x1="150" y1="150" x2="244" y2="286" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#00b97f"/>
            <stop offset="1" stopColor="#004832"/>
          </linearGradient>
          <radialGradient id="logoMarkGloss" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(185 174) rotate(48) scale(83 58)">
            <stop offset="0" stopColor="#ffffff" stopOpacity=".78"/>
            <stop offset=".34" stopColor="#d6fff0" stopOpacity=".34"/>
            <stop offset="1" stopColor="#ffffff" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {[5,4,3,2,1].map((depth)=><path key={`mark-depth-${depth}`} className="animated-logo-depth" style={{"--depth":depth} as React.CSSProperties} d={logoPaths[0]} fill="url(#logoMarkSide)" stroke="#64ffd0" strokeWidth="5" strokeLinejoin="round"/>)}
        {logoPaths.map((path,index)=><path key={path} className={`animated-logo-glyph ${index===0?"is-mark":""} ${index===1?"is-primary":""}`} style={{"--glyph-delay":`${index===0 ? .08 : .28+(index*.12)}s`} as React.CSSProperties} d={path} fill={index===0?"url(#logoMarkBubble)":"#00D892"} stroke={index===0?"#a7ffe4":undefined} strokeWidth={index===0?3:undefined} strokeLinejoin={index===0?"round":undefined}/>)}
        <path className="animated-logo-highlight" d={logoPaths[0]} fill="url(#logoMarkGloss)"/>
      </svg>
    </Link>;
  }
  return <Link href="/" aria-label="Dimaso home" style={{display:"inline-flex",alignItems:"center",flexShrink:0}}>
    <Image src="/dimaso-logo-accent.svg" alt="Dimaso" width={135} height={24} style={{display:"block",width:135,height:24}}/>
  </Link>;
}

export function Header() {
  const [open,setOpen]=useState(false);
  const [openDropdown,setOpenDropdown]=useState<"services"|"industries"|null>(null);
  const [suppressedDropdown,setSuppressedDropdown]=useState<"services"|"industries"|null>(null);
  const [mounted,setMounted]=useState(false);
  const pathname=usePathname();
  const menuButton=useRef<HTMLButtonElement>(null);
  const navRef=useRef<HTMLElement>(null);
  const firstMobileLink=useRef<HTMLAnchorElement>(null);
  const {scrollYProgress}=useScroll();
  const isActive=(href:string)=>href==="/" ? pathname==="/" : pathname===href||pathname.startsWith(`${href}/`);
  useEffect(()=>setMounted(true),[]);
  useEffect(()=>{setOpenDropdown(null);setSuppressedDropdown(null);},[pathname]);
  useEffect(()=>{
    const onPointerDown=(event:PointerEvent)=>{if(navRef.current&&!navRef.current.contains(event.target as Node))setOpenDropdown(null);};
    const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpenDropdown(null);};
    window.addEventListener("pointerdown",onPointerDown);
    window.addEventListener("keydown",onKey);
    return()=>{window.removeEventListener("pointerdown",onPointerDown);window.removeEventListener("keydown",onKey);};
  },[]);
  useEffect(()=>{document.body.style.overflow=open?"hidden":"";return()=>{document.body.style.overflow=""}},[open]);
  useEffect(()=>{
    if(!open)return;
    firstMobileLink.current?.focus();
    const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape"){setOpen(false);menuButton.current?.focus();}};
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[open]);
  return <header style={{position:"sticky",top:0,zIndex:10000,background:"rgba(23,23,25,.86)",backdropFilter:"blur(18px)",borderBottom:"1px solid rgba(255,255,255,.055)"}}>
    <div style={{minHeight:84,width:"100%",padding:"10px clamp(20px,3vw,55px)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:22}}>
      <Logo animated/><nav ref={navRef} className="hide-mobile" style={{display:"flex",alignItems:"center",gap:25}}>
        {links.slice(0,1).map(([l,h])=><Link key={h} href={h} className={`nav-link ${isActive(h)?"is-active":""}`} aria-current={isActive(h)?"page":undefined}>{l}</Link>)}
        <NavDropdown id="services" label="Services" items={serviceLinks} active={pathname.startsWith("/services")||["/website-maintenance","/web-development","/web-design"].some((href)=>isActive(href))} open={openDropdown==="services"} suppressed={suppressedDropdown==="services"} setOpen={setOpenDropdown} setSuppressed={setSuppressedDropdown}/>
        <NavDropdown id="industries" label="Industries" items={industryLinks} active={pathname.startsWith("/industries")} open={openDropdown==="industries"} suppressed={suppressedDropdown==="industries"} setOpen={setOpenDropdown} setSuppressed={setSuppressedDropdown}/>
        {links.slice(1).map(([l,h])=><Link key={h} href={h} className={`nav-link ${isActive(h)?"is-active":""}`} aria-current={isActive(h)?"page":undefined}>{l}</Link>)}
      </nav>
      <Link href="#rfp" className="btn hide-mobile" style={{"--btn-h":"44px"} as React.CSSProperties}>Send RFP</Link>
      <button ref={menuButton} aria-label={open?"Close menu":"Open menu"} aria-expanded={open} onClick={()=>setOpen(!open)} className={`menu-button ${open?"is-open":""}`} style={{display:"none"}}><span/><span/><span/></button>
    </div>
    <motion.div className="scroll-progress" style={{scaleX:scrollYProgress}}/>
    {mounted&&open&&createPortal(<nav className="mobile-nav" aria-label="Mobile navigation">{links.slice(0,1).map(([l,h],i)=><Link key={h} href={h} ref={i===0?firstMobileLink:undefined} onClick={()=>setOpen(false)} className={`nav-link ${isActive(h)?"is-active":""}`} aria-current={isActive(h)?"page":undefined}>{l}</Link>)}<MobileGroup label="Services" items={serviceLinks} close={()=>setOpen(false)}/><MobileGroup label="Industries" items={industryLinks} close={()=>setOpen(false)}/>{links.slice(1).map(([l,h])=><Link key={h} href={h} onClick={()=>setOpen(false)} className={`nav-link ${isActive(h)?"is-active":""}`} aria-current={isActive(h)?"page":undefined}>{l}</Link>)}<Link href="#rfp" onClick={()=>setOpen(false)} className="btn" style={{marginTop:22}}>Send RFP</Link><div className="mobile-nav-contact"><TrackedLink tracking="email" trackingLocation="header" href="mailto:office@dimaso.co">office@dimaso.co</TrackedLink><TrackedLink tracking="phone" trackingLocation="header" href="tel:+381611375150">+381 61 137 5150</TrackedLink><TrackedLink tracking="linkedin" trackingLocation="header" href={linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</TrackedLink></div><div className="mobile-nav-meta">Dimaso RS · Novi Sad, Serbia<br/>Dimaso US · Sheridan, USA</div></nav>,document.body)}
  </header>;
}

function NavDropdown({id,label,items,active,open,suppressed,setOpen,setSuppressed}:{id:"services"|"industries";label:string;items:readonly (readonly [string,string])[];active:boolean;open:boolean;suppressed:boolean;setOpen:(id:"services"|"industries"|null)=>void;setSuppressed:(id:"services"|"industries"|null)=>void}) {
  const panelId=`${id}-dropdown-panel`;
  return <div className={`nav-dropdown ${open?"is-open":""} ${suppressed?"is-suppressed":""}`} onMouseLeave={()=>setSuppressed(null)}><button type="button" className={`nav-link nav-dropdown-trigger ${active?"is-active":""}`} aria-expanded={open} aria-controls={panelId} onClick={()=>{setSuppressed(null);setOpen(open?null:id);}}>{label}</button><div id={panelId} className="nav-dropdown-panel">{items.map(([item,href])=><Link key={href} href={href} onClick={(event)=>{event.currentTarget.blur();setOpen(null);setSuppressed(id);}}>{item}</Link>)}</div></div>;
}

function MobileGroup({label,items,close}:{label:string;items:readonly (readonly [string,string])[];close:()=>void}) {
  return <details className="mobile-nav-group" open><summary>{label}</summary><div>{items.map(([item,href])=><Link key={href} href={href} onClick={close}>{item}</Link>)}</div></details>;
}

export function Footer() {
  const pathname=usePathname();
  const formContext=formContextByPath[pathname]||{source:"Home/Footer",subject:"New RFP Request - Home/Footer - dimaso.co"};
  return <footer id="rfp" className="section site-footer">
    <div className="shell">
      <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1.3fr)",gap:60}} className="footer-grid">
        <div className="footer-info-panel">
          <div className="footer-location-grid"><div><span className="eyebrow">Serbia / Europe</span><strong>Dimaso RS</strong><small>Novi Sad, Serbia</small></div><div><span className="eyebrow">United States</span><strong>Dimaso US</strong><small>Sheridan, USA</small></div></div>
          <div className="footer-contact-list"><TrackedLink tracking="email" trackingLocation="footer" className="footer-contact-link email" href="mailto:office@dimaso.co">office@dimaso.co</TrackedLink><TrackedLink tracking="phone" trackingLocation="footer" className="footer-contact-link phone" href="tel:+381611375150">+381 61 137 5150</TrackedLink><TrackedLink tracking="linkedin" trackingLocation="footer" className="footer-contact-link linkedin" href={linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</TrackedLink></div>
          <div style={{marginTop:42}}><Newsletter /></div>
        </div>
        <div className="footer-rfp-column"><div className="footer-rfp-head"><span className="eyebrow">Start a conversation</span><h2>Send your RFP or project brief.</h2><p>Share the context, goals, constraints, and files you already have. A senior member of the team will review it directly.</p></div><ContactForm {...formContext}/></div>
      </div>
      <div className="footer-directory"><div><Logo/><p className="lede" style={{fontSize:16,marginTop:20}}>A senior technical partner for websites that need to stay reliable, evolve, and perform.</p></div><FooterLinkColumns/></div>
      <div className="rule" style={{margin:"40px 0 25px"}}/><div className="footer-bottom"><span>© {new Date().getFullYear()} Dimaso. All rights reserved.</span><div className="footer-legal-row"><span>Websites maintained, developed, and improved with care since 2008.</span><nav aria-label="Legal links"><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms-and-conditions">Terms and Conditions</Link></nav></div></div>
    </div>
  </footer>;
}

function FooterLinkColumns() {
  const companyLinks = [["Home","/"],["Case Studies","/case-studies"],["Blog","/blog"],["About","/about"],["Contact","/contact"],["Send RFP","#rfp"]] as const;
  return <nav className="footer-link-columns" aria-label="Footer navigation"><FooterColumn title="Services" links={serviceLinks}/><FooterColumn title="Industries" links={industryLinks}/><FooterColumn title="Company" links={companyLinks}/></nav>;
}

function FooterColumn({title,links}:{title:string;links:readonly (readonly [string,string])[]}) {
  return <div><span className="eyebrow">{title}</span>{links.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}</div>;
}

export function CTA({title="Need a partner who can own the technical detail?",label="Request a technical review"}:{title?:string,label?:string}) {
  return <section className="inner-cta">
    <div className="tech-orbit inner-cta-orbit one"/>
    <div className="tech-orbit two inner-cta-orbit two"/>
    <span className="hero-plus p1">+</span><span className="hero-plus p2">+</span><span className="hero-plus p3">+</span>
    <div className="shell inner-cta-content"><div><span className="eyebrow">Next step / Dimaso</span><h2>{title}</h2></div><Link href="#rfp" className="btn">{label}</Link></div>
  </section>;
}

export function FeatureCTA() {
  return <section className="feature-cta"><div className="tech-orbit" style={{inset:"auto -120px -290px auto",width:620,height:620}}/><div className="tech-orbit two" style={{inset:"auto -10px -180px auto",width:400,height:400}}/><span className="hero-plus p1">+</span><span className="hero-plus p2">+</span><span className="hero-plus p3">+</span><div className="shell" style={{position:"relative",zIndex:1}}><span className="eyebrow">Website operations / growth</span><h2 style={{fontSize:"clamp(42px,6.4vw,76px)",lineHeight:.98,maxWidth:880,margin:"20px 0 34px"}}>Your website should be a dependable business system.</h2><Link href="#rfp" className="btn">Get a technical review</Link></div></section>;
}

export function JsonLd({data}:{data:object}) { return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data)}}/>; }

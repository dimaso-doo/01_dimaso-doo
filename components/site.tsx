"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useScroll } from "framer-motion";
import { ContactForm, Newsletter } from "./forms";

const links = [["Home","/"],["Web Maintenance","/website-maintenance"],["Web Development","/web-development"],["Web Design","/web-design"],["Case Studies","/case-studies"],["Blog","/blog"],["Contact","/contact"]];
const mobileLinks = [["Home","/"],["Maintenance","/website-maintenance"],["Development","/web-development"],["Design","/web-design"],["Case Studies","/case-studies"],["Blog","/blog"],["Contact","/contact"]];
const linkedinUrl = "https://www.linkedin.com/company/dimaso/";

export function Logo() {
  return <Link href="/" aria-label="Dimaso home" style={{display:"inline-flex",alignItems:"center",flexShrink:0}}>
    <img src="/dimaso-logo-accent.svg" alt="Dimaso" width="135" height="24" style={{display:"block",width:135,height:24}}/>
  </Link>;
}

export function Header() {
  const [open,setOpen]=useState(false);
  const [mounted,setMounted]=useState(false);
  const menuButton=useRef<HTMLButtonElement>(null);
  const firstMobileLink=useRef<HTMLAnchorElement>(null);
  const {scrollYProgress}=useScroll();
  useEffect(()=>setMounted(true),[]);
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
      <Logo/><nav className="hide-mobile" style={{display:"flex",alignItems:"center",gap:25}}>{links.map(([l,h])=><Link key={h} href={h} className="nav-link">{l}</Link>)}</nav>
      <Link href="/contact" className="btn hide-mobile" style={{"--btn-h":"44px"} as React.CSSProperties}>Request for proposal</Link>
      <button ref={menuButton} aria-label={open?"Close menu":"Open menu"} aria-expanded={open} onClick={()=>setOpen(!open)} className={`menu-button ${open?"is-open":""}`} style={{display:"none"}}><span/><span/><span/></button>
    </div>
    <motion.div className="scroll-progress" style={{scaleX:scrollYProgress}}/>
    {mounted&&open&&createPortal(<nav className="mobile-nav" aria-label="Mobile navigation">{mobileLinks.map(([l,h],i)=><Link key={h} href={h} ref={i===0?firstMobileLink:undefined} onClick={()=>setOpen(false)} className="nav-link">{l}</Link>)}<div className="mobile-nav-contact"><a href="mailto:office@dimaso.co">office@dimaso.co</a><a href="tel:+381611375150">+381 61 137 5150</a><a href={linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a></div><div className="mobile-nav-meta">Dimaso RS · Novi Sad, Serbia<br/>Dimaso US · New York, USA</div></nav>,document.body)}
  </header>;
}

export function Footer() {
  return <footer id="rfp" className="section site-footer">
    <div className="shell">
      <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1.3fr)",gap:60}} className="footer-grid">
        <div className="footer-info-panel"><div><Logo/><p className="lede" style={{fontSize:16,marginTop:20}}>A senior technical partner for websites that need to stay reliable, evolve, and perform.</p></div>
          <div className="footer-location-grid"><div><span className="eyebrow">Serbia / Europe</span><strong>Dimaso RS</strong><small>Novi Sad, Serbia</small></div><div><span className="eyebrow">United States</span><strong>Dimaso US</strong><small>New York, USA</small></div></div>
          <div className="footer-contact-list"><a className="footer-contact-link email" href="mailto:office@dimaso.co">office@dimaso.co</a><a className="footer-contact-link phone" href="tel:+381611375150">+381 61 137 5150</a><a className="footer-contact-link linkedin" href={linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
          <div style={{marginTop:42}}><Newsletter /></div>
        </div>
        <div className="footer-rfp-column"><div className="footer-rfp-head"><span className="eyebrow">Start a conversation</span><h2>Send your RFP or project brief.</h2><p>Share the context, goals, constraints, and files you already have. A senior member of the team will review it directly.</p></div><ContactForm source="Home/Footer" subject="New RFP Request - Home/Footer - dimaso.co"/></div>
      </div>
      <div className="rule" style={{margin:"65px 0 25px"}}/><div className="footer-bottom"><span>© {new Date().getFullYear()} Dimaso. All rights reserved.</span><span>Websites maintained, developed, and improved with care since 2008.</span></div>
    </div>
  </footer>;
}

export function CTA({title="Need a partner who can own the technical detail?",label="Send us your RFP"}:{title?:string,label?:string}) {
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

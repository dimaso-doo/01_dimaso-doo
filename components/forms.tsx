"use client";

import { FormEvent, useState } from "react";

const successText="Thank you. Your request has been received. We will review the details and get back to you shortly.";

export function ContactForm({source,subject}:{source:string;subject:string}) {
  const [status,setStatus]=useState<"idle"|"loading"|"success"|"error">("idle");
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form=e.currentTarget;
    setStatus("loading");
    const data=new FormData(form);
    data.set("source",source);
    data.set("subject",subject);
    data.set("kind","rfp");
    if(typeof window!=="undefined")data.set("pageUrl",window.location.href);
    try{
      const res=await fetch("/api/contact",{method:"POST",body:data});
      setStatus(res.ok?"success":"error");
      if(res.ok)form.reset();
    }catch{
      setStatus("error");
    }
  }
  return <form onSubmit={submit} className="form-grid form-panel" style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12}}>
    <input className="field" required name="name" placeholder="Name *" aria-label="Name"/>
    <input className="field" required type="email" name="email" placeholder="Email *" aria-label="Email"/>
    <input className="field" name="company" placeholder="Company" aria-label="Company"/>
    <select className="field" name="projectType" aria-label="Project type" defaultValue="">
      <option value="" disabled>Project type</option>
      <option>Website maintenance</option>
      <option>Web development</option>
      <option>Web design</option>
      <option>Technical SEO / migration</option>
      <option>Not sure yet</option>
    </select>
    <textarea className="field" required name="message" placeholder="Tell us about the project *" aria-label="Message" rows={5} style={{gridColumn:"1 / -1"}}/>
    <label className="upload-dropzone"><input type="file" name="file" accept=".pdf,.doc,.docx"/><span className="upload-icon">↑</span><span><strong>Click to upload or drag a project brief here</strong><small>PDF, DOC or DOCX · maximum 8MB</small></span></label>
    <input name="website" tabIndex={-1} autoComplete="off" style={{position:"absolute",left:"-9999px"}} aria-hidden="true"/>
    <button className="btn" disabled={status==="loading"} style={{gridColumn:"1 / -1"}}>{status==="loading"?"Sending...":"Send RFP / Project Request"}</button>
    <div aria-live="polite" style={{gridColumn:"1 / -1"}}>
      {status==="success"&&<p style={{color:"var(--green)",margin:0}}>{successText}</p>}
      {status==="error"&&<p style={{color:"#ff8d8d",margin:0}}>We could not send your request. Please check the fields or email us directly at office@dimaso.co.</p>}
    </div>
  </form>;
}

export function Newsletter() {
  const [status,setStatus]=useState<"idle"|"loading"|"success"|"error">("idle");
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form=e.currentTarget;
    setStatus("loading");
    const data=new FormData(form);
    data.set("kind","newsletter");
    data.set("source","Newsletter");
    data.set("subject","New Newsletter Signup - dimaso.co");
    if(typeof window!=="undefined")data.set("pageUrl",window.location.href);
    try{
      const res=await fetch("/api/contact",{method:"POST",body:data});
      setStatus(res.ok?"success":"error");
      if(res.ok)form.reset();
    }catch{
      setStatus("error");
    }
  }
  return <form onSubmit={submit} className="newsletter-form"><label style={{display:"block",fontSize:13,color:"#b7c1b9",marginBottom:10}}>Get practical website support, development, and technical SEO insights.</label><div className="newsletter-row"><span className="newsletter-email-field"><input required type="email" name="email" className="field" placeholder="Email address" aria-label="Email address"/></span><button className="btn newsletter-submit" disabled={status==="loading"}>{status==="loading"?"Sending...":"Subscribe"}</button></div><input name="website" tabIndex={-1} autoComplete="off" style={{position:"absolute",left:"-9999px"}} aria-hidden="true"/><div aria-live="polite">{status==="success"&&<small style={{color:"var(--green)"}}>You are subscribed.</small>}{status==="error"&&<small style={{color:"#ff8d8d"}}>Please try again or email office@dimaso.co.</small>}</div></form>;
}

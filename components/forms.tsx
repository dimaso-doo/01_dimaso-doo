"use client";

import { CSSProperties, ChangeEvent, FormEvent, useEffect, useId, useRef, useState } from "react";
import { trackEvent, trackLead } from "@/lib/ga-events";

const successText="Thank you. Your request has been received. We will review the details and get back to you shortly.";
const services=["Website Maintenance","Web Development","Web Design","WordPress Support","WooCommerce Support","Technical SEO","AI Website & Workflow Support"] as const;
const generalInquiry="General Inquiry / Not Sure Yet" as const;
const serviceOptions=[...services,generalInquiry] as const;
type ServiceOption=(typeof serviceOptions)[number];
type ContactField="email"|"message";
type ContactErrors=Partial<Record<ContactField,string>>;
const allowedFileExtensions=["pdf","doc","docx","txt","zip"];
const maxFileSize=10*1024*1024;
const hiddenLabelStyle:CSSProperties={
  position:"absolute",
  width:1,
  height:1,
  padding:0,
  margin:-1,
  overflow:"hidden",
  clip:"rect(0, 0, 0, 0)",
  whiteSpace:"nowrap",
  border:0,
};

function formatFileSize(size:number){
  if(size>=1024*1024)return `${(size/(1024*1024)).toFixed(size>=10*1024*1024?0:1)} MB`;
  return `${Math.max(1,Math.round(size/1024))} KB`;
}

function validateEmail(value:string){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ContactForm({source,subject,defaultService=""}:{source:string;subject:string;defaultService?:string}) {
  const [status,setStatus]=useState<"idle"|"loading"|"success"|"error">("idle");
  const [formErrors,setFormErrors]=useState<ContactErrors>({});
  const [fileError,setFileError]=useState("");
  const [fileInfo,setFileInfo]=useState<{name:string;size:number;nonce:number}|null>(null);
  const initialService:ServiceOption|""=defaultService&&services.includes(defaultService as (typeof services)[number])?defaultService as ServiceOption:"";
  const [selectedService,setSelectedService]=useState<ServiceOption|"">(initialService);
  const fileInput=useRef<HTMLInputElement>(null);
  const formRef=useRef<HTMLFormElement>(null);
  const formStatusId=useId();
  const nameId=useId();
  const emailId=useId();
  const websiteUrlId=useId();
  const serviceId=useId();
  const messageId=useId();
  const fileId=useId();
  const honeypotId=useId();
  const viewTracked=useRef(false);
  const startTracked=useRef(false);
  const startedAt=useRef<number|null>(null);

  useEffect(()=>{
    const form=formRef.current;
    if(!form||viewTracked.current)return;
    const observer=new IntersectionObserver(([entry])=>{
      if(!entry?.isIntersecting||viewTracked.current)return;
      viewTracked.current=true;
      trackEvent("project_form_view",{form_name:source==="Contact Page"?"contact":"rfp",form_source:source});
      observer.disconnect();
    },{threshold:.35});
    observer.observe(form);
    return()=>observer.disconnect();
  },[source]);

  function clearFormError(field:ContactField){
    setFormErrors(current=>{
      if(!current[field])return current;
      const next={...current};
      delete next[field];
      return next;
    });
  }

  function updateFile(event:ChangeEvent<HTMLInputElement>){
    const file=event.currentTarget.files?.[0];
    setFileError("");
    if(!file){setFileInfo(null);return;}
    const extension=file.name.split(".").pop()?.toLowerCase()||"";
    if(!allowedFileExtensions.includes(extension)){
      event.currentTarget.value="";
      setFileInfo(null);
      setFileError("Please attach a PDF, DOC, DOCX, TXT, or ZIP file.");
      return;
    }
    if(file.size>maxFileSize){
      event.currentTarget.value="";
      setFileInfo(null);
      setFileError("Please attach a file smaller than 10MB.");
      return;
    }
    setFileInfo({name:file.name,size:file.size,nonce:Date.now()});
  }

  function removeFile(){
    if(fileInput.current)fileInput.current.value="";
    setFileInfo(null);
    setFileError("");
  }

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form=e.currentTarget;
    const values=new FormData(form);
    const email=String(values.get("email")||"").trim();
    const message=String(values.get("message")||"").trim();
    const nextErrors:ContactErrors={};
    if(!email)nextErrors.email="Email is required.";
    else if(!validateEmail(email))nextErrors.email="Please enter a valid email address.";
    if(!message)nextErrors.message="Message is required.";
    setFormErrors(nextErrors);
    if(Object.keys(nextErrors).length){
      trackEvent("project_form_validation_error",{form_name:source==="Contact Page"?"contact":"rfp",form_source:source,error_fields:Object.keys(nextErrors).join(",")});
      setStatus("idle");
      const firstField=Object.keys(nextErrors)[0] as ContactField;
      requestAnimationFrame(()=>{
        (form.elements.namedItem(firstField) as HTMLElement|null)?.focus();
      });
      return;
    }
    const completionSeconds=startedAt.current?Math.max(0,Math.round((Date.now()-startedAt.current)/1000)):undefined;
    trackEvent("project_form_submit_attempt",{form_name:source==="Contact Page"?"contact":"rfp",form_source:source,selected_service:selectedService||undefined,file_attached:fileInfo!==null,completion_seconds:completionSeconds});
    setStatus("loading");
    const data=values;
    if(!selectedService)data.delete("services");
    data.set("source",source);
    data.set("subject",subject);
    data.set("kind","rfp");
    if(typeof window!=="undefined")data.set("pageUrl",window.location.href);
    try{
      const res=await fetch("/api/contact",{method:"POST",body:data});
      setStatus(res.ok?"success":"error");
      if(res.ok){
        if(source==="Contact Page"){
          trackEvent("contact_form_submit",{form_name:"contact",completion_seconds:completionSeconds});
          trackLead("contact",{completion_seconds:completionSeconds});
        }else{
          const leadParams={selected_service:selectedService||undefined,file_attached:fileInfo!==null,completion_seconds:completionSeconds};
          trackEvent("rfp_form_submit",{form_name:"rfp",...leadParams});
          trackLead("rfp",leadParams);
        }
        form.reset();setSelectedService(initialService);setFileInfo(null);setFileError("");setFormErrors({});
      }else{
        trackEvent("project_form_submit_error",{form_name:source==="Contact Page"?"contact":"rfp",form_source:source,error_type:"api_response",http_status:res.status});
      }
    }catch{
      setStatus("error");
      trackEvent("project_form_submit_error",{form_name:source==="Contact Page"?"contact":"rfp",form_source:source,error_type:"network_error"});
    }
  }
  const hasFormErrors=Object.keys(formErrors).length>0;
  const formErrorMessage=formErrors.email==="Please enter a valid email address."?"Please complete the highlighted fields and enter a valid email address.":"Please complete the highlighted required fields.";
  return <form ref={formRef} action="/api/contact" method="post" encType="multipart/form-data" onSubmit={submit} onFocusCapture={()=>{if(startTracked.current)return;startTracked.current=true;startedAt.current=Date.now();trackEvent("project_form_start",{form_name:source==="Contact Page"?"contact":"rfp",form_source:source});}} noValidate className="form-grid form-panel" style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12}}>
    <div className="form-field">
      <label htmlFor={emailId}>Email <span>Required</span></label>
      <input id={emailId} className="field" required type="email" name="email" placeholder="you@company.com" aria-invalid={formErrors.email?true:undefined} aria-describedby={formErrors.email?formStatusId:undefined} onChange={()=>clearFormError("email")}/>
    </div>
    <div className="form-field">
      <label htmlFor={websiteUrlId}>Current website <span>Optional</span></label>
      <input id={websiteUrlId} className="field" type="text" inputMode="url" name="websiteUrl" placeholder="https://example.com"/>
    </div>
    <div className="form-field">
      <label htmlFor={nameId}>Name <span>Optional</span></label>
      <input id={nameId} className="field" name="name" placeholder="Your name"/>
    </div>
    <div className="form-field">
      <label htmlFor={serviceId}>Main area of help <span>Optional</span></label>
      <div className="select-field">
        <select id={serviceId} className="field" name="services" value={selectedService} onChange={event=>setSelectedService(event.target.value as ServiceOption|"")}>
          <option value="">Choose one if helpful</option>
          {serviceOptions.map(service=><option key={service} value={service}>{service}</option>)}
        </select>
        <span aria-hidden="true">⌄</span>
      </div>
    </div>
    <div className="form-field form-field-wide">
      <label htmlFor={messageId}>Main website priority <span>Required</span></label>
      <textarea id={messageId} className="field" required name="message" placeholder="What is the main risk, backlog, or result you need help with?" aria-invalid={formErrors.message?true:undefined} aria-describedby={formErrors.message?formStatusId:undefined} onChange={()=>clearFormError("message")} rows={3}/>
    </div>
    <div className="upload-field">
      <label htmlFor={fileId} className={`upload-dropzone ${fileInfo?"has-file":""} ${fileError?"has-error":""}`}><input id={fileId} ref={fileInput} type="file" name="file" accept=".pdf,.doc,.docx,.txt,.zip" aria-invalid={fileError?true:undefined} aria-describedby={fileError?formStatusId:undefined} onChange={updateFile}/><span className="upload-icon">{fileInfo?"✓":"↑"}</span><span><strong>{fileInfo?"Change attached file":"Attach a project brief (optional)"}</strong><small>PDF, DOC, DOCX, TXT or ZIP · up to 10MB</small></span></label>
      {fileInfo&&<div key={fileInfo.nonce} className="upload-confirmation"><span><strong>File attached:</strong> {fileInfo.name}</span><small>{formatFileSize(fileInfo.size)}</small><button type="button" onClick={removeFile}>Remove</button></div>}
    </div>
    <label htmlFor={honeypotId} style={hiddenLabelStyle} aria-hidden="true">Website</label>
    <input id={honeypotId} name="website" tabIndex={-1} autoComplete="off" style={{position:"absolute",left:"-9999px"}} aria-hidden="true"/>
    <div id={formStatusId} className={`form-status ${hasFormErrors||fileError||status==="error"?"is-error":status==="success"?"is-success":""}`} role={hasFormErrors||fileError||status==="error"?"alert":"status"} aria-live={hasFormErrors||fileError||status==="error"?"assertive":"polite"}>
      {hasFormErrors&&<small>{formErrorMessage}</small>}
      {!hasFormErrors&&fileError&&<small>{fileError}</small>}
      {!hasFormErrors&&!fileError&&status==="success"&&<small>{successText}</small>}
      {!hasFormErrors&&!fileError&&status==="error"&&<small>We could not send your request. Please check the fields or email us directly at office@dimaso.co.</small>}
    </div>
    <button className="btn" disabled={status==="loading"} style={{gridColumn:"1 / -1"}}>{status==="loading"?"Sending...":"Request a senior website review"}</button>
  </form>;
}

export function Newsletter() {
  const [status,setStatus]=useState<"idle"|"loading"|"success"|"error">("idle");
  const [emailError,setEmailError]=useState("");
  const statusId=useId();
  const emailId=useId();
  const honeypotId=useId();
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form=e.currentTarget;
    const email=String(new FormData(form).get("email")||"").trim();
    const nextEmailError=!email?"Email is required.":!validateEmail(email)?"Please enter a valid email address.":"";
    setEmailError(nextEmailError);
    if(nextEmailError){setStatus("idle");return;}
    setStatus("loading");
    const data=new FormData(form);
    data.set("kind","newsletter");
    data.set("source","Newsletter");
    data.set("subject","New Newsletter Signup - dimaso.co");
    if(typeof window!=="undefined")data.set("pageUrl",window.location.href);
    try{
      const res=await fetch("/api/contact",{method:"POST",body:data});
      setStatus(res.ok?"success":"error");
      if(res.ok){
        trackEvent("newsletter_subscribe",{form_name:"newsletter"});
        trackLead("newsletter");
        form.reset();setEmailError("");
      }
    }catch{
      setStatus("error");
    }
  }
  return <form action="/api/contact" method="post" onSubmit={submit} noValidate className="newsletter-form"><label htmlFor={emailId} style={{display:"block",fontSize:13,color:"#b7c1b9",marginBottom:10}}>Get practical website support, development, and technical SEO insights.</label><div className="newsletter-row"><span className="newsletter-email-field"><input id={emailId} required type="email" name="email" className="field" placeholder="Email address" aria-label="Email address" aria-invalid={emailError?true:undefined} aria-describedby={emailError?statusId:undefined} onChange={()=>emailError&&setEmailError("")}/></span><button className="btn newsletter-submit" disabled={status==="loading"}>{status==="loading"?"Sending...":"Subscribe"}</button></div><label htmlFor={honeypotId} style={hiddenLabelStyle} aria-hidden="true">Website</label><input id={honeypotId} name="website" tabIndex={-1} autoComplete="off" style={{position:"absolute",left:"-9999px"}} aria-hidden="true"/><div id={statusId} className={`form-status newsletter-status ${emailError||status==="error"?"is-error":status==="success"?"is-success":""}`} role={emailError||status==="error"?"alert":"status"} aria-live={emailError||status==="error"?"assertive":"polite"}>{emailError&&<small>{emailError==="Email is required."?"Enter your email address to subscribe.":"Enter a valid email address to subscribe."}</small>}{!emailError&&status==="success"&&<small>You are subscribed.</small>}{!emailError&&status==="error"&&<small>Please try again or email office@dimaso.co.</small>}</div></form>;
}

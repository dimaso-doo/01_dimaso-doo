"use client";

import { ChangeEvent, FormEvent, KeyboardEvent as ReactKeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { trackEvent, trackLead } from "@/lib/ga-events";

const successText="Thank you. Your request has been received. We will review the details and get back to you shortly.";
const services=["Website Maintenance","Web Development","Web Design"] as const;
const generalInquiry="General Inquiry / Not Sure Yet" as const;
const serviceOptions=[...services,generalInquiry] as const;
type ServiceOption=(typeof serviceOptions)[number];
const allowedFileExtensions=["pdf","doc","docx","txt","zip"];
const maxFileSize=10*1024*1024;

function formatFileSize(size:number){
  if(size>=1024*1024)return `${(size/(1024*1024)).toFixed(size>=10*1024*1024?0:1)} MB`;
  return `${Math.max(1,Math.round(size/1024))} KB`;
}

function validateEmail(value:string){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ContactForm({source,subject,defaultService=""}:{source:string;subject:string;defaultService?:string}) {
  const [status,setStatus]=useState<"idle"|"loading"|"success"|"error">("idle");
  const [emailError,setEmailError]=useState("");
  const [serviceError,setServiceError]=useState("");
  const [fileError,setFileError]=useState("");
  const [fileInfo,setFileInfo]=useState<{name:string;size:number;nonce:number}|null>(null);
  const [selectedServices,setSelectedServices]=useState<ServiceOption[]>(defaultService&&services.includes(defaultService as (typeof services)[number])?[defaultService as ServiceOption]:[]);
  const [servicesOpen,setServicesOpen]=useState(false);
  const fileInput=useRef<HTMLInputElement>(null);
  const servicesField=useRef<HTMLDivElement>(null);
  const servicesPanel=useRef<HTMLDivElement>(null);
  const servicesId=useId();

  useEffect(()=>{
    if(!servicesOpen)return;
    const closeOnOutsideClick=(event:PointerEvent)=>{
      if(!servicesField.current?.contains(event.target as Node))setServicesOpen(false);
    };
    document.addEventListener("pointerdown",closeOnOutsideClick);
    return()=>document.removeEventListener("pointerdown",closeOnOutsideClick);
  },[servicesOpen]);

  function serviceSummary(){
    if(!selectedServices.length)return "Services *";
    if(selectedServices[0]===generalInquiry)return "General Inquiry";
    if(selectedServices.length<=2)return selectedServices.join(" + ");
    return `${selectedServices.length} services selected`;
  }

  function toggleService(service:ServiceOption){
    setSelectedServices(current=>{
      if(service===generalInquiry)return current.includes(generalInquiry)?[]:[generalInquiry];
      const concrete=current.filter(item=>item!==generalInquiry);
      return concrete.includes(service)?concrete.filter(item=>item!==service):[...concrete,service];
    });
    setServiceError("");
  }

  function handleServicesKeyDown(event:ReactKeyboardEvent){
    if(event.key==="Escape"){
      setServicesOpen(false);
      (servicesField.current?.querySelector("button") as HTMLButtonElement|null)?.focus();
    }
  }

  function openServicesWithKeyboard(event:ReactKeyboardEvent<HTMLButtonElement>){
    if(event.key!=="ArrowDown")return;
    event.preventDefault();
    setServicesOpen(true);
    requestAnimationFrame(()=>servicesPanel.current?.querySelector<HTMLInputElement>("input")?.focus());
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
    const email=String(new FormData(form).get("email")||"").trim();
    const nextEmailError=!email?"Email is required.":!validateEmail(email)?"Please enter a valid email address.":"";
    const nextServiceError=!selectedServices.length?"Please select at least one service.":"";
    setEmailError(nextEmailError);
    setServiceError(nextServiceError);
    if(nextEmailError||nextServiceError){setStatus("idle");return;}
    if(!form.reportValidity())return;
    setStatus("loading");
    const data=new FormData(form);
    data.set("source",source);
    data.set("subject",subject);
    data.set("kind","rfp");
    if(typeof window!=="undefined")data.set("pageUrl",window.location.href);
    try{
      const res=await fetch("/api/contact",{method:"POST",body:data});
      setStatus(res.ok?"success":"error");
      if(res.ok){
        if(source==="Contact Page"){
          trackEvent("contact_form_submit",{form_name:"contact"});
          trackLead("contact");
        }else{
          const leadParams={selected_service:selectedServices.length?selectedServices.join(", "):undefined,file_attached:fileInfo!==null};
          trackEvent("rfp_form_submit",{form_name:"rfp",...leadParams});
          trackLead("rfp",leadParams);
        }
        form.reset();setSelectedServices(defaultService?[defaultService as ServiceOption]:[]);setFileInfo(null);setFileError("");setEmailError("");setServiceError("");
      }
    }catch{
      setStatus("error");
    }
  }
  return <form onSubmit={submit} noValidate className="form-grid form-panel" style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12}}>
    <input className="field" required name="name" placeholder="Name *" aria-label="Name"/>
    <div className="field-wrap"><input className="field" required type="email" name="email" placeholder="Email *" aria-label="Email" aria-invalid={emailError?true:undefined} onChange={()=>emailError&&setEmailError("")}/>{emailError&&<small className="form-error">{emailError}</small>}</div>
    <input className="field" name="company" placeholder="Company" aria-label="Company"/>
    <div ref={servicesField} className={`services-field ${servicesOpen?"is-open":""}`} onKeyDown={handleServicesKeyDown}>
      <button type="button" className="field services-trigger" aria-label={`Services: ${serviceSummary()}`} aria-haspopup="true" aria-expanded={servicesOpen} aria-controls={servicesId} aria-invalid={serviceError?true:undefined} onClick={()=>setServicesOpen(open=>!open)} onKeyDown={openServicesWithKeyboard}>
        <span>{serviceSummary()}</span><span className="services-arrow" aria-hidden="true">⌄</span>
      </button>
      <div ref={servicesPanel} id={servicesId} className="services-panel" role="group" aria-label="Select one or more services" hidden={!servicesOpen} onPointerDown={event=>event.stopPropagation()}>
        {serviceOptions.map(service=><label key={service} className={`service-option ${service===generalInquiry?"is-general":""}`}>
          <input type="checkbox" name="services" value={service} checked={selectedServices.includes(service)} onChange={()=>toggleService(service)}/><span>{service}</span>
        </label>)}
      </div>
      {serviceError&&<small className="form-error">{serviceError}</small>}
    </div>
    <textarea className="field" required name="message" placeholder="Tell us about the project *" aria-label="Message" rows={5} style={{gridColumn:"1 / -1"}}/>
    <div className="upload-field">
      <label className={`upload-dropzone ${fileInfo?"has-file":""}`}><input ref={fileInput} type="file" name="file" accept=".pdf,.doc,.docx,.txt,.zip" onChange={updateFile}/><span className="upload-icon">{fileInfo?"✓":"↑"}</span><span><strong>{fileInfo?"Change attached file":"Click to upload or drag a project brief here"}</strong><small>{fileInfo?"PDF, DOC, DOCX, TXT or ZIP · maximum 10MB":"PDF, DOC, DOCX, TXT or ZIP · maximum 10MB"}</small></span></label>
      {fileInfo&&<div key={fileInfo.nonce} className="upload-confirmation"><span><strong>File attached:</strong> {fileInfo.name}</span><small>{formatFileSize(fileInfo.size)}</small><button type="button" onClick={removeFile}>Remove</button></div>}
      {fileError&&<small className="form-error">{fileError}</small>}
    </div>
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
  const [emailError,setEmailError]=useState("");
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form=e.currentTarget;
    const email=String(new FormData(form).get("email")||"").trim();
    const nextEmailError=!email?"Email is required.":!validateEmail(email)?"Please enter a valid email address.":"";
    setEmailError(nextEmailError);
    if(nextEmailError){setStatus("idle");return;}
    if(!form.reportValidity())return;
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
  return <form onSubmit={submit} noValidate className="newsletter-form"><label style={{display:"block",fontSize:13,color:"#b7c1b9",marginBottom:10}}>Get practical website support, development, and technical SEO insights.</label><div className="newsletter-row"><span className="newsletter-email-field"><input required type="email" name="email" className="field" placeholder="Email address" aria-label="Email address" aria-invalid={emailError?true:undefined} onChange={()=>emailError&&setEmailError("")}/>{emailError&&<small className="form-error">{emailError}</small>}</span><button className="btn newsletter-submit" disabled={status==="loading"}>{status==="loading"?"Sending...":"Subscribe"}</button></div><input name="website" tabIndex={-1} autoComplete="off" style={{position:"absolute",left:"-9999px"}} aria-hidden="true"/><div aria-live="polite">{status==="success"&&<small style={{color:"var(--green)"}}>You are subscribed.</small>}{status==="error"&&<small style={{color:"#ff8d8d"}}>Please try again or email office@dimaso.co.</small>}</div></form>;
}

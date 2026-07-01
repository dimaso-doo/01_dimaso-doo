"use client";

import { CSSProperties, ChangeEvent, FormEvent, KeyboardEvent as ReactKeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { trackEvent, trackLead } from "@/lib/ga-events";

const successText="Thank you. Your request has been received. We will review the details and get back to you shortly.";
const services=["Website Maintenance","Web Development","Web Design"] as const;
const generalInquiry="General Inquiry / Not Sure Yet" as const;
const serviceOptions=[...services,generalInquiry] as const;
type ServiceOption=(typeof serviceOptions)[number];
type ContactField="name"|"email"|"services"|"message";
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
  const [selectedServices,setSelectedServices]=useState<ServiceOption[]>(defaultService&&services.includes(defaultService as (typeof services)[number])?[defaultService as ServiceOption]:[]);
  const [servicesOpen,setServicesOpen]=useState(false);
  const fileInput=useRef<HTMLInputElement>(null);
  const servicesField=useRef<HTMLDivElement>(null);
  const servicesPanel=useRef<HTMLDivElement>(null);
  const servicesId=useId();
  const formStatusId=useId();
  const nameId=useId();
  const emailId=useId();
  const companyId=useId();
  const servicesLabelId=useId();
  const messageId=useId();
  const fileId=useId();
  const honeypotId=useId();

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
    clearFormError("services");
  }

  function clearFormError(field:ContactField){
    setFormErrors(current=>{
      if(!current[field])return current;
      const next={...current};
      delete next[field];
      return next;
    });
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
    const values=new FormData(form);
    const name=String(values.get("name")||"").trim();
    const email=String(values.get("email")||"").trim();
    const message=String(values.get("message")||"").trim();
    const nextErrors:ContactErrors={};
    if(!name)nextErrors.name="Name is required.";
    if(!email)nextErrors.email="Email is required.";
    else if(!validateEmail(email))nextErrors.email="Please enter a valid email address.";
    if(!selectedServices.length)nextErrors.services="Please select at least one service.";
    if(!message)nextErrors.message="Message is required.";
    setFormErrors(nextErrors);
    if(Object.keys(nextErrors).length){
      setStatus("idle");
      const firstField=Object.keys(nextErrors)[0] as ContactField;
      requestAnimationFrame(()=>{
        if(firstField==="services")servicesField.current?.querySelector<HTMLButtonElement>("button")?.focus();
        else (form.elements.namedItem(firstField) as HTMLElement|null)?.focus();
      });
      return;
    }
    setStatus("loading");
    const data=values;
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
        form.reset();setSelectedServices(defaultService?[defaultService as ServiceOption]:[]);setFileInfo(null);setFileError("");setFormErrors({});
      }
    }catch{
      setStatus("error");
    }
  }
  const hasFormErrors=Object.keys(formErrors).length>0;
  const formErrorMessage=formErrors.email==="Please enter a valid email address."?"Please complete the highlighted fields and enter a valid email address.":"Please complete the highlighted required fields.";
  return <form action="/api/contact" method="post" encType="multipart/form-data" onSubmit={submit} noValidate className="form-grid form-panel" style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12}}>
    <label htmlFor={nameId} style={hiddenLabelStyle}>Name</label>
    <input id={nameId} className="field" required name="name" placeholder="Name *" aria-label="Name" aria-invalid={formErrors.name?true:undefined} aria-describedby={formErrors.name?formStatusId:undefined} onChange={()=>clearFormError("name")}/>
    <div className="field-wrap"><label htmlFor={emailId} style={hiddenLabelStyle}>Email</label><input id={emailId} className="field" required type="email" name="email" placeholder="Email *" aria-label="Email" aria-invalid={formErrors.email?true:undefined} aria-describedby={formErrors.email?formStatusId:undefined} onChange={()=>clearFormError("email")}/></div>
    <label htmlFor={companyId} style={hiddenLabelStyle}>Company</label>
    <input id={companyId} className="field" name="company" placeholder="Company" aria-label="Company"/>
    <div ref={servicesField} className={`services-field ${servicesOpen?"is-open":""}`} onKeyDown={handleServicesKeyDown}>
      <span id={servicesLabelId} style={hiddenLabelStyle}>Services</span>
      <button type="button" className="field services-trigger" aria-label={`Services: ${serviceSummary()}`} aria-labelledby={servicesLabelId} aria-haspopup="true" aria-expanded={servicesOpen} aria-controls={servicesId} aria-invalid={formErrors.services?true:undefined} aria-describedby={formErrors.services?formStatusId:undefined} onClick={()=>setServicesOpen(open=>!open)} onKeyDown={openServicesWithKeyboard}>
        <span>{serviceSummary()}</span><span className="services-arrow" aria-hidden="true">⌄</span>
      </button>
      <div ref={servicesPanel} id={servicesId} className="services-panel" role="group" aria-label="Select one or more services" hidden={!servicesOpen} onPointerDown={event=>event.stopPropagation()}>
        {serviceOptions.map(service=><label key={service} className={`service-option ${service===generalInquiry?"is-general":""}`}>
          <input type="checkbox" name="services" value={service} checked={selectedServices.includes(service)} onChange={()=>toggleService(service)}/><span>{service}</span>
        </label>)}
      </div>
    </div>
    <label htmlFor={messageId} style={hiddenLabelStyle}>Project message</label>
    <textarea id={messageId} className="field" required name="message" placeholder="Tell us about the project *" aria-label="Message" aria-invalid={formErrors.message?true:undefined} aria-describedby={formErrors.message?formStatusId:undefined} onChange={()=>clearFormError("message")} rows={5} style={{gridColumn:"1 / -1"}}/>
    <div className="upload-field">
      <label htmlFor={fileId} className={`upload-dropzone ${fileInfo?"has-file":""} ${fileError?"has-error":""}`}><input id={fileId} ref={fileInput} type="file" name="file" accept=".pdf,.doc,.docx,.txt,.zip" aria-invalid={fileError?true:undefined} aria-describedby={fileError?formStatusId:undefined} onChange={updateFile}/><span className="upload-icon">{fileInfo?"✓":"↑"}</span><span><strong>{fileInfo?"Change attached file":"Optional: upload a project brief"}</strong><small>{fileInfo?"PDF, DOC, DOCX, TXT or ZIP · maximum 10MB":"PDF, DOC, DOCX, TXT or ZIP · maximum 10MB"}</small></span></label>
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
    <button className="btn" disabled={status==="loading"} style={{gridColumn:"1 / -1"}}>{status==="loading"?"Sending...":"Send project request"}</button>
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

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

export const runtime="nodejs";
const serviceSchema=z.enum(["Website Maintenance","Web Development","Web Design","General Inquiry / Not Sure Yet"]);
const schema=z.object({email:z.string().trim().email(),name:z.string().max(120).optional(),company:z.string().max(160).optional(),services:z.array(serviceSchema).max(3).optional(),message:z.string().max(10000).optional(),source:z.string().min(2).max(120),subject:z.string().min(6).max(180),kind:z.enum(["rfp","newsletter"]),pageUrl:z.string().max(500).optional()});
const allowedExtensions=new Set(["pdf","doc","docx","txt","zip"]);
const maxUploadSize=10*1024*1024;

function formatUploadSize(size:number){
  if(size>=1024*1024)return `${(size/(1024*1024)).toFixed(size>=10*1024*1024?0:1)} MB`;
  return `${Math.max(1,Math.round(size/1024))} KB`;
}

function internalSubject(kind:"rfp"|"newsletter",source:string){
  if(kind==="newsletter")return "New Newsletter Signup - dimaso.co";
  if(source==="Website Maintenance")return "New RFP Request - Website Maintenance - dimaso.co";
  if(source==="Web Development")return "New RFP Request - Web Development - dimaso.co";
  if(source==="Web Design")return "New RFP Request - Web Design - dimaso.co";
  if(source==="Contact Page")return "New Contact / RFP Request - Contact Page - dimaso.co";
  return "New RFP Request - Home/Footer - dimaso.co";
}

function autoReplySubject(kind:"rfp"|"newsletter",source:string){
  if(kind==="newsletter")return "Subscription received - Dimaso";
  if(source==="Contact Page")return "Thank you for contacting Dimaso";
  return "We received your project request - Dimaso";
}

function autoReplyText(name:string|undefined,services:string[]|undefined){
  return [
    `Hi ${name?.trim()||"there"},`,
    "",
    "Thank you for contacting Dimaso.",
    "",
    "We received your message and will review it shortly. If your request includes an RFP, project brief, website issue, or support question, we will get back to you as soon as possible.",
    "",
    "Selected services:",
    ...(services?.length?services.map(service=>`- ${service}`):["-"]),
    "",
    "Best regards,",
    "Dimaso",
    "",
    "Website Maintenance | Web Development | Web Design",
    "office@dimaso.co",
    "+381 61 137 5150",
    "https://dimaso.co",
  ].join("\n");
}

export async function POST(req:Request){
 try{
  const form=await req.formData(); if(form.get("website"))return NextResponse.json({ok:true});
  const fields=Object.fromEntries([...form.entries()].filter(([k,v])=>k!=="file"&&k!=="services"&&typeof v==="string"));
  const submittedServices=form.getAll("services").filter((value):value is string=>typeof value==="string");
  const parsed=schema.safeParse({...fields,services:submittedServices});
  if(!parsed.success)return NextResponse.json({error:"Invalid form data"},{status:400});
  if(parsed.data.kind==="rfp"&&(!parsed.data.name||!parsed.data.message||!parsed.data.services?.length))return NextResponse.json({error:"Missing required fields"},{status:400});
  if(parsed.data.services?.includes("General Inquiry / Not Sure Yet")&&parsed.data.services.length>1)return NextResponse.json({error:"Invalid service selection"},{status:400});
  const file=form.get("file"); let attachment; let uploadName="-";
  if(file instanceof File&&file.size>0){
   const extension=file.name.split(".").pop()?.toLowerCase()||"";
   if(file.size>maxUploadSize||!allowedExtensions.has(extension))return NextResponse.json({error:"Invalid upload"},{status:400});
   attachment={filename:file.name,content:Buffer.from(await file.arrayBuffer())};
   uploadName=`${file.name} (${formatUploadSize(file.size)})`;
  }
  if(!process.env.SMTP_HOST||!process.env.SMTP_USER||!process.env.SMTP_PASS)return NextResponse.json({error:"Unable to send"},{status:503});
  const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:Number(process.env.SMTP_PORT)===465,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});
  const d=parsed.data; const from=process.env.SMTP_FROM||process.env.SMTP_USER; const selectedServices=d.services?.length?d.services.map(service=>`- ${service}`).join("\n"):"-"; const text=[`Source page: ${d.source}`,`Page URL: ${d.pageUrl||"-"}`,`Date/time: ${new Date().toISOString()}`,`Name: ${d.name||"-"}`,`Email: ${d.email}`,`Company: ${d.company||"-"}`,`Services:\n${selectedServices}`,`Upload: ${uploadName}`,`Message: ${d.message||"-"}`].join("\n");
  await transport.sendMail({from,to:process.env.CONTACT_TO_EMAIL||process.env.RFP_TO_EMAIL||"office@dimaso.co",replyTo:d.email,subject:internalSubject(d.kind,d.source),text,attachments:attachment?[attachment]:[]});
  await transport.sendMail({from,to:d.email,subject:autoReplySubject(d.kind,d.source),text:autoReplyText(d.name,d.services)});
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:"Unable to send"},{status:500})}
}

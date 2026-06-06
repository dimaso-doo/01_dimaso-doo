import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

export const runtime="nodejs";
const schema=z.object({email:z.string().email(),name:z.string().max(120).optional(),company:z.string().max(160).optional(),projectType:z.string().max(160).optional(),message:z.string().max(10000).optional(),source:z.string().min(2).max(120),subject:z.string().min(6).max(180),kind:z.enum(["rfp","newsletter"]),pageUrl:z.string().max(500).optional()});
const allowed=new Set(["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"]);
export async function POST(req:Request){
 try{
  const form=await req.formData(); if(form.get("website"))return NextResponse.json({ok:true});
  const parsed=schema.safeParse(Object.fromEntries([...form.entries()].filter(([k,v])=>k!=="file"&&typeof v==="string")));
  if(!parsed.success)return NextResponse.json({error:"Invalid form data"},{status:400});
  if(parsed.data.kind==="rfp"&&(!parsed.data.name||!parsed.data.message))return NextResponse.json({error:"Missing required fields"},{status:400});
  const file=form.get("file"); let attachment; let uploadName="-";
  if(file instanceof File&&file.size>0){if(file.size>8*1024*1024||!allowed.has(file.type))return NextResponse.json({error:"Invalid upload"},{status:400});attachment={filename:file.name,content:Buffer.from(await file.arrayBuffer())};}
  if(file instanceof File&&file.size>0)uploadName=`${file.name} (${Math.round(file.size/1024)} KB)`;
  if(!process.env.SMTP_HOST||!process.env.SMTP_USER||!process.env.SMTP_PASS)return NextResponse.json({error:"Email service is not configured"},{status:503});
  const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:Number(process.env.SMTP_PORT)===465,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});
  const d=parsed.data; const text=[`Source page: ${d.source}`,`Page URL: ${d.pageUrl||"-"}`,`Date/time: ${new Date().toISOString()}`,`Name: ${d.name||"-"}`,`Email: ${d.email}`,`Company: ${d.company||"-"}`,`Project type: ${d.projectType||"-"}`,`Upload: ${uploadName}`,`Message: ${d.message||"-"}`].join("\n");
  await transport.sendMail({from:process.env.SMTP_FROM||process.env.SMTP_USER,to:process.env.CONTACT_TO_EMAIL||process.env.RFP_TO_EMAIL||"office@dimaso.co",replyTo:d.email,subject:d.subject,text,attachments:attachment?[attachment]:[]});
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:"Unable to send"},{status:500})}
}

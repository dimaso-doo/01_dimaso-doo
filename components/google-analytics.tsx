"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "@/lib/ga-events";

const measurementId="G-1DW9FWSVL5";

export function GoogleAnalytics(){
  const pathname=usePathname();
  const [ready,setReady]=useState(false);
  const lastTrackedPath=useRef<string | null>(null);

  useEffect(()=>{
    if(!ready||typeof window.gtag!=="function"||lastTrackedPath.current===pathname)return;
    window.gtag("event","page_view",{
      page_path:pathname,
      page_location:window.location.href,
      page_title:document.title,
    });
    lastTrackedPath.current=pathname;
  },[pathname,ready]);

  return <>
    <Script id="google-analytics-init" strategy="afterInteractive">
      {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${measurementId}',{send_page_view:false});`}
    </Script>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="lazyOnload" onLoad={()=>setReady(true)}/>
  </>;
}

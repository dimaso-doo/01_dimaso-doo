"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const measurementId="G-1DW9FWSVL5";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[])=>void;
  }
}

export function GoogleAnalytics(){
  const pathname=usePathname();
  const [ready,setReady]=useState(false);

  useEffect(()=>{
    if(!ready||typeof window.gtag!=="function")return;
    window.gtag("event","page_view",{
      page_path:pathname,
      page_location:window.location.href,
      page_title:document.title,
    });
  },[pathname,ready]);

  return <>
    <Script id="google-analytics-init" strategy="afterInteractive">
      {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${measurementId}',{send_page_view:false});`}
    </Script>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" onLoad={()=>setReady(true)}/>
  </>;
}

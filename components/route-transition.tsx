"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function RouteTransition({children}:{children:React.ReactNode}) {
  const pathname=usePathname();
  const [navigating,setNavigating]=useState(false);

  useEffect(()=>{
    const startNavigation=(event:MouseEvent)=>{
      if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const target=event.target;
      if(!(target instanceof Element))return;
      const link=target.closest("a");
      if(!link||link.target==="_blank"||link.hasAttribute("download"))return;
      const url=new URL(link.href,window.location.href);
      if(url.origin!==window.location.origin||url.pathname===window.location.pathname&&url.search===window.location.search)return;
      setNavigating(true);
    };
    document.addEventListener("click",startNavigation,{capture:true});
    return()=>document.removeEventListener("click",startNavigation,{capture:true});
  },[]);

  useEffect(()=>{
    window.scrollTo({top:0,behavior:"instant"});
    setNavigating(false);
  },[pathname]);

  return <>
    <div className={`route-transition-bar ${navigating?"is-navigating":""}`} aria-hidden="true"/>
    <div key={pathname} className="route-transition-page">
      {children}
    </div>
  </>;
}

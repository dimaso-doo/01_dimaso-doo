"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function RouteTransition({children}:{children:React.ReactNode}) {
  const pathname=usePathname();
  const reduceMotion=useReducedMotion();
  const [navigating,setNavigating]=useState(false);
  const [hydrated,setHydrated]=useState(false);

  useEffect(()=>setHydrated(true),[]);

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
    <motion.div className="route-transition-bar" initial={false} animate={reduceMotion?{opacity:0}:{scaleX:navigating ? .72 : 1,opacity:navigating ? .58 : 0}} transition={navigating?{duration:.45,ease:[.2,.8,.2,1]}:{duration:.16,ease:"easeOut"}}/>
    <motion.div key={pathname} className="route-transition-page" initial={hydrated&&!reduceMotion?{opacity:.76,y:4}:false} animate={{opacity:1,y:0}} transition={{duration:reduceMotion?0:.16,ease:[.2,.8,.2,1]}}>
      {children}
    </motion.div>
  </>;
}

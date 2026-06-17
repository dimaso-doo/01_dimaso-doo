"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function RouteTransition({children}:{children:React.ReactNode}) {
  const pathname=usePathname();
  useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[pathname]);
  return <>
    <motion.div key={`bar-${pathname}`} className="route-transition-bar" initial={{scaleX:0,opacity:.9}} animate={{scaleX:1,opacity:0}} transition={{duration:.42,ease:[.2,.8,.2,1]}}/>
    <AnimatePresence mode="wait">
      <motion.div key={pathname} className="route-transition-page" initial={{opacity:0,y:10,filter:"blur(4px)"}} animate={{opacity:1,y:0,filter:"blur(0px)"}} exit={{opacity:0,y:-6,filter:"blur(3px)"}} transition={{duration:.24,ease:[.2,.8,.2,1]}}>
        {children}
      </motion.div>
    </AnimatePresence>
  </>;
}

"use client";

import { AnchorHTMLAttributes, MouseEvent } from "react";
import { trackEvent } from "@/lib/ga-events";

type TrackedLinkProps=AnchorHTMLAttributes<HTMLAnchorElement>&{
  tracking:"email"|"linkedin";
  trackingLocation?:string;
};

export function TrackedLink({tracking,trackingLocation,onClick,...props}:TrackedLinkProps){
  function handleClick(event:MouseEvent<HTMLAnchorElement>){
    if(tracking==="email")trackEvent("email_click",{email:"office@dimaso.co",location:trackingLocation});
    else trackEvent("linkedin_click",{location:trackingLocation});
    onClick?.(event);
  }

  return <a {...props} onClick={handleClick}/>;
}


"use client";

import { AnchorHTMLAttributes, MouseEvent } from "react";
import { trackEvent } from "@/lib/ga-events";

type TrackedLinkProps=AnchorHTMLAttributes<HTMLAnchorElement>&{
  tracking:"email"|"phone"|"linkedin"|"cta";
  trackingLocation?:string;
  trackingLabel?:string;
};

export function TrackedLink({tracking,trackingLocation,trackingLabel,onClick,...props}:TrackedLinkProps){
  function handleClick(event:MouseEvent<HTMLAnchorElement>){
    if(tracking==="email")trackEvent("email_click",{email:"office@dimaso.co",location:trackingLocation});
    else if(tracking==="phone")trackEvent("phone_click",{phone:"+381611375150",location:trackingLocation});
    else if(tracking==="linkedin")trackEvent("linkedin_click",{location:trackingLocation});
    else trackEvent("cta_click",{cta_label:trackingLabel,cta_destination:typeof props.href==="string"?props.href:undefined,location:trackingLocation});
    onClick?.(event);
  }

  return <a {...props} onClick={handleClick}/>;
}

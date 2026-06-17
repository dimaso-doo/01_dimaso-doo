export type GAEventParams=Record<string,string|number|boolean|undefined>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[])=>void;
  }
}

function currentPagePath(){
  return typeof window==="undefined"?"":window.location.pathname;
}

export function trackEvent(eventName:string,params:GAEventParams={}){
  if(typeof window==="undefined"||typeof window.gtag!=="function")return;
  try{
    const cleanParams=Object.fromEntries(Object.entries({page_path:currentPagePath(),...params}).filter(([,value])=>value!==undefined));
    window.gtag("event",eventName,cleanParams);
  }catch{
    // Analytics must never interrupt the user action when GA is blocked or unavailable.
  }
}

export function trackLead(formName:string,params:GAEventParams={}){
  trackEvent("generate_lead",{
    ...params,
    form_name:formName,
    lead_source:"website",
    page_path:currentPagePath(),
  });
}


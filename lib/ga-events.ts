export type GAEventParams=Record<string,string|number|boolean|undefined>;

type AcquisitionContext={
  traffic_channel:"llm"|"organic_search"|"campaign"|"referral"|"direct";
  referral_source:string;
  traffic_medium:string;
  campaign_name:string;
  landing_page:string;
};

const acquisitionStorageKey="dimaso_acquisition_context";
const llmSourceTokens=["chatgpt","openai","perplexity","copilot","gemini","claude","poe"];
const searchSourceTokens=["google","bing","duckduckgo","yahoo","baidu","yandex"];

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[])=>void;
  }
}

function currentPagePath(){
  return typeof window==="undefined"?"":window.location.pathname;
}

function normalizeSource(value:string){
  return value.trim().toLowerCase().replace(/^www\./,"").slice(0,100);
}

function hasSourceToken(source:string,tokens:readonly string[]){
  return tokens.some(token=>source.includes(token));
}

function isAcquisitionContext(value:unknown):value is AcquisitionContext{
  if(!value||typeof value!=="object")return false;
  const item=value as Partial<AcquisitionContext>;
  return typeof item.traffic_channel==="string"&&typeof item.referral_source==="string"&&typeof item.traffic_medium==="string"&&typeof item.campaign_name==="string"&&typeof item.landing_page==="string";
}

export function getAcquisitionContext():Partial<AcquisitionContext>{
  if(typeof window==="undefined")return{};
  try{
    const stored=sessionStorage.getItem(acquisitionStorageKey);
    if(stored){
      const parsed:unknown=JSON.parse(stored);
      if(isAcquisitionContext(parsed))return parsed;
    }

    const params=new URLSearchParams(window.location.search);
    const utmSource=normalizeSource(params.get("utm_source")||"");
    const utmMedium=normalizeSource(params.get("utm_medium")||"");
    const utmCampaign=normalizeSource(params.get("utm_campaign")||"");
    let referrerHost="";
    if(document.referrer){
      try{referrerHost=normalizeSource(new URL(document.referrer).hostname);}catch{}
    }
    const isInternalReferrer=referrerHost===normalizeSource(window.location.hostname);
    const source=utmSource||(!isInternalReferrer?referrerHost:"")||"direct";
    const trafficChannel=hasSourceToken(source,llmSourceTokens)?"llm":utmMedium==="organic"||hasSourceToken(referrerHost,searchSourceTokens)?"organic_search":utmSource?"campaign":referrerHost&&!isInternalReferrer?"referral":"direct";
    const trafficMedium=utmMedium||(
      trafficChannel==="organic_search"
        ?"organic"
        :trafficChannel==="referral"||trafficChannel==="llm"
          ?"referral"
          :"none"
    );
    const context:AcquisitionContext={traffic_channel:trafficChannel,referral_source:source,traffic_medium:trafficMedium,campaign_name:utmCampaign,landing_page:window.location.pathname};
    sessionStorage.setItem(acquisitionStorageKey,JSON.stringify(context));
    return context;
  }catch{
    return{};
  }
}

export function trackEvent(eventName:string,params:GAEventParams={}){
  if(typeof window==="undefined"||typeof window.gtag!=="function")return;
  try{
    const cleanParams=Object.fromEntries(Object.entries({...getAcquisitionContext(),page_path:currentPagePath(),...params}).filter(([,value])=>value!==undefined));
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

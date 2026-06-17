import { metadata as meta, site } from "@/lib/site";
import { TrackedLink } from "@/components/tracked-link";

export const metadata=meta("Privacy Policy","How Dimaso collects, uses, and protects visitor information submitted through dimaso.co.","/privacy-policy");

const sections=[
  ["Information we collect","When you use this website, Dimaso may collect information you choose to submit through forms, including your name, email address, company, selected service, message, and uploaded project files. We may also receive basic technical information such as page URL, browser/device data, analytics events, and spam-protection signals."],
  ["How we use information","We use submitted information to respond to inquiries, review RFPs or project briefs, provide requested website maintenance, web development, or web design information, manage newsletter subscriptions, improve website performance, and protect the website from spam or misuse."],
  ["Email communication","When you submit a form, we may send an internal notification to Dimaso and an automatic confirmation to the email address you provided. Newsletter submissions may receive subscription-related communication and future updates from Dimaso."],
  ["Files and project materials","If you upload a file, it is used only to understand your request, RFP, project brief, website issue, or support question. Please avoid sending sensitive credentials, payment data, or private information through upload forms."],
  ["Analytics and technical data","The website may use analytics and performance tools to understand page visits, loading behavior, and general usage trends. This helps us maintain and improve the website without identifying individual visitors more than necessary."],
  ["Sharing information","Dimaso does not sell visitor information. We may share information only with service providers that help operate the website, process email, host the site, analyze performance, or support client communication, or where required by law."],
  ["Data retention","We keep submitted information only for as long as reasonably needed to respond to requests, manage business records, maintain security, and meet legal or operational obligations."],
  ["Your choices","You can request access, correction, or deletion of information you submitted to Dimaso. You can also unsubscribe from newsletter communication using the available unsubscribe option or by contacting us directly."],
  ["Contact","For privacy questions, contact Dimaso at office@dimaso.co."],
] as const;

export default function PrivacyPolicy(){
  return <main>
    <section className="legal-hero grid-bg">
      <div className="shell">
        <span className="eyebrow">Legal / Privacy</span>
        <h1>Privacy Policy</h1>
        <p className="lede">This policy explains how Dimaso handles information submitted through {site.url}.</p>
        <p className="legal-updated">Last updated: June 8, 2026</p>
      </div>
    </section>
    <section className="section legal-section">
      <div className="shell legal-layout">
        <aside className="legal-aside">
          <span className="eyebrow">Dimaso</span>
          <p>Website Maintenance | Web Development | Web Design</p>
          <TrackedLink tracking="email" trackingLocation="privacy_policy" className="text-link" href="mailto:office@dimaso.co">office@dimaso.co</TrackedLink>
        </aside>
        <div className="legal-content">
          {sections.map(([title,copy])=><section key={title} className="legal-block">
            <h2>{title}</h2>
            <p>{copy}</p>
          </section>)}
        </div>
      </div>
    </section>
  </main>;
}

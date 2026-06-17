import { metadata as meta, site } from "@/lib/site";

export const metadata=meta("Terms and Conditions","Terms for using the Dimaso website and submitting inquiries through dimaso.co.","/terms-and-conditions");

const sections=[
  ["Use of this website","By using this website, you agree to use it lawfully and respectfully. You may not attempt to disrupt the website, misuse forms, upload harmful files, or interfere with website security or availability."],
  ["Website content","The content on this website is provided for general business information about Dimaso services. It may be updated, changed, or removed without notice. Content should not be treated as a binding proposal, guarantee, or professional legal advice."],
  ["Form submissions","When you submit a contact form, RFP, project request, newsletter form, or uploaded file, you confirm that the information is accurate and that you have the right to share it with Dimaso. Submitting a form does not create a client relationship or service agreement by itself."],
  ["Project discussions and proposals","Any project scope, pricing, delivery timeline, maintenance plan, or service commitment must be confirmed separately in writing by Dimaso. Website text, examples, case studies, or response-time descriptions are not automatic contractual terms."],
  ["Uploaded files","You are responsible for files you upload. Do not upload unlawful, harmful, confidential, or sensitive material unless it is necessary for your request and you are authorized to share it."],
  ["Intellectual property","The Dimaso name, website design, copy, graphics, and other site materials are owned by Dimaso or used with permission. You may not copy, reproduce, or reuse website materials without written permission, except for normal browsing and sharing links."],
  ["Third-party links","This website may link to third-party websites, tools, social profiles, or embedded media. Dimaso is not responsible for external websites, their content, availability, or privacy practices."],
  ["Limitation of liability","Dimaso aims to keep this website accurate and available, but we do not guarantee uninterrupted access or error-free content. To the extent permitted by law, Dimaso is not liable for losses resulting from use of, or inability to use, this website."],
  ["Contact","For questions about these terms, contact Dimaso at office@dimaso.co."],
] as const;

export default function TermsAndConditions(){
  return <main>
    <section className="legal-hero grid-bg">
      <div className="shell">
        <span className="eyebrow">Legal / Terms</span>
        <h1>Terms and Conditions</h1>
        <p className="lede">These terms apply to use of {site.url} and information submitted through the website.</p>
        <p className="legal-updated">Last updated: June 8, 2026</p>
      </div>
    </section>
    <section className="section legal-section">
      <div className="shell legal-layout">
        <aside className="legal-aside">
          <span className="eyebrow">Dimaso</span>
          <p>Clear terms for website visitors, form submissions, and project inquiries.</p>
          <a className="text-link" href="mailto:office@dimaso.co">office@dimaso.co</a>
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

export type BlogFaq = readonly [question: string, answer: string];

export const blogFaqs: Record<string, readonly BlogFaq[]> = {
  "website-maintenance-checklist-for-nonprofits": [
    [
      "What does nonprofit website maintenance include?",
      "Nonprofit website maintenance can include donation and contact form testing, WordPress or CMS updates, backups, security review, accessibility checks, content updates, technical SEO, analytics validation, performance monitoring, QA, reporting, and a prioritized improvement backlog.",
    ],
    [
      "How often should a nonprofit website be maintained?",
      "Priority forms, donation paths, backups, security alerts, updates, and key pages should usually be checked monthly. High-volume campaigns may need weekly or pre-launch QA. Broader accessibility, recovery, access, performance, and technical SEO reviews can be scheduled quarterly, with ownership and vendor reviews annually.",
    ],
    [
      "What should WordPress maintenance include for nonprofits?",
      "WordPress maintenance should include controlled core, theme, and plugin updates, a verified backup and rollback path, staging checks, form and donation QA, account and license review, security monitoring, performance checks, content support, analytics validation, and reporting.",
    ],
    [
      "How much does nonprofit website maintenance cost?",
      "Cost depends on platform complexity, donation and CRM integrations, update frequency, accessibility and content workload, response expectations, security risk, reporting, and the amount of development included. A useful proposal defines responsibilities and capacity before giving a monthly figure.",
    ],
    [
      "Can a nonprofit outsource monthly website maintenance?",
      "Yes. A nonprofit can keep strategy and selected content tasks internally while a website partner owns updates, backups, security, QA, forms, performance, technical SEO, analytics, reporting, and planned improvements. Responsibilities and escalation paths should be documented during onboarding.",
    ],
  ],
};

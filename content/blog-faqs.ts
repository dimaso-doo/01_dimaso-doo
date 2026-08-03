export type BlogFaq = readonly [question: string, answer: string];

export const blogFaqs: Record<string, readonly BlogFaq[]> = {
  "nonprofit-website-redesign-cost": [
    [
      "How much does a nonprofit website redesign cost in 2026?",
      "A focused refresh may cost approximately $3,000 to $10,000, a structured nonprofit redesign may fall around $10,000 to $30,000, and a complex platform can cost $30,000 to $75,000 or more. These are planning ranges rather than fixed quotes; content volume, integrations, accessibility, migration, custom development, and stakeholder requirements determine the final scope.",
    ],
    [
      "How long does a nonprofit website redesign take?",
      "A focused refresh may take four to eight weeks, while a structured redesign commonly needs about ten to twenty weeks. Complex platforms can require six months or longer. Content readiness, stakeholder approvals, integrations, migration volume, and accessibility testing often have the greatest effect on the schedule.",
    ],
    [
      "What is the difference between a website refresh and a redesign?",
      "A refresh improves selected messaging, visuals, templates, and conversion paths while preserving a healthy CMS, structure, and most content. A redesign changes information architecture, content, user journeys, templates, technology, integrations, or accessibility at a system level. An audit should determine which level is justified.",
    ],
    [
      "What should a nonprofit website redesign include?",
      "A complete scope can include discovery, analytics review, sitemap, content strategy, UX, visual design, responsive development, CMS implementation, donation and CRM integrations, accessibility, technical SEO, migration, redirects, analytics, QA, training, launch support, and post-launch maintenance.",
    ],
    [
      "How can a nonprofit reduce website redesign cost?",
      "Define goals and decision rights early, audit and consolidate content before migration, assign one internal project owner, use reusable patterns and proven integrations, separate launch requirements from later improvements, and provide feedback on schedule. Do not remove accessibility, redirect planning, analytics validation, or QA simply to lower the initial figure.",
    ],
  ],
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

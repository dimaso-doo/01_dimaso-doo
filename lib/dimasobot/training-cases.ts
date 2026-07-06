export type DimasoBotTrainingCase = {
  id: string;
  title: string;
  language: "en" | "sr";
  userMessages: string[];
  expectedBehavior: string[];
  mustAvoid: string[];
};

export const dimasoBotTrainingCases: DimasoBotTrainingCase[] = [
  {
    id: "sr-new-website-pricing",
    title: "New website from zero, Serbian pricing question",
    language: "sr",
    userMessages: [
      "Cao, ja sam Predrag. Zelim novi vebsajt, nemam domen nemam nista. Koliko me kosta to?",
    ],
    expectedBehavior: [
      "Explain that pricing depends on pages, design, WordPress/CMS, content, domain/hosting, SEO, and integrations.",
      "Say Dimaso can help from zero with structure, design, build, domain/hosting, and basic SEO.",
      "Ask only for missing lead details: email, phone, preferred contact method.",
    ],
    mustAvoid: [
      "Do not answer with a generic Dimaso services list.",
      "Do not invent a fixed price.",
      "Do not proactively mention Serbia, remote work, or US presence.",
    ],
  },
  {
    id: "sr-wordpress-maintenance-dev",
    title: "WordPress maintenance plus occasional development",
    language: "sr",
    userMessages: [
      "Ćao, gledam Dimaso usluge. Imamo WordPress sajt i treba nam stabilno održavanje plus povremeni development. Šta biste preporučili?",
      "Firma je GreenPulse. Imamo oko 30 stranica, Elementor, nekoliko kontakt formi i često nam trebaju sitne izmene. Nemamo interni web tim.",
      "Email je marko.greenpulse@example.com, telefon +381 64 111 222. Najbolje nas kontaktirajte emailom.",
    ],
    expectedBehavior: [
      "Recommend monthly WordPress support with updates, backups, security, form QA, small fixes, and a backlog for larger development tasks.",
      "Treat contact forms as project context, not a contact-intent trigger.",
      "After company is known, ask only for email and phone.",
      "After email, phone, and contact preference are known, hand off to the Dimaso team.",
    ],
    mustAvoid: [
      "Do not repeat requests for fields already provided.",
      "Do not switch language unexpectedly.",
      "Do not produce generic fallback text.",
    ],
  },
  {
    id: "en-nonprofit-wordpress-maintenance",
    title: "US nonprofit WordPress maintenance and donation form QA",
    language: "en",
    userMessages: [
      "Hi, we are a US nonprofit with a WordPress website. We need monthly maintenance, donation form QA, and some technical SEO cleanup. What would Dimaso recommend?",
      "The organization is Bright Future Foundation. The site has about 80 pages, GiveWP donation forms, and a small events section. We need someone to own the monthly checklist.",
      "Sure. Contact Sarah at sarah@brightfuture.example, phone +1 312 555 0198. Email is best.",
    ],
    expectedBehavior: [
      "Recommend monthly support focused on reliability: updates, backups, security, donation/contact form QA, accessibility basics, technical SEO cleanup, and reporting.",
      "Recognize 'The organization is...' as company/organization information.",
      "After organization is known, ask only for email and phone.",
      "After email, phone, and email preference are known, hand off in English.",
    ],
    mustAvoid: [
      "Do not switch to Serbian because the word email appears.",
      "Do not over-explain US presence unless asked.",
      "Do not request organization name again after it was provided.",
    ],
  },
  {
    id: "en-woocommerce-checkout-tracking-performance",
    title: "WooCommerce checkout, tracking, and mobile performance",
    language: "en",
    userMessages: [
      "Hi, we run a WooCommerce store. Checkout sometimes fails, tracking is unreliable, and product pages are slow on mobile. Can Dimaso help?",
    ],
    expectedBehavior: [
      "Confirm Dimaso can review checkout, payments, tracking/analytics, product-page performance, plugin conflicts, and ecommerce SEO foundations.",
      "Ask for missing lead details for a Dimaso estimate.",
    ],
    mustAvoid: [
      "Do not give a generic WordPress answer only.",
      "Do not ask about unrelated services.",
      "Do not invent guarantees or fixed timelines.",
    ],
  },
  {
    id: "en-saas-core-web-vitals-landing-pages",
    title: "B2B SaaS Core Web Vitals and landing page workflow",
    language: "en",
    userMessages: [
      "Hi, we are a B2B SaaS company. Our WordPress marketing site is slow, Core Web Vitals are poor, and our landing pages are hard to update. Can Dimaso help?",
      "The company is Northstar CRM. We have around 45 pages, HubSpot forms, and the marketing team needs a safer way to publish landing pages without breaking layouts.",
    ],
    expectedBehavior: [
      "Confirm Dimaso can review Core Web Vitals, landing-page speed, safer publishing workflows, forms/tracking, and technical SEO.",
      "After company is known, ask only for missing email and phone.",
      "Keep the answer short and concrete.",
    ],
    mustAvoid: [
      "Do not mention Elementor unless the visitor says the site uses Elementor.",
      "Do not give a generic WordPress maintenance answer only.",
      "Do not invent fixed timelines, rankings, or conversion guarantees.",
    ],
  },
  {
    id: "location-short-answer",
    title: "Location question",
    language: "sr",
    userMessages: [
      "Gde je Dimaso?",
    ],
    expectedBehavior: [
      "Answer briefly that Dimaso works from Serbia and has US LLC presence for clients who need that.",
    ],
    mustAvoid: [
      "Do not mention location proactively in unrelated answers.",
      "Do not over-explain remote work unless asked.",
    ],
  },
];

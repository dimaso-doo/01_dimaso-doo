export type BlogFaq = readonly [question: string, answer: string];

export const blogFaqs: Record<string, readonly BlogFaq[]> = {
  "website-maintenance-proposal": [
    ["What should a website maintenance proposal include?", "It should define the websites and systems in scope, routine maintenance, included fixes or development, response and escalation terms, backups and recovery, security, release QA, reporting, client responsibilities, exclusions, pricing, and work outside the plan."],
    ["How do you compare website maintenance proposals?", "Compare ownership of business-critical journeys, response expectations, included capacity, QA evidence, reporting quality, urgent support, onboarding, exclusions, and total operational risk. Do not compare only the monthly price or number of update tasks."],
    ["Should a maintenance proposal include an audit?", "Yes, when the provider is taking responsibility for an existing website. A baseline review identifies access, backups, hosting, integrations, current defects, security risk, and technical debt so existing issues are not confused with recurring maintenance."],
  ],
  "website-support-retainer-vs-hourly": [
    ["Is a website support retainer cheaper than hourly support?", "It depends on request frequency and the value of continuity. Hourly support can cost less for rare, bounded work. A retainer can be more efficient when recurring changes, monitoring, QA, faster response, and retained platform knowledge prevent repeated discovery and incidents."],
    ["What should a website support retainer include?", "A retainer can include reserved capacity, updates, fixes, monitoring, backups, security, release QA, reporting, prioritization, technical SEO, analytics checks, and response terms. The proposal should explain unused capacity, larger projects, urgent work, and exclusions."],
    ["Can a company combine retained and project website support?", "Yes. A common model uses a monthly retainer for care, small releases, QA, and reporting, while redesigns, migrations, and large features receive separate project scopes. This preserves context without forcing every initiative into one allowance."],
  ],
  "wordpress-maintenance-plans": [
    ["What should a WordPress maintenance plan include?", "A plan can include controlled WordPress, plugin, theme, and PHP updates; verified backups and recovery; security and access review; staging; form or checkout QA; uptime and performance; fixes; technical SEO; reporting; and an agreed support process."],
    ["Are automatic updates enough for WordPress maintenance?", "No. Automation can install updates, but it does not confirm that forms, checkout, email, analytics, custom code, integrations, and responsive templates still work. Business-critical websites need proportionate regression testing and a rollback path."],
    ["How should businesses compare WordPress care plans?", "Compare the actual website journeys covered, backup and recovery ownership, update process, included development capacity, response terms, WooCommerce or custom-code support, QA evidence, reporting, and exclusions—not only update frequency."],
  ],
  "hire-wordpress-developer-existing-website": [
    ["How do I hire a developer to take over an existing WordPress site?", "Define the outcome, share known access and problems, and ask candidates how they audit hosting, backups, WordPress, PHP, themes, plugins, licenses, custom code, forms, email, analytics, and integrations before changing production."],
    ["Should a WordPress developer audit the website first?", "A bounded takeover review is usually the safest first step. It can produce an access map, verified backup, risk register, immediate fixes, and recommendation for a project or maintenance plan before either side commits to uncertain work."],
    ["What access will a WordPress developer need?", "Depending on scope, the developer may need WordPress administrator, hosting, DNS, domain, SFTP or SSH, database, repository, CDN, analytics, Search Console, email-delivery, and third-party integration access. Credentials should be shared through a secure process."],
  ],
  "woocommerce-maintenance-cost": [
    ["How much does WooCommerce maintenance cost per month?", "A standard store may begin around $300 to $750 per month, while active, customized, integrated, or higher-risk stores often require $750 to $2,500 or more. These are planning ranges; checkout complexity, integrations, volume, response expectations, and included development determine the proposal."],
    ["What should WooCommerce maintenance include?", "It can include controlled updates, backups and rollback, security, scheduled actions, representative cart and checkout QA, payment and shipping checks, transactional email, integrations, performance, product SEO, analytics, reporting, and development capacity."],
    ["Why does WooCommerce support cost more than basic WordPress care?", "WooCommerce adds revenue-sensitive product, pricing, cart, checkout, payment, tax, shipping, order, inventory, email, customer-account, and integration behavior. Updates need broader QA, recovery must consider live orders, and failures can create immediate financial impact."],
  ],
  "technical-seo-audit-cost": [
    ["How much does a technical SEO audit cost?", "A focused small-site review may cost roughly $1,000 to $3,000, while comprehensive audits for larger, ecommerce, multilingual, JavaScript, or migration-sensitive websites may range from $3,000 to $10,000 or more. Implementation and ongoing validation may be separate."],
    ["What should a technical SEO audit deliver?", "It should provide evidence-based findings covering crawlability, indexation, templates, rendering, canonicals, redirects, sitemaps, robots rules, structured data, internal links, performance, analytics, and Search Console, prioritized by business impact with implementation guidance."],
    ["Does a technical SEO audit include implementation?", "Not always. Buyers should confirm whether the provider only delivers recommendations or also updates templates and configuration, coordinates with developers, validates releases, and monitors search and analytics signals after implementation."],
  ],
  "choose-website-redesign-agency": [
    ["What should I look for in a website redesign agency?", "Look for connected capability across strategy, content, UX, responsive design, development, CMS, accessibility, technical SEO, migration, analytics, QA, and post-launch support. Meet the delivery team and review case studies relevant to your complexity."],
    ["What should a website redesign proposal include?", "It should separate discovery, content, design, development, migration, SEO, analytics, QA, launch, and support; name assumptions, dependencies, client responsibilities, revision limits, third-party costs, exclusions, change control, timeline, and acceptance criteria."],
    ["How many website redesign agencies should a company compare?", "A shortlist of three to five qualified agencies is usually enough for a serious comparison. A smaller relevant group allows deeper conversations about approach, team, assumptions, risk, and support instead of a broad price-only tender."],
  ],
  "nonprofit-website-support-options": [
    ["Should a nonprofit hire an employee, freelancer, or agency for website support?", "Choose based on workload, continuity, skill breadth, response needs, donation and CRM risk, accessibility, and budget. Internal owners offer context, freelancers can fit focused needs, and agencies provide broader coverage and reduced single-person dependency."],
    ["Can a nonprofit use a hybrid website support model?", "Yes. An internal communications or marketing owner can manage mission, content, and approvals while an external technical partner owns updates, security, backups, accessibility support, integrations, QA, analytics, and planned improvements."],
    ["What should nonprofit website support cover?", "Support can cover donation, application, event, newsletter, and contact flows; WordPress or CMS updates; CRM and payment integrations; accessibility; security; backups; performance; technical SEO; analytics; content support; reporting; and campaign QA."],
  ],
  "white-label-web-development-partner": [
    ["What is a white-label web development partner?", "It is a development team that delivers client work behind or alongside another agency's brand. The model can cover projects, retained capacity, WordPress support, ecommerce, integrations, migrations, QA, and ongoing technical maintenance."],
    ["How should an agency evaluate a white-label partner?", "Use a representative paid pilot and evaluate technical depth, questions, estimation, communication, client protection, code and release practices, QA, documentation, security, capacity, escalation, and commercial terms."],
    ["Should a white-label developer communicate directly with clients?", "Either model can work. Agree in advance whether the partner remains invisible, joins under the agency brand, or communicates directly with selected stakeholders. Define who owns meetings, decisions, estimates, approvals, support, and relationship management."],
  ],
  "choose-website-migration-company": [
    ["What should a website migration company handle?", "It can handle discovery, URL and content inventory, CMS and data migration, redirect mapping, hosting and DNS coordination, integrations, metadata and structured data, analytics, staging QA, launch, rollback planning, and post-launch monitoring."],
    ["How do I protect SEO during a website migration?", "Preserve valuable URLs where possible, map one-to-one redirects, retain metadata and structured data, update internal links, validate canonicals and robots rules, crawl staging, verify analytics and Search Console, and monitor errors, indexation, traffic, and rankings after launch."],
    ["What should I ask before hiring a website migration company?", "Ask for its inventory process, relevant migration experience, URL mapping method, content and integration approach, staging and QA plan, freeze and launch process, rollback strategy, SEO and analytics ownership, defect definition, and post-launch support period."],
  ],
  "website-maintenance-costs-and-pricing": [
    [
      "How much does WordPress maintenance cost per month?",
      "Basic professional WordPress care commonly falls around $75 to $250 per month, managed business support around $250 to $750, and WooCommerce, custom, or mission-critical support around $750 to $2,500 or more. These are planning ranges rather than fixed quotes; risk, response expectations, integrations, QA, and included development time determine the real price.",
    ],
    [
      "What should monthly WordPress maintenance include?",
      "Monthly WordPress maintenance can include controlled core, theme, plugin, PHP, and database updates; verified backups and recovery; security and access review; staging; form or checkout QA; uptime and performance monitoring; technical SEO and analytics checks; reporting; and an agreed amount of improvement capacity.",
    ],
    [
      "Is managed WordPress hosting the same as website maintenance?",
      "No. Managed hosting usually focuses on the server, platform-level backups, caching, uptime, security, and selected update automation. Website maintenance adds application and business ownership, such as regression testing, form and checkout QA, integration diagnosis, analytics validation, fixes, reporting, and planned improvements.",
    ],
    [
      "Why does WooCommerce maintenance cost more?",
      "WooCommerce maintenance covers more revenue-sensitive systems, including products, prices, promotions, tax, shipping, payments, inventory, customer accounts, email, feeds, subscriptions, and integrations. Order volume, custom checkout rules, external systems, release frequency, and response expectations all increase the required monitoring, QA, and development capacity.",
    ],
    [
      "Can a business maintain its own WordPress website?",
      "Yes, when the website is simple and someone has the time, access, technical skill, backup and restore process, monitoring, checklist, and authority to own failures. External support becomes more valuable when the website drives important leads or revenue, changes frequently, uses custom code or integrations, or needs dependable response and reporting.",
    ],
  ],
  "ecommerce-website-maintenance-checklist": [
    [
      "What should ecommerce website maintenance include?",
      "Ecommerce maintenance can include checkout and payment testing, shipping and tax validation, products, pricing, promotions, inventory, accounts, controlled updates, backups, security, recovery, mobile QA, performance, product SEO, structured data, feeds, analytics, email, integrations, reporting, and an owned improvement backlog.",
    ],
    [
      "How often should an ecommerce website be maintained?",
      "Uptime, payments, order flow, security, stock synchronization, and critical integrations should be monitored continuously or daily. Run selected operational checks weekly, a structured maintenance and checkout cycle monthly, and deeper recovery, access, catalog, SEO, integration, and conversion reviews quarterly.",
    ],
    [
      "How do you test an ecommerce checkout?",
      "Use representative products, customer types, devices, destinations, discounts, shipping methods, tax rules, currencies, and payment gateways. Verify the cart, validation, order creation, payment status, inventory, emails, analytics events, fulfillment handoff, refunds, cancellations, and error recovery.",
    ],
    [
      "What should WooCommerce maintenance include?",
      "WooCommerce maintenance should include controlled WordPress, theme, plugin, PHP, extension, and custom-code updates; backups and rollback; scheduled actions; security and access; representative checkout QA; transactional email; performance; product SEO; analytics; licenses; reporting; and ongoing development priorities.",
    ],
    [
      "How much does ecommerce website maintenance cost?",
      "Cost depends on the platform, catalog and rule complexity, transaction volume, integrations, release frequency, response expectations, security and recovery responsibilities, reporting, and included development capacity. A proposal should define checkout coverage, escalation, QA evidence, included time, and out-of-scope work.",
    ],
  ],
  "small-business-website-maintenance-checklist": [
    [
      "What should small business website maintenance include?",
      "Small business website maintenance can include form and lead testing, CMS and plugin updates, backups, security monitoring, uptime, mobile and browser QA, performance, content accuracy, broken links, technical and local SEO, Search Console, GA4 conversion tracking, privacy checks, reporting, and a prioritized improvement backlog.",
    ],
    [
      "How often should a small business website be maintained?",
      "Uptime and security alerts should be monitored continuously, while critical backups and revenue paths may need weekly checks. Most businesses should run a structured monthly maintenance cycle and a deeper quarterly review of content, SEO, accessibility, analytics, access, customer journeys, and roadmap priorities.",
    ],
    [
      "How much does small business website maintenance cost?",
      "Cost depends on the platform, update frequency, development capacity, ecommerce or booking functionality, integrations, response times, security risk, reporting, and number of websites. A useful proposal defines responsibilities, included capacity, urgent support, and out-of-scope work before presenting a monthly figure.",
    ],
    [
      "Can a small business maintain its own website?",
      "Yes, when the website is stable and someone has the time, access, technical confidence, backup process, and checklist required to own it. A maintenance partner becomes more valuable when the website drives important leads or revenue, changes frequently, uses several integrations, or nobody internally can diagnose failures safely.",
    ],
    [
      "What should monthly WordPress maintenance include?",
      "Monthly WordPress maintenance should include controlled core, theme, and plugin updates, verified backups and rollback, security and access review, staging where appropriate, form and lead QA, mobile checks, performance, broken links, analytics validation, license review, reporting, and a prioritized improvement backlog.",
    ],
  ],
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

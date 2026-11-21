# Website simplification — 21 November 2026

## Backup
The full pre-change website is preserved in the GitHub branch:
backup/before-simplification-2026-11-21

Exact original production commit: 8c414737834d5e2fd91e067c40cd92985f2be9d6
Previous production deployment: dpl_3ufXJe8guTLcyGtux122h9aGR7nA
Previous production URL: https://dimaso-br5jxaowq-dimasodoo-9210s-projects.vercel.app

Use the backup branch to recover any original source or assets. The earlier production deployment is a Vercel rollback candidate.

## Changes
- Services, Work, About, Contact navigation.
- Compact shared footer with one contact CTA; no repeated form or newsletter.
- Contact-only form: email, optional website, message, optional collapsed attachment.
- Short homepage, service and industry pages, About, project cards, and case-study presentation.
- Unchanged existing URLs, contact endpoint, spam protection, analytics, and long-form articles.
- Existing testimonial first sentences used as excerpts, without rewriting client quotes.
- Old footer links now lead to Contact; legacy #rfp links redirect there.
- Service choice retained in a hidden form field when arriving from a service page.

## Validation
- Next.js production build passed for the initial simplified version.
- Desktop homepage and Contact checked.
- Mobile at 390px checked: navigation, service page, no horizontal overflow.
- Empty Contact submit correctly highlights email and message; no inquiry sent.
- Homepage has no form; Contact has exactly one form; footer has none.
- Final follow-up adjusts mobile heading spacing and validation-message readability.

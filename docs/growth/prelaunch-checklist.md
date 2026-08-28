# Dimaso prelaunch checklist

## Required before deployment

- [ ] Review the homepage promise and three support paths: agencies, nonprofits, and WooCommerce teams.
- [ ] Confirm that “request a senior website review” is an operationally supportable promise.
- [ ] Confirm that a name may be optional on the project form.
- [ ] Confirm the prepared nonprofit checklist title and description.
- [ ] Confirm the permanent WooCommerce Support → WooCommerce Maintenance redirect.
- [ ] Review the revised AI service language; `llms.txt` is no longer presented as a ranking mechanism.
- [ ] Complete the client-proof verification worksheet before adding any new public metrics or quotes.

## Technical validation

- [ ] ESLint passes.
- [ ] TypeScript/Next.js production build passes.
- [ ] Homepage, Agencies, Nonprofits, WordPress Support, WooCommerce Maintenance, Contact, and the nonprofit checklist render on desktop and mobile.
- [ ] `/services/woocommerce-support` returns a permanent redirect to `/services/woocommerce-maintenance`.
- [ ] Form validation works with email and message as the only required fields.
- [ ] A controlled staging form submission reaches the expected mailbox before production deployment.
- [ ] GA events appear in DebugView: `project_form_view`, `project_form_start`, `project_form_submit_attempt`, `project_form_validation_error`, `project_form_submit_error`, and the relevant success event.

## After deployment

- [ ] Verify production title, description, canonical, sitemap last-modified value, and redirect.
- [ ] Request indexing for the nonprofit checklist, Agencies, Nonprofits, and canonical WooCommerce Maintenance pages.
- [ ] Annotate GA4 with the release date.
- [ ] Measure 14–28 days before judging the nonprofit title test.
- [ ] Reconcile every GA4 lead with an actual mailbox/CRM record.

# Sanity CMS setup

The site still uses the current static content in `content/` as the active fallback. Sanity is prepared as a clean data layer, but the Studio package is not installed yet.

## Environment variables

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-02-19
SANITY_API_READ_TOKEN=
```

`SANITY_API_READ_TOKEN` is optional for public datasets. Use it if the dataset is private.

## Prepared files

- `lib/sanity/client.ts` contains a small fail-soft Sanity fetch helper.
- `lib/sanity/queries.ts` contains queries and fallback helper functions for posts, case studies, and testimonials.
- `sanity/schemas/` contains draft schema definitions for posts, case studies, testimonials, team members, and site settings.

## Next step when Studio is approved

Install Sanity and convert the plain schema objects to Studio-native definitions:

```bash
npm install sanity next-sanity
```

Then add a Studio route or a separate Studio app, import `schemaTypes` from `sanity/schemas`, and replace static page data imports with the helper functions from `lib/sanity/queries.ts`.

The current implementation intentionally avoids adding these packages until the CMS editing workflow is confirmed, so the production build stays small and stable.

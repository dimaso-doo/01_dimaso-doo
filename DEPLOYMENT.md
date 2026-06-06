# Cloudways deployment

This is a Next.js application prepared for Cloudways with SMTP forms and optional Sanity CMS fallback support.

## Required environment

Create `.env` on the Cloudways application server from `.env.example`:

```bash
NEXT_PUBLIC_SITE_URL=https://dimaso.co
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Dimaso Website <website@dimaso.co>"
CONTACT_TO_EMAIL=office@dimaso.co
RFP_TO_EMAIL=office@dimaso.co
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-02-19
SANITY_API_READ_TOKEN=
```

Sanity variables can stay empty until the CMS dataset is ready. The current website content will continue to render from `content/`.

## Build and run

```bash
npm install
npm run build
pm2 start npm --name dimaso -- start
pm2 save
```

For later releases:

```bash
git pull
npm install
npm run build
pm2 restart dimaso
```

## Cloudways checklist

1. Upload or pull the project into the application directory.
2. Set the application Node.js version supported by Cloudways for Next.js 15.
3. Add `.env` with SMTP, site URL, and optional Sanity variables.
4. Run `npm install` and `npm run build`.
5. Start with PM2 using `npm start`.
6. Point `dimaso.co` and `www.dimaso.co` to the application.
7. Enable SSL for both hostnames.
8. Verify `/`, `/blog`, `/blog/page/2`, `/case-studies`, `/contact`, `/sitemap.xml`, and `/robots.txt`.
9. Test contact/RFP upload forms and newsletter signup.
10. Confirm emails arrive at `office@dimaso.co`.

## Deploy archive

Use the latest zip package created outside the project folder:

`/Users/ps/Documents/Codex/2026-06-05/files-mentioned-by-the-user-dimaso/work/dimaso-cloudways-sanity-ready.zip`

The archive excludes `node_modules`, `.next`, `.git`, `dist`, `build`, `work`, and local TypeScript build cache files.

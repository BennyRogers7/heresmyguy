# HereIsMyGuy.com — Claude Context

## Project Overview
National multi-vertical contractor directory monetized through featured listings and claim flows. Built with Next.js (App Router), Prisma, Neon (Postgres), deployed on Vercel.

## Tech Stack
- Framework: Next.js (App Router)
- Database: Neon (Postgres) via Prisma
- Deployment: Vercel (project: bens-projects-fa471795/app)
- Storage: Cloudflare R2 (logos)

## URL Structure
- /[state] — state pages (e.g. /minnesota)
- /[state]/[city] — city pages
- /[state]/[city]/[vertical] — city + vertical pages
- /trade/[vertical] — vertical pages
- /trade/[vertical]/[state] — vertical + state pages
- /profile/[slug] — business profile pages
- /claim-listing — claim flow (dynamic, supports ?id=[businessId] for pre-fill)
- /featured — featured listing lead capture page

## Key Files
- src/app/sitemap.ts — sitemap generation (Next.js native convention)
- src/app/robots.ts — robots config
- src/lib/db.ts — Prisma client
- src/lib/vertical-services.ts — services checklist per vertical (used in claim form)
- src/app/claim-listing/ — dynamic claim form (pre-fills from ?id= param)
- src/app/featured/ — featured listing lead capture
- src/app/api/claim-listing/route.ts — claim form API endpoint
- src/app/api/featured-lead/route.ts — featured lead capture API endpoint
- next.config.ts — rewrites for sitemap XML files, redirects for old MN city URLs

## SEO / Sitemap Status (as of 2026-03-17)
- Sitemap at /sitemap.xml via src/app/sitemap.ts
- Generates ~39,220 URLs: static, state, vertical, city, city+vertical pages
- Business profile pages excluded from sitemap (Google discovers via crawl)
- Google Search Console: sitemap submitted, processed successfully, 39,220 pages discovered
- 10 priority pages manually requested for indexing on 2026-03-17
- Indexing in progress — check back in 3-4 days via Search Console → Indexing → Pages

## Known Issues / Cleanup Needed
- src/lib/sitemap-utils.ts — leftover, safe to delete
- Vercel CDN aggressively caches pages — if a new static route returns 404, purge cache via Vercel Dashboard → Project → Settings → Data Cache → Purge Everything
- The [state] dynamic route can intercept top-level slugs if Vercel edge cache has stale 404s. Static routes like /featured, /admin, /badge should take priority but may need cache purge after first deploy.

## Data
- ~39,000+ businesses across multiple states
- States: MN, MI, OH, WI, IL, IN, IA, MO, MA, NY, NJ, PA, CT, DE, ME, SD, ND, TN, KY, SC, WV and more
- Verticals: landscapers, plumbers, electricians, hvac, roofers, painters, general-contractors, pest-control, pool-contractors

## Deployment
- Deploy command: cd app && npx vercel --prod --archive=tgz
- Must use --archive=tgz flag due to file count limit (63k+ files)

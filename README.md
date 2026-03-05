# MN Plumbers Directory

A directory of 676+ licensed plumbers across Minnesota with an AI-powered chat concierge. Built with Next.js, deployed on Cloudflare Pages.

**Live:** [mnplumb.com](https://mnplumb.com)

## Features

### AI Chat Concierge
The homepage features a conversational chat interface that helps users find the right plumber:

- **Natural conversation flow** - Users describe their problem in their own words
- **Empathetic responses** - Context-aware replies based on the issue (leaks, floods, clogs, etc.)
- **Smart location matching** - Supports city names, abbreviations (mpls, st paul), and zip codes
- **Emergency filtering** - Prioritizes plumbers with 24/7 service for urgent issues
- **Ranked results** - Sorted by Google reviews

### Header Search
A search icon in the header allows plumbers to quickly look up their own listing:

- Click the magnifying glass icon in the navigation
- Type at least 2 characters to search by business name
- Results show plumber name, city, and rating
- Click a result to go directly to that profile page

### Claim & Verify Your Listing
Business owners can claim and verify their listing at `/claim-listing`:

- **100% free** for plumbers to claim and verify
- Submit business information and contact details
- Select services offered
- Benefits highlighted: priority placement, verified badge, accurate info, more customers
- Clear public/private info disclosure (email is private, used for contact only)
- Email notifications sent via Resend through Cloudflare Pages Functions
- New businesses not in the directory can also submit to be added

### Directory Pages
- **City pages** - 86 cities across Minnesota
- **Neighborhood pages** - Minneapolis and St. Paul split into neighborhoods
- **City + Service pages** - 500 long-tail pages (e.g., `/minneapolis/drain-cleaning`)
- **Service pages** - 10 service categories (`/services/drain-cleaning`, etc.)
- **Plumber profiles** - Individual pages for all 676 plumbers

### Blog
Content marketing hub at `/blog`:

- **Seasonal guides** - "How to Thaw Frozen Pipes in Minnesota"
- **Cost guides** - "Minneapolis Sewer Line Repair Costs 2026"
- **Local insights** - "Minnesota Plumber Hourly Rates by City"
- **Maintenance checklists** - "Spring Plumbing Checklist"
- Full markdown rendering with tables, lists, code blocks
- BlogPosting schema on all articles

### Verified Badge System
Plumbers can get a free badge to display on their website at `/badge`:

- **3 badge styles**: Standard (200×70), Compact (150×50), Minimal (120×40)
- **3 color themes**: Dark, Light, Gold
- **Embed code generator** with automatic backlink to plumber's profile
- Verified/Featured plumbers display badge on their profile pages

### SEO & Structured Data

**Schema markup on all pages:**

| Page Type | Schemas |
|-----------|---------|
| Profile | BreadcrumbList, LocalBusiness/Plumber (enhanced), FAQPage |
| City | BreadcrumbList, ItemList, FAQPage |
| City + Service | BreadcrumbList, ItemList, Service, FAQPage |
| Service | BreadcrumbList, Service, ItemList, FAQPage |
| Blog | BlogPosting, BreadcrumbList |
| Layout | Organization, WebSite |

**LocalBusiness schema includes:**
- `priceRange`, `areaServed`, `paymentAccepted`
- `aggregateRating` with `ratingCount`
- `hasOfferCatalog` for services
- `knowsAbout` for expertise

**ItemList schema** enables Google carousel features on listing pages.

### ZIP-Based City Resolution
Plumber locations are determined by ZIP code extracted from their address:
- Minneapolis/St. Paul proper ZIPs → Neighborhood pages
- Suburban ZIPs → Corrected city pages (e.g., 55426 → St. Louis Park)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file:

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
NOTIFICATION_EMAIL=your-email@example.com
```

Get your Resend API key at [resend.com](https://resend.com)

## Admin

Manage featured and verified plumbers at `/admin`

**Password:** `mnplumbers2024`

### To feature/verify a plumber:

1. Go to `mnplumb.com/admin`
2. Search for the plumber
3. Click "Feature" or "Verify"
4. Click "Copy JSON"
5. Paste into `src/data/featured.json` or `src/data/verified.json`
6. Commit and push

## Project Structure

```
functions/
└── api/
    └── claim-listing.ts    # Cloudflare Pages Function for form submissions

src/
├── app/
│   ├── admin/              # Admin dashboard
│   ├── badge/              # Verified badge generator
│   ├── blog/               # Blog listing and posts
│   ├── claim-listing/      # Claim your listing page
│   ├── [city]/             # City pages
│   │   └── [service]/      # City + Service combo pages
│   ├── profile/            # Plumber profile pages
│   └── services/           # Service category pages
├── components/
│   ├── Chat.tsx            # Main chat interface
│   ├── ChatMessage.tsx     # Chat message bubbles
│   ├── ChatResults.tsx     # Plumber results in chat
│   ├── HeaderSearch.tsx    # Header search dropdown
│   └── ...
├── data/
│   ├── plumbers.csv        # All plumber data
│   ├── featured.json       # Featured plumber slugs
│   └── verified.json       # Verified plumber slugs
└── lib/
    ├── blog.ts             # Blog posts and helpers
    ├── chatFlow.ts         # Conversation state machine
    ├── data.ts             # Data loading functions
    ├── matcher.ts          # Plumber matching algorithm
    ├── types.ts            # TypeScript types
    └── zipConfig.ts        # ZIP to neighborhood/city mapping
```

## Page Count

| Page Type | Count |
|-----------|-------|
| Homepage | 1 |
| City pages | 86 |
| City + Service pages | 500 |
| Service pages | 10 |
| Plumber profiles | 676 |
| Blog posts | 4 |
| Static pages | 4 |
| **Total** | **~1,280** |

## Chat Flow

1. User describes their plumbing issue
2. Bot responds with empathy and asks about urgency
3. User indicates if it's an emergency
4. Bot asks for location (city or zip code)
5. Bot shows top 8 matched plumbers with contact info

## Deployment

Deploys automatically to Cloudflare Pages on push to `main`.

Build command: `npm run build`
Output directory: `out`

The site uses static export (`output: "export"`) for the Next.js pages, with Cloudflare Pages Functions handling server-side functionality (form submissions). The `functions/` directory is automatically detected and deployed by Cloudflare.

### Environment Variables on Cloudflare

Add these in Cloudflare Pages > Settings > Variables and Secrets:
- `RESEND_API_KEY` - API key from resend.com (encrypt this)
- `NOTIFICATION_EMAIL` - Email address to receive claim form submissions

### Local Development with Functions

To test Cloudflare Pages Functions locally:

```bash
npm run build
npx wrangler pages dev out
```

Create a `.dev.vars` file for local environment variables (not committed to git).

### Manual Deployment

```bash
npm run build
npx wrangler pages deploy out --project-name=mn-plumbers
```

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **Hosting**: Cloudflare Pages
- **Functions**: Cloudflare Pages Functions
- **Email**: Resend API

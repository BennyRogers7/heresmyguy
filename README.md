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

### Claim Your Listing
Business owners can claim their listing at `/claim-listing`:

- Submit business information and contact details
- Select services offered
- Email notifications sent via Resend
- Verification required before connecting with customers

### Directory Pages
- **Neighborhood pages** - Minneapolis and St. Paul are split into neighborhoods:
  - Minneapolis: South, Northeast, Downtown, North, Uptown, Southwest
  - St. Paul: Hamline-University, East Side, Highland, West Side, Downtown
- **Suburb pages** - Corrected from Minneapolis/St. Paul to actual cities (Plymouth, Crystal, Golden Valley, etc.)
- Service pages (`/services/drain-cleaning`, etc.)
- Individual plumber profiles (`/profile/[slug]`)

### ZIP-Based City Resolution
Plumber locations are determined by ZIP code extracted from their address:
- Minneapolis/St. Paul proper ZIPs → Neighborhood pages
- Suburban ZIPs → Corrected city pages (e.g., 55426 → St. Louis Park)

### SEO Optimized
- Canonical URLs on all pages
- Open Graph and Twitter Card metadata
- Organization and WebSite schema
- Breadcrumb schema on city, profile, and service pages
- Service schema on service pages
- FAQ schema on city pages
- Dynamic sitemap with 700+ pages

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
src/
├── app/
│   ├── admin/           # Admin dashboard
│   ├── api/             # API routes
│   │   └── claim-listing/  # Claim form submission
│   ├── claim-listing/   # Claim your listing page
│   ├── [city]/          # City pages (minneapolis, etc.)
│   ├── profile/         # Plumber profile pages
│   └── services/        # Service category pages
├── components/
│   ├── Chat.tsx         # Main chat interface
│   ├── ChatMessage.tsx  # Chat message bubbles
│   ├── ChatResults.tsx  # Plumber results in chat
│   └── ClaimForm.tsx    # Claim listing form
├── data/
│   ├── plumbers.csv     # All plumber data
│   ├── featured.json    # Featured plumber slugs
│   └── verified.json    # Verified plumber slugs
└── lib/
    ├── chatFlow.ts      # Conversation state machine
    ├── matcher.ts       # Plumber matching algorithm
    ├── data.ts          # Data loading functions
    ├── zipConfig.ts     # ZIP to neighborhood/city mapping
    └── types.ts         # TypeScript types
```

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

### Environment Variables on Cloudflare

Add these in Cloudflare Pages > Settings > Environment variables:
- `RESEND_API_KEY`
- `NOTIFICATION_EMAIL`

# Here's My Guy

A national contractor directory with 5,400+ verified contractors across multiple trades. Find the contractor your neighbor swears by.

**Live:** [heresmyguy.com](https://heresmyguy.com)

## Features

### Multi-Vertical Directory
Browse contractors across 9 trade categories:
- Plumbers
- Electricians
- HVAC
- Roofers
- Landscapers
- Painters
- Pool Contractors
- General Contractors
- Pest Control

### Geographic Coverage
- **18 states** with contractor listings
- **500+ cities** with dedicated landing pages
- State → City → Vertical drill-down navigation

### Listing Cards
- **Free listings**: Business name, phone, rating, location, claim CTA
- **Featured listings**: Logo, description, website link, premium placement
- Avatar placeholders with business initials (navy/gold color scheme)

### Badge System
Visual trust indicators on all listings:
- **Unclaimed** - Gray badge for unclaimed listings
- **Verified Owner** - Gold badge for claimed & verified businesses
- Custom mascot badge images

### Profile Pages
Full contractor profiles with:
- Contact information (phone, address, website)
- Google rating and review count
- Claim CTA sidebar with benefits list
- Photos and Services sections (placeholder for unclaimed)
- About This Listing section
- Structured data for SEO

### Claim Your Listing
Business owners can claim their free listing:
- Verify ownership
- Add photos and services
- Display website
- Get Verified Owner badge
- Respond to reviews

### Ranking System
Listings are sorted by a fair, merit-based ranking:

| Priority | Criteria | Description |
|----------|----------|-------------|
| 1 | Featured | Paid premium placement |
| 2 | Verified | Claimed listings (first come, first served) |
| 3 | User Rank | Community voting (future feature) |
| 4 | Google Rating | Higher ratings rank first |
| 5 | Review Count | More reviews = more trusted |
| 6 | Alphabetical | Tiebreaker |

### SEO & Structured Data
- BreadcrumbList schema on all pages
- LocalBusiness schema on profiles
- ItemList schema on listing pages
- Dynamic meta titles and descriptions
- Canonical URLs

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Prisma
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **Hosting**: Vercel
- **Static Generation**: 6,900+ pre-rendered pages

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your DATABASE_URL

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file:

```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
```

## Database

### Prisma Commands

```bash
# Generate client after schema changes
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

### Import Scripts

```bash
# Import Minnesota contractors
npx tsx scripts/import-mn-contractors.ts plumbers
npx tsx scripts/import-mn-contractors.ts all

# Preview without importing
npx tsx scripts/import-mn-contractors.ts plumbers --dry-run
```

## Project Structure

```
src/
├── app/
│   ├── [state]/              # State pages
│   │   └── [city]/           # City pages
│   │       └── [vertical]/   # City + Vertical pages
│   ├── trade/
│   │   └── [vertical]/       # Trade/vertical browse pages
│   ├── profile/
│   │   └── [slug]/           # Contractor profile pages
│   ├── admin/                # Admin dashboard
│   ├── claim-listing/        # Claim listing page
│   └── page.tsx              # Homepage
├── components/
│   ├── ContractorCard.tsx    # Listing card component
│   ├── StarRating.tsx        # Star rating display
│   ├── Breadcrumbs.tsx       # Navigation breadcrumbs
│   ├── Header.tsx            # Site header
│   └── Footer.tsx            # Site footer
├── lib/
│   └── db.ts                 # Database queries & types
└── data/
    ├── featured.json         # Featured business slugs
    └── verified.json         # Verified business slugs

prisma/
├── schema.prisma             # Database schema
└── seed.ts                   # Seed script

scripts/
├── import-mn-contractors.ts  # MN CSV import
├── import-landscapers.ts     # XLSX import
└── recategorize-businesses.ts # Data cleanup
```

## Page Counts

| Page Type | Count |
|-----------|-------|
| Homepage | 1 |
| State pages | 18 |
| City pages | 500+ |
| City + Vertical pages | 880+ |
| Trade pages | 9 |
| Contractor profiles | 5,400+ |
| **Total** | **~6,900** |

## Data Sources

- Google Places API (via Outscraper)
- Manual CSV imports

## Deployment

Deployed on Vercel with automatic deploys on push to `main`.

```bash
# Manual deploy
npx vercel --prod
```

### Environment Variables on Vercel

Add in Vercel Dashboard > Settings > Environment Variables:
- `DATABASE_URL` - Neon PostgreSQL connection string

## Admin

Admin panel at `/admin` for:
- Viewing all businesses with filters
- Managing featured/verified status
- Data cleanup and categorization

## License

Private - All rights reserved

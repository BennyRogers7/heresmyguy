# MN Plumbers Directory

A directory of 676+ licensed plumbers across Minnesota. Built with Next.js, deployed on Cloudflare Pages.

**Live:** [mnplumb.com](https://mnplumb.com)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin

Manage featured plumbers at `/admin`

**Password:** `mnplumbers2024`

### To feature a plumber:

1. Go to `mnplumb.com/admin`
2. Search for the plumber
3. Click "Feature"
4. Click "Copy JSON"
5. Paste into `src/data/featured.json`
6. Commit and push

## Project Structure

```
src/
├── app/
│   ├── admin/        # Admin dashboard
│   ├── [city]/       # City pages (minneapolis, etc.)
│   ├── profile/      # Plumber profile pages
│   └── services/     # Service category pages
├── components/       # Reusable components
├── data/
│   ├── plumbers.csv  # All plumber data
│   └── featured.json # Featured plumber slugs
└── lib/
    ├── data.ts       # Data loading functions
    └── types.ts      # TypeScript types
```

## Deployment

Deploys automatically to Cloudflare Pages on push to `main`.

Build command: `npm run build`
Output directory: `out`

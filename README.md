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
- **Ranked results** - Featured plumbers first, then sorted by Google reviews

**Powered by Websimple AI**

### Directory Pages
- City pages (`/minneapolis`, `/saint-paul`, etc.)
- Service pages (`/services/drain-cleaning`, etc.)
- Individual plumber profiles (`/profile/[slug]`)

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
│   ├── admin/           # Admin dashboard
│   ├── [city]/          # City pages (minneapolis, etc.)
│   ├── profile/         # Plumber profile pages
│   └── services/        # Service category pages
├── components/
│   ├── Chat.tsx         # Main chat interface
│   ├── ChatMessage.tsx  # Chat message bubbles
│   ├── ChatResults.tsx  # Plumber results in chat
│   └── ThinkingIndicator.tsx  # Typing animation
├── data/
│   ├── plumbers.csv     # All plumber data
│   ├── featured.json    # Featured plumber slugs
│   └── verified.json    # Verified plumber slugs
└── lib/
    ├── chatFlow.ts      # Conversation state machine
    ├── matcher.ts       # Plumber matching algorithm
    ├── data.ts          # Data loading functions
    └── types.ts         # TypeScript types
```

## Chat Flow

1. User describes their plumbing issue
2. Bot responds with empathy and asks about urgency
3. User indicates if it's an emergency
4. Bot asks for location (city or zip code)
5. Bot shows top 8 matched plumbers with contact info

## Future: AI Integration

The architecture is ready for Claude/OpenAI integration via Cloudflare Workers:

1. Create a Worker at `/api/chat`
2. Replace `chatFlow.ts` logic with API calls
3. Matching and results display remain unchanged

## Deployment

Deploys automatically to Cloudflare Pages on push to `main`.

Build command: `npm run build`
Output directory: `out`

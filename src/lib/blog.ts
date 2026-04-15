/**
 * Blog Posts Configuration
 * Add new posts here - they will appear on the blog index and be accessible at /blog/[slug]
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date string
  author: string;
  category: "guides" | "news" | "tips";
  featured?: boolean;
  content: string; // Markdown content
}

// Blog posts data
export const blogPosts: BlogPost[] = [
  {
    slug: "welcome-to-heresmyguy",
    title: "Welcome to Here's My Guy",
    description:
      "We're building the contractor directory we wished existed. Here's what we're about and why we started.",
    date: "2026-04-14",
    author: "The Here's My Guy Team",
    category: "news",
    featured: true,
    content: `
# Welcome to Here's My Guy

We're thrilled to officially launch Here's My Guy — the contractor directory built on trust, not ads.

## Why We Built This

Every homeowner knows the feeling: you need a plumber, a roofer, an electrician. You ask around, search online, and hope for the best. Too often, the results are contractors who pay for placement, not the ones your neighbor actually recommends.

We built Here's My Guy to change that.

## How It Works

1. **Browse local contractors** - Find pros in your area across multiple trades
2. **See who's verified** - Claimed listings have verified owners
3. **Choose with confidence** - Real ratings, real businesses

## For Contractors

If you're a contractor, we want you here. Claiming your listing is free and takes 2 minutes. You'll get:

- A verified owner badge
- Higher placement in search results
- Stand out from unclaimed competitors

[Claim your listing now](/claim-listing)

## What's Next

We're starting in Ohio, Illinois, and Minnesota, with plans to expand nationwide. Follow along as we grow, and let us know how we can make Here's My Guy better for you.

Here's to finding great contractors the way it should be — through trust.

*— The Here's My Guy Team*
    `,
  },
  {
    slug: "how-to-choose-a-contractor",
    title: "5 Tips for Choosing the Right Contractor",
    description:
      "Not sure how to pick a contractor? Here are 5 proven tips to help you hire with confidence.",
    date: "2026-04-14",
    author: "The Here's My Guy Team",
    category: "tips",
    content: `
# 5 Tips for Choosing the Right Contractor

Hiring a contractor can feel overwhelming. Here are 5 tips to help you make the right choice.

## 1. Get Multiple Quotes

Always get at least 3 quotes for any significant project. This helps you understand the fair market rate and compare approaches.

**Pro tip:** The cheapest quote isn't always the best. Look for value, not just price.

## 2. Check Reviews and References

Look for contractors with genuine reviews from real customers. On Here's My Guy, verified listings mean the business owner has confirmed their identity.

Ask for references and actually call them. Past customers can tell you what to expect.

## 3. Verify Licenses and Insurance

Before hiring, confirm that the contractor is properly licensed for your state and carries liability insurance. This protects you if something goes wrong.

## 4. Get Everything in Writing

A detailed written contract protects both you and the contractor. It should include:

- Scope of work
- Timeline
- Payment schedule
- Materials to be used
- Warranty information

## 5. Trust Your Gut

After meeting with a contractor, ask yourself: Do I trust this person in my home? Good communication and professionalism matter.

---

Ready to find your contractor? [Browse local pros on Here's My Guy](/)
    `,
  },
  {
    slug: "why-claim-your-listing",
    title: "Why Every Contractor Should Claim Their Listing",
    description:
      "Claiming your free listing on Here's My Guy takes 2 minutes and helps you stand out. Here's why you should do it today.",
    date: "2026-04-14",
    author: "The Here's My Guy Team",
    category: "guides",
    content: `
# Why Every Contractor Should Claim Their Listing

If you're a contractor, your business might already be listed on Here's My Guy. Here's why claiming it is worth 2 minutes of your time.

## You're Already Listed

We've built our directory from public business records. If you're a licensed contractor, you're probably already here. But unclaimed listings are grayed out and appear lower in search results.

## Claiming is Free

It costs nothing to claim your listing. No credit card required. No hidden fees. Free.

## Stand Out from Competitors

When you claim your listing, you get:

- **Verified Owner badge** - Shows customers you're legitimate
- **Green highlighted listing** - Catches the eye in search results
- **Higher placement** - Appear above unclaimed competitors

## It Takes 2 Minutes

The claim process is simple:

1. Find your business
2. Verify your email
3. Done!

If your email matches our records, you're verified instantly. Otherwise, our team reviews within 24-48 hours.

## Want Even More?

For contractors who want maximum visibility, our [Founding Member](/founding-members) tier offers:

- Gold badge
- Top placement
- Featured on our Founders page
- $25/month locked forever

But even the free claimed listing is a significant upgrade over unclaimed.

---

Ready to claim? [Start here](/claim-listing)
    `,
  },
];

// Helper functions
export function getAllBlogPosts(): BlogPost[] {
  return blogPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.featured);
}

export function getPostsByCategory(category: BlogPost["category"]): BlogPost[] {
  return blogPosts
    .filter((post) => post.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE_URL = "https://heresmyguy.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/claim-listing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Get all states
  const states = await prisma.state.findMany({
    where: { businessCount: { gt: 0 } },
    select: { slug: true, updatedAt: true },
  });

  const statePages: MetadataRoute.Sitemap = states.map((state) => ({
    url: `${BASE_URL}/${state.slug}`,
    lastModified: state.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // Get all verticals
  const verticals = await prisma.vertical.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const verticalPages: MetadataRoute.Sitemap = verticals.map((vertical) => ({
    url: `${BASE_URL}/trade/${vertical.slug}`,
    lastModified: vertical.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Get all cities with businesses
  const cities = await prisma.city.findMany({
    where: { businessCount: { gt: 0 } },
    include: { state: { select: { slug: true } } },
  });

  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${BASE_URL}/${city.state.slug}/${city.slug}`,
    lastModified: city.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  // Get city + vertical combinations (for pages that exist)
  // This is more efficient than generating all combinations
  const cityVerticalCounts = await prisma.business.groupBy({
    by: ["state", "city", "verticalSlug"],
    _count: { id: true },
  });

  // Build lookup map for cities
  const cityLookup = new Map<string, { stateSlug: string; citySlug: string }>();
  for (const city of cities) {
    const key = `${city.state.slug}|${city.name.toLowerCase()}`;
    cityLookup.set(key, { stateSlug: city.state.slug, citySlug: city.slug });
  }

  // Get state abbreviation to slug mapping
  const stateAbbrevToSlug = new Map<string, string>();
  const allStates = await prisma.state.findMany({
    select: { abbreviation: true, slug: true },
  });
  for (const s of allStates) {
    stateAbbrevToSlug.set(s.abbreviation, s.slug);
  }

  // Get trade + state combinations (e.g., /trade/landscapers/minnesota)
  const verticalStateCounts = await prisma.business.groupBy({
    by: ["verticalSlug", "state"],
    _count: { id: true },
  });

  const verticalStatePages: MetadataRoute.Sitemap = [];
  for (const combo of verticalStateCounts) {
    const stateSlug = stateAbbrevToSlug.get(combo.state);
    if (!stateSlug) continue;

    verticalStatePages.push({
      url: `${BASE_URL}/trade/${combo.verticalSlug}/${stateSlug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    });
  }

  const cityVerticalPages: MetadataRoute.Sitemap = [];
  for (const combo of cityVerticalCounts) {
    const stateSlug = stateAbbrevToSlug.get(combo.state);
    if (!stateSlug) continue;

    const cityKey = `${stateSlug}|${combo.city.toLowerCase()}`;
    const cityInfo = cityLookup.get(cityKey);
    if (!cityInfo) continue;

    cityVerticalPages.push({
      url: `${BASE_URL}/${cityInfo.stateSlug}/${cityInfo.citySlug}/${combo.verticalSlug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    });
  }

  // Get all business profile pages
  const businesses = await prisma.business.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const businessPages: MetadataRoute.Sitemap = businesses.map((business) => ({
    url: `${BASE_URL}/profile/${business.slug}`,
    lastModified: business.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...statePages,
    ...verticalPages,
    ...verticalStatePages,
    ...cityPages,
    ...cityVerticalPages,
    ...businessPages,
  ];
}

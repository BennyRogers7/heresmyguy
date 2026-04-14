import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { BASE_URL, sitemapToXml, xmlResponse } from "@/lib/sitemap-utils";

async function getCitiesSitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

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

  // Get city + vertical combinations
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
  const allStates = await prisma.state.findMany({
    select: { abbreviation: true, slug: true },
  });
  const stateAbbrevToSlug = new Map(
    allStates.map((s) => [s.abbreviation, s.slug])
  );

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

  return [...cityPages, ...cityVerticalPages];
}

export async function GET(): Promise<Response> {
  const sitemap = await getCitiesSitemap();
  return xmlResponse(sitemapToXml(sitemap));
}

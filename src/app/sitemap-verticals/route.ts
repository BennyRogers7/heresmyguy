import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { BASE_URL, sitemapToXml, xmlResponse } from "@/lib/sitemap-utils";

async function getVerticalsSitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

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

  // Get state abbreviation to slug mapping
  const allStates = await prisma.state.findMany({
    select: { abbreviation: true, slug: true },
  });
  const stateAbbrevToSlug = new Map(
    allStates.map((s) => [s.abbreviation, s.slug])
  );

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

  return [...verticalPages, ...verticalStatePages];
}

export async function GET(): Promise<Response> {
  const sitemap = await getVerticalsSitemap();
  return xmlResponse(sitemapToXml(sitemap));
}

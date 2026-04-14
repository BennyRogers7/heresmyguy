import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { BASE_URL, sitemapToXml, xmlResponse } from "@/lib/sitemap-utils";

async function getStatesSitemap(): Promise<MetadataRoute.Sitemap> {
  const states = await prisma.state.findMany({
    where: { businessCount: { gt: 0 } },
    select: { slug: true, updatedAt: true },
  });

  return states.map((state) => ({
    url: `${BASE_URL}/${state.slug}`,
    lastModified: state.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));
}

export async function GET(): Promise<Response> {
  const sitemap = await getStatesSitemap();
  return xmlResponse(sitemapToXml(sitemap));
}

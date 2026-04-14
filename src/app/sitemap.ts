import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE_URL = "https://heresmyguy.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/claim-listing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const states = await prisma.state.findMany({
    where: { businessCount: { gt: 0 } },
    select: { slug: true, updatedAt: true },
  });

  const statePages: MetadataRoute.Sitemap = states.map((s) => ({
    url: `${BASE_URL}/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const verticals = await prisma.vertical.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const verticalPages: MetadataRoute.Sitemap = verticals.map((v) => ({
    url: `${BASE_URL}/trade/${v.slug}`,
    lastModified: v.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const cities = await prisma.city.findMany({
    where: { businessCount: { gt: 0 } },
    include: { state: { select: { slug: true } } },
  });

  const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${BASE_URL}/${c.state.slug}/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  return [...staticPages, ...statePages, ...verticalPages, ...cityPages];
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { BASE_URL, sitemapToXml, xmlResponse } from "@/lib/sitemap-utils";

const BUSINESSES_PER_SITEMAP = 1000;

async function getBusinessesSitemap(
  page: number
): Promise<MetadataRoute.Sitemap> {
  const businesses = await prisma.business.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    skip: (page - 1) * BUSINESSES_PER_SITEMAP,
    take: BUSINESSES_PER_SITEMAP,
  });

  return businesses.map((business) => ({
    url: `${BASE_URL}/profile/${business.slug}`,
    lastModified: business.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ page: string }> }
): Promise<Response> {
  const { page } = await params;
  const pageNum = parseInt(page, 10);

  if (isNaN(pageNum) || pageNum < 1) {
    return new Response("Invalid page number", { status: 400 });
  }

  const sitemap = await getBusinessesSitemap(pageNum);

  if (sitemap.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  return xmlResponse(sitemapToXml(sitemap));
}

export async function generateStaticParams(): Promise<{ page: string }[]> {
  const count = await prisma.business.count();
  const totalPages = Math.ceil(count / BUSINESSES_PER_SITEMAP);

  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  }));
}

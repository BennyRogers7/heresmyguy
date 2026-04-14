import { MetadataRoute } from "next";
import { BASE_URL, sitemapToXml, xmlResponse } from "@/lib/sitemap-utils";

async function getStaticSitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  return [
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
}

export async function GET(): Promise<Response> {
  const sitemap = await getStaticSitemap();
  return xmlResponse(sitemapToXml(sitemap));
}

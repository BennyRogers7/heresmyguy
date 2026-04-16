import { MetadataRoute } from "next";

const BASE_URL = "https://heresmyguy.com";

export { BASE_URL };

export function sitemapToXml(sitemap: MetadataRoute.Sitemap): string {
  const urls = sitemap
    .map((entry) => {
      const lastmod = entry.lastModified
        ? `<lastmod>${entry.lastModified instanceof Date ? entry.lastModified.toISOString() : entry.lastModified}</lastmod>`
        : "";
      const changefreq = entry.changeFrequency
        ? `<changefreq>${entry.changeFrequency}</changefreq>`
        : "";
      const priority =
        entry.priority !== undefined
          ? `<priority>${entry.priority}</priority>`
          : "";

      return `<url><loc>${entry.url}</loc>${lastmod}${changefreq}${priority}</url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

export function sitemapIndexToXml(
  sitemaps: { url: string; lastModified?: Date }[]
): string {
  const entries = sitemaps
    .map((entry) => {
      const lastmod = entry.lastModified
        ? `<lastmod>${entry.lastModified.toISOString()}</lastmod>`
        : "";
      return `<sitemap><loc>${entry.url}</loc>${lastmod}</sitemap>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</sitemapindex>`;
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

import { MetadataRoute } from "next";
import { getAllPlumbers, getAllCities } from "@/lib/data";
import { SERVICES } from "@/lib/types";
import { getAllBlogPosts } from "@/lib/blog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mnplumb.com";

  const plumbers = getAllPlumbers();
  const cities = getAllCities();
  const blogPosts = getAllBlogPosts();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/claim-listing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // City pages
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Service pages
  const servicePages: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // City + Service combo pages (top 50 cities)
  const topCities = cities.slice(0, 50);
  const cityServicePages: MetadataRoute.Sitemap = [];
  for (const city of topCities) {
    for (const service of SERVICES) {
      cityServicePages.push({
        url: `${baseUrl}/${city.slug}/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      });
    }
  }

  // Plumber profile pages
  const plumberPages: MetadataRoute.Sitemap = plumbers.map((plumber) => ({
    url: `${baseUrl}/profile/${plumber.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...blogPages,
    ...cityPages,
    ...servicePages,
    ...cityServicePages,
    ...plumberPages,
  ];
}

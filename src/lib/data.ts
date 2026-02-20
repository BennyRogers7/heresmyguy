import { readFileSync } from "fs";
import path from "path";
import { Plumber, City } from "./types";

// Load featured plumbers from JSON file
function loadFeaturedSlugs(): Set<string> {
  try {
    const featuredPath = path.join(process.cwd(), "src/data/featured.json");
    const content = readFileSync(featuredPath, "utf-8");
    const slugs: string[] = JSON.parse(content);
    return new Set(slugs);
  } catch {
    return new Set();
  }
}

// Load verified plumbers from JSON file
function loadVerifiedSlugs(): Set<string> {
  try {
    const verifiedPath = path.join(process.cwd(), "src/data/verified.json");
    const content = readFileSync(verifiedPath, "utf-8");
    const slugs: string[] = JSON.parse(content);
    return new Set(slugs);
  } catch {
    return new Set();
  }
}

const FEATURED_PLUMBER_SLUGS = loadFeaturedSlugs();
const VERIFIED_PLUMBER_SLUGS = loadVerifiedSlugs();

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function generateCitySlug(city: string): string {
  return city
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function parseCSV(): Plumber[] {
  const csvPath = path.join(process.cwd(), "src/data/plumbers.csv");
  const content = readFileSync(csvPath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim());
  const headers = lines[0].split(",").map((h) => h.trim());

  const plumbers: Plumber[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    const name = row.name || "";
    if (!name) continue;

    const services = row.services
      ? row.services.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const slug = generateSlug(name);
    plumbers.push({
      id: `plumber-${i}`,
      name,
      phone: row.phone || "",
      address: row.address || "",
      city: row.city || "",
      state: row.state || "MN",
      website: row.website || null,
      services,
      email: row.email || null,
      rating: row.rating ? parseFloat(row.rating) : null,
      slug,
      isFeatured: FEATURED_PLUMBER_SLUGS.has(slug),
      isVerified: VERIFIED_PLUMBER_SLUGS.has(slug),
    });
  }

  return plumbers;
}

let cachedPlumbers: Plumber[] | null = null;

export function getAllPlumbers(): Plumber[] {
  if (!cachedPlumbers) {
    cachedPlumbers = parseCSV();
  }
  return cachedPlumbers;
}

export function getPlumbersByCity(citySlug: string): Plumber[] {
  const plumbers = getAllPlumbers();
  return plumbers.filter(
    (p) => generateCitySlug(p.city) === citySlug
  ).sort((a, b) => {
    // Featured first, then by rating
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return (b.rating || 0) - (a.rating || 0);
  });
}

export function getPlumberBySlug(slug: string): Plumber | undefined {
  const plumbers = getAllPlumbers();
  return plumbers.find((p) => p.slug === slug);
}

export function getAllCities(): City[] {
  const plumbers = getAllPlumbers();
  const cityMap = new Map<string, { name: string; count: number }>();

  plumbers.forEach((p) => {
    const slug = generateCitySlug(p.city);
    const existing = cityMap.get(slug);
    if (existing) {
      existing.count++;
    } else {
      cityMap.set(slug, { name: p.city, count: 1 });
    }
  });

  return Array.from(cityMap.entries())
    .map(([slug, data]) => ({
      name: data.name,
      slug,
      count: data.count,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getCityBySlug(slug: string): City | undefined {
  return getAllCities().find((c) => c.slug === slug);
}

export function getTotalPlumbersCount(): number {
  return getAllPlumbers().length;
}

export function getNoWebsitePlumbers(): Plumber[] {
  return getAllPlumbers().filter((p) => !p.website);
}

export { generateCitySlug };

/**
 * Import landscapers from Outscraper XLSX file into PostgreSQL via Prisma
 *
 * Usage: npm run import:landscapers
 */

import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import * as path from "path";

const prisma = new PrismaClient();

// Path to the XLSX file
const XLSX_PATH = path.join(__dirname, "../../data/Outscraper-20260305033036s56.xlsx");

// Vertical slug for this import
const VERTICAL_SLUG = "landscapers";

interface OutscraperRow {
  name: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  state_code: string | null;
  postal_code: string | null;
  rating: number | null;
  reviews: number | null;
  logo: string | null;
  photo: string | null;
  description: string | null;
  about: string | null;
  place_id: string | null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/-+/g, "-") // Replace multiple dashes with single
    .trim();
}

function generateBusinessSlug(name: string, city: string, state: string): string {
  return slugify(`${name}-${city}-${state}`);
}

function cleanPhone(phone: unknown): string | null {
  if (!phone) return null;

  const str = String(phone).trim();

  // Handle invalid values
  const invalidValues = ["none", "false", "null", "n/a", "na", ""];
  if (invalidValues.includes(str.toLowerCase())) {
    return null;
  }

  // Remove all non-numeric characters except +
  const cleaned = str.replace(/[^\d+]/g, "");

  // Must have at least 10 digits to be a valid US phone
  const digitCount = cleaned.replace(/\D/g, "").length;
  if (digitCount < 10) {
    return null;
  }

  return cleaned;
}

function cleanEmail(email: unknown): string | null {
  if (!email) return null;

  const str = String(email).trim().toLowerCase();

  // Handle invalid values
  const invalidValues = ["none", "false", "null", "n/a", "na", ""];
  if (invalidValues.includes(str)) {
    return null;
  }

  // Basic email format check (contains @ and .)
  if (!str.includes("@") || !str.includes(".")) {
    return null;
  }

  return str;
}

function cleanWebsite(website: unknown): string | null {
  // Handle null, undefined, empty string
  if (!website) return null;

  const str = String(website).trim();

  // Handle Outscraper's various "no website" values
  const invalidValues = ["none", "false", "null", "n/a", "na", ""];
  if (invalidValues.includes(str.toLowerCase())) {
    return null;
  }

  // Ensure it has a protocol
  if (!str.startsWith("http://") && !str.startsWith("https://")) {
    return `https://${str}`;
  }

  return str;
}

async function importLandscapers() {
  console.log("Starting landscaper import...");
  console.log(`Reading file: ${XLSX_PATH}`);

  // Read XLSX file
  const workbook = XLSX.readFile(XLSX_PATH);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

  console.log(`Found ${rows.length} rows in spreadsheet`);

  // Verify the landscapers vertical exists
  const vertical = await prisma.vertical.findUnique({
    where: { slug: VERTICAL_SLUG },
  });

  if (!vertical) {
    console.error(`Vertical "${VERTICAL_SLUG}" not found. Run 'npm run db:seed' first.`);
    process.exit(1);
  }

  // Track stats
  const stats = {
    total: rows.length,
    imported: 0,
    skipped: 0,
    errors: 0,
    citiesCreated: 0,
    statesNotFound: new Set<string>(),
  };

  // Process each row
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    try {
      // Extract fields with type safety
      const name = String(row["name"] || "").trim();
      const stateCode = String(row["state_code"] || "").trim().toUpperCase();
      const cityName = String(row["city"] || "").trim();

      // Skip rows without required fields
      if (!name || !stateCode || !cityName) {
        stats.skipped++;
        continue;
      }

      // Find the state
      const state = await prisma.state.findUnique({
        where: { abbreviation: stateCode },
      });

      if (!state) {
        stats.statesNotFound.add(stateCode);
        stats.skipped++;
        continue;
      }

      // Find or create the city
      const citySlug = slugify(cityName);
      let city = await prisma.city.findUnique({
        where: {
          stateId_slug: {
            stateId: state.id,
            slug: citySlug,
          },
        },
      });

      if (!city) {
        city = await prisma.city.create({
          data: {
            name: cityName,
            slug: citySlug,
            stateId: state.id,
          },
        });
        stats.citiesCreated++;
      }

      // Generate slug
      const slug = generateBusinessSlug(name, cityName, stateCode);

      // Check for duplicate by slug
      const existing = await prisma.business.findUnique({
        where: { slug },
      });

      if (existing) {
        stats.skipped++;
        continue;
      }

      // Parse data
      const phone = cleanPhone(row["phone"]);
      const website = cleanWebsite(row["website"]);
      const email = cleanEmail(row["email"]);
      const address = row["address"] as string | null;
      const zip = row["postal_code"] as string | null;
      const rating = typeof row["rating"] === "number" ? row["rating"] : null;
      const reviewCount = typeof row["reviews"] === "number" ? row["reviews"] : 0;
      const logo = row["logo"] as string | null;
      const description = row["description"] as string | null;
      const placeId = row["place_id"] as string | null;

      // Create business
      await prisma.business.create({
        data: {
          name,
          slug,
          phone,
          email,
          address,
          city: cityName,
          state: stateCode,
          zip,
          website,
          rating,
          reviewCount,
          verticalSlug: VERTICAL_SLUG,
          hasWebsite: !!website,
          isFeatured: false,
          isClaimed: false,
          isVerified: false,
          isWomenOwned: false,
          logo,
          description,
          source: "outscraper",
          sourceId: placeId,
        },
      });

      stats.imported++;

      // Progress logging
      if ((i + 1) % 100 === 0) {
        console.log(`Progress: ${i + 1}/${rows.length} (${stats.imported} imported, ${stats.skipped} skipped)`);
      }
    } catch (error) {
      stats.errors++;
      console.error(`Error on row ${i + 1}:`, error);
    }
  }

  // Update city business counts
  console.log("\nUpdating city business counts...");
  const cities = await prisma.city.findMany();
  for (const city of cities) {
    const count = await prisma.business.count({
      where: {
        city: city.name,
        state: (await prisma.state.findUnique({ where: { id: city.stateId } }))?.abbreviation,
      },
    });
    await prisma.city.update({
      where: { id: city.id },
      data: { businessCount: count },
    });
  }

  // Update state business counts
  console.log("Updating state business counts...");
  const states = await prisma.state.findMany();
  for (const state of states) {
    const count = await prisma.business.count({
      where: { state: state.abbreviation },
    });
    await prisma.state.update({
      where: { id: state.id },
      data: { businessCount: count },
    });
  }

  // Print summary
  console.log("\n========== Import Complete ==========");
  console.log(`Total rows:      ${stats.total}`);
  console.log(`Imported:        ${stats.imported}`);
  console.log(`Skipped:         ${stats.skipped}`);
  console.log(`Errors:          ${stats.errors}`);
  console.log(`Cities created:  ${stats.citiesCreated}`);

  if (stats.statesNotFound.size > 0) {
    console.log(`\nStates not found: ${Array.from(stats.statesNotFound).join(", ")}`);
  }

  // Print breakdown by state
  console.log("\n--- Businesses by State ---");
  const stateBreakdown = await prisma.business.groupBy({
    by: ["state"],
    _count: { state: true },
    orderBy: { _count: { state: "desc" } },
  });

  for (const s of stateBreakdown) {
    console.log(`  ${s.state}: ${s._count.state}`);
  }
}

importLandscapers()
  .catch((e) => {
    console.error("Import failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

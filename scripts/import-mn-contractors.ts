/**
 * Import Minnesota contractors from CSV files into PostgreSQL via Prisma
 *
 * Usage:
 *   npx tsx scripts/import-mn-contractors.ts plumbers      # Import just plumbers
 *   npx tsx scripts/import-mn-contractors.ts all           # Import all verticals
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// CSV file mappings
const CSV_FILES: Record<string, string> = {
  plumbers: "mn_plumbers.csv",
  electricians: "mn_electricians.csv",
  hvac: "mn_hvac.csv",
  painters: "mn_painters.csv",
  roofers: "mn_roofers.csv",
  landscapers: "mn_landscapers.csv",
};

// State code for all imports
const STATE_CODE = "MN";

interface CsvRow {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  website: string;
  services: string;
  email: string;
  rating: string;
  vertical: string;
  source: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function generateBusinessSlug(name: string, city: string, state: string): string {
  return slugify(`${name}-${city}-${state}`);
}

function cleanPhone(phone: unknown): string | null {
  if (!phone) return null;

  const str = String(phone).trim();
  const invalidValues = ["none", "false", "null", "n/a", "na", ""];
  if (invalidValues.includes(str.toLowerCase())) {
    return null;
  }

  const cleaned = str.replace(/[^\d+]/g, "");
  const digitCount = cleaned.replace(/\D/g, "").length;
  if (digitCount < 10) {
    return null;
  }

  return cleaned;
}

function cleanEmail(email: unknown): string | null {
  if (!email) return null;

  const str = String(email).trim().toLowerCase();
  const invalidValues = ["none", "false", "null", "n/a", "na", ""];
  if (invalidValues.includes(str)) {
    return null;
  }

  if (!str.includes("@") || !str.includes(".")) {
    return null;
  }

  return str;
}

function cleanWebsite(website: unknown): string | null {
  if (!website) return null;

  const str = String(website).trim();
  const invalidValues = ["none", "false", "null", "n/a", "na", ""];
  if (invalidValues.includes(str.toLowerCase())) {
    return null;
  }

  if (!str.startsWith("http://") && !str.startsWith("https://")) {
    return `https://${str}`;
  }

  return str;
}

function parseCSV(content: string): CsvRow[] {
  const lines = content.split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle quoted fields with commas
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
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

    rows.push(row as unknown as CsvRow);
  }

  return rows;
}

async function importVertical(verticalSlug: string, dryRun: boolean = false) {
  const csvFile = CSV_FILES[verticalSlug];
  if (!csvFile) {
    console.error(`Unknown vertical: ${verticalSlug}`);
    return;
  }

  const csvPath = path.join(__dirname, "../../data", csvFile);

  if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`);
    return;
  }

  console.log(`\n========== Importing ${verticalSlug} ==========`);
  console.log(`Reading file: ${csvPath}`);

  const content = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCSV(content);

  console.log(`Found ${rows.length} rows in CSV`);

  // Verify vertical exists
  const vertical = await prisma.vertical.findUnique({
    where: { slug: verticalSlug },
  });

  if (!vertical) {
    console.error(`Vertical "${verticalSlug}" not found in database.`);
    console.log("Available verticals:");
    const verticals = await prisma.vertical.findMany({ select: { slug: true } });
    verticals.forEach((v) => console.log(`  - ${v.slug}`));
    return;
  }

  // Find MN state
  const state = await prisma.state.findUnique({
    where: { abbreviation: STATE_CODE },
  });

  if (!state) {
    console.error(`State "${STATE_CODE}" not found. Run seed first.`);
    return;
  }

  // Track stats
  const stats = {
    total: rows.length,
    imported: 0,
    skipped: 0,
    duplicates: 0,
    errors: 0,
    citiesCreated: 0,
  };

  // Preview first 5 rows in dry run
  if (dryRun) {
    console.log("\n--- Preview (first 5 rows) ---");
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      const row = rows[i];
      console.log(`\n[${i + 1}] ${row.name}`);
      console.log(`    City: ${row.city}, State: ${row.state}`);
      console.log(`    Phone: ${row.phone}`);
      console.log(`    Website: ${row.website || "(none)"}`);
      console.log(`    Rating: ${row.rating || "(none)"}`);
    }
    console.log("\n--- End Preview ---");
    console.log(`\nDry run complete. ${rows.length} rows would be imported.`);
    return stats;
  }

  // Process each row
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    try {
      const name = row.name?.trim();
      const cityName = row.city?.trim();

      if (!name || !cityName) {
        stats.skipped++;
        continue;
      }

      // Find or create city
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
      const slug = generateBusinessSlug(name, cityName, STATE_CODE);

      // Check for duplicate
      const existing = await prisma.business.findUnique({
        where: { slug },
      });

      if (existing) {
        stats.duplicates++;
        continue;
      }

      // Parse data
      const phone = cleanPhone(row.phone);
      const website = cleanWebsite(row.website);
      const email = cleanEmail(row.email);
      const rating = row.rating ? parseFloat(row.rating) : null;

      // Extract address parts
      const fullAddress = row.address?.trim() || null;

      // Create business
      await prisma.business.create({
        data: {
          name,
          slug,
          phone,
          email,
          address: fullAddress,
          city: cityName,
          state: STATE_CODE,
          zip: null,
          website,
          rating: rating && !isNaN(rating) ? rating : null,
          reviewCount: 0,
          verticalSlug,
          hasWebsite: !!website,
          isFeatured: false,
          isClaimed: false,
          isVerified: false,
          isWomenOwned: false,
          logo: null,
          description: null,
          source: "google_places",
          sourceId: null,
        },
      });

      stats.imported++;

      // Progress logging
      if ((i + 1) % 100 === 0) {
        console.log(`Progress: ${i + 1}/${rows.length} (${stats.imported} imported)`);
      }
    } catch (error) {
      stats.errors++;
      console.error(`Error on row ${i + 1}:`, error);
    }
  }

  console.log(`\nImported ${stats.imported} ${verticalSlug}`);
  console.log(`Skipped: ${stats.skipped}, Duplicates: ${stats.duplicates}, Errors: ${stats.errors}`);
  console.log(`Cities created: ${stats.citiesCreated}`);

  return stats;
}

async function updateCounts() {
  console.log("\nUpdating city business counts...");
  const cities = await prisma.city.findMany({
    include: { state: true },
  });

  for (const city of cities) {
    const count = await prisma.business.count({
      where: {
        city: city.name,
        state: city.state.abbreviation,
      },
    });
    await prisma.city.update({
      where: { id: city.id },
      data: { businessCount: count },
    });
  }

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
}

async function main() {
  const args = process.argv.slice(2);
  const vertical = args[0];
  const dryRun = args.includes("--dry-run") || args.includes("-d");

  if (!vertical) {
    console.log("Usage: npx tsx scripts/import-mn-contractors.ts <vertical> [--dry-run]");
    console.log("\nAvailable verticals:");
    Object.keys(CSV_FILES).forEach((v) => console.log(`  - ${v}`));
    console.log("  - all (import all verticals)");
    console.log("\nOptions:");
    console.log("  --dry-run, -d    Preview data without importing");
    process.exit(1);
  }

  if (dryRun) {
    console.log("=== DRY RUN MODE ===\n");
  }

  if (vertical === "all") {
    for (const v of Object.keys(CSV_FILES)) {
      await importVertical(v, dryRun);
    }
  } else {
    await importVertical(vertical, dryRun);
  }

  if (!dryRun) {
    await updateCounts();

    // Print final breakdown
    console.log("\n========== Final Summary ==========");
    const breakdown = await prisma.business.groupBy({
      by: ["verticalSlug"],
      where: { state: STATE_CODE },
      _count: { verticalSlug: true },
      orderBy: { _count: { verticalSlug: "desc" } },
    });

    console.log(`\nMinnesota businesses by vertical:`);
    for (const b of breakdown) {
      console.log(`  ${b.verticalSlug}: ${b._count.verticalSlug}`);
    }

    const totalMN = await prisma.business.count({ where: { state: STATE_CODE } });
    console.log(`\nTotal MN businesses: ${totalMN}`);
  }
}

main()
  .catch((e) => {
    console.error("Import failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * Import Midwest contractors from CSV files into PostgreSQL via Prisma
 *
 * This script:
 * 1. Combines all midwest CSV files into one master dataset
 * 2. Deduplicates on phone number (primary) and name+city (fallback)
 * 3. Removes records already in the database
 * 4. Cleans data: phone format (XXX) XXX-XXXX, strips UTM params, removes CLOSED_PERMANENTLY
 * 5. Splits into import_ready and no_website_leads files
 * 6. Imports clean records into the database
 *
 * Usage:
 *   npx tsx scripts/import-midwest-contractors.ts              # Full import
 *   npx tsx scripts/import-midwest-contractors.ts --dry-run    # Preview only
 *   npx tsx scripts/import-midwest-contractors.ts --skip-import # Process files but don't import to DB
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// CSV files to process (on Desktop)
const DESKTOP_PATH = path.join(process.env.HOME || "", "Desktop");
const CSV_FILES = [
  "midwest_electricians_full.csv",
  "midwest_general-contractors_full.csv",
  "midwest_hvac_full.csv",
  "midwest_landscapers_full.csv",
  "midwest_painters_full.csv",
  "midwest_pest-control_full.csv",
  "midwest_plumbers_full.csv",
  "midwest_pool-contractors_full.csv",
  "midwest_roofers_full.csv",
];

// Output files
const OUTPUT_DIR = DESKTOP_PATH;
const IMPORT_READY_FILE = "midwest_import_ready.csv";
const NO_WEBSITE_FILE = "midwest_no_website_leads.csv";

interface CsvRow {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  website: string;
  rating: string;
  vertical: string;
  source: string;
}

interface CleanedRecord {
  name: string;
  phone: string | null;
  address: string | null;
  city: string;
  state: string;
  website: string | null;
  rating: number | null;
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

/**
 * Format phone to (XXX) XXX-XXXX
 */
function formatPhone(phone: unknown): string | null {
  if (!phone) return null;

  const str = String(phone).trim();
  const invalidValues = ["none", "false", "null", "n/a", "na", ""];
  if (invalidValues.includes(str.toLowerCase())) {
    return null;
  }

  // Extract just digits
  const digits = str.replace(/\D/g, "");

  // Handle country code
  let cleanDigits = digits;
  if (digits.length === 11 && digits.startsWith("1")) {
    cleanDigits = digits.slice(1);
  }

  if (cleanDigits.length !== 10) {
    return null;
  }

  // Format as (XXX) XXX-XXXX
  return `(${cleanDigits.slice(0, 3)}) ${cleanDigits.slice(3, 6)}-${cleanDigits.slice(6)}`;
}

/**
 * Strip UTM parameters from URLs
 */
function cleanWebsite(website: unknown): string | null {
  if (!website) return null;

  const str = String(website).trim();
  const invalidValues = ["none", "false", "null", "n/a", "na", ""];
  if (invalidValues.includes(str.toLowerCase())) {
    return null;
  }

  try {
    let url = str;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }

    const parsed = new URL(url);

    // Remove UTM parameters
    const utmParams = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    utmParams.forEach(param => parsed.searchParams.delete(param));

    // Also remove common tracking params
    const trackingParams = ["fbclid", "gclid", "ref", "source", "mc_cid", "mc_eid"];
    trackingParams.forEach(param => parsed.searchParams.delete(param));

    // Return cleaned URL
    let cleanUrl = parsed.toString();

    // Remove trailing slash if it's just the domain
    if (cleanUrl.endsWith("/") && parsed.pathname === "/") {
      cleanUrl = cleanUrl.slice(0, -1);
    }

    return cleanUrl;
  } catch {
    // If URL parsing fails, return as-is with https prefix
    if (!str.startsWith("http://") && !str.startsWith("https://")) {
      return `https://${str}`;
    }
    return str;
  }
}

/**
 * Map vertical names to slug format
 */
function normalizeVertical(vertical: string): string {
  const mapping: Record<string, string> = {
    "electricians": "electricians",
    "general-contractors": "general-contractors",
    "hvac": "hvac",
    "landscapers": "landscapers",
    "painters": "painters",
    "pest-control": "pest-control",
    "plumbers": "plumbers",
    "pool-contractors": "pool-contractors",
    "roofers": "roofers",
  };

  const normalized = vertical.toLowerCase().trim();
  return mapping[normalized] || normalized;
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

function writeCSV(filepath: string, records: CleanedRecord[]): void {
  const headers = ["name", "phone", "address", "city", "state", "website", "rating", "vertical", "source"];

  const lines = [headers.join(",")];

  for (const record of records) {
    const values = headers.map(h => {
      const val = record[h as keyof CleanedRecord];
      if (val === null || val === undefined) return "";
      const str = String(val);
      // Quote if contains comma or quotes
      if (str.includes(",") || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });
    lines.push(values.join(","));
  }

  fs.writeFileSync(filepath, lines.join("\n"), "utf-8");
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run") || args.includes("-d");
  const skipImport = args.includes("--skip-import");

  console.log("========================================");
  console.log("Midwest Contractors Import Script");
  console.log("========================================\n");

  if (dryRun) {
    console.log("*** DRY RUN MODE - No changes will be made ***\n");
  }

  // ==========================================================================
  // STEP 1: Combine all CSV files
  // ==========================================================================
  console.log("STEP 1: Combining CSV files...\n");

  const allRows: CsvRow[] = [];

  for (const filename of CSV_FILES) {
    const filepath = path.join(DESKTOP_PATH, filename);

    if (!fs.existsSync(filepath)) {
      console.log(`  ⚠️  File not found: ${filename}`);
      continue;
    }

    const content = fs.readFileSync(filepath, "utf-8");
    const rows = parseCSV(content);
    console.log(`  ✓ ${filename}: ${rows.length} records`);
    allRows.push(...rows);
  }

  console.log(`\n  Total raw records: ${allRows.length}\n`);

  // ==========================================================================
  // STEP 2: Clean data and filter CLOSED_PERMANENTLY
  // ==========================================================================
  console.log("STEP 2: Cleaning data and filtering...\n");

  let removedClosed = 0;
  let removedInvalidName = 0;
  let removedInvalidCity = 0;

  const cleanedRecords: CleanedRecord[] = [];

  for (const row of allRows) {
    const name = row.name?.trim();
    const city = row.city?.trim();

    // Skip if missing required fields
    if (!name) {
      removedInvalidName++;
      continue;
    }

    if (!city) {
      removedInvalidCity++;
      continue;
    }

    // Skip CLOSED_PERMANENTLY businesses (check name field)
    if (name.toUpperCase().includes("CLOSED_PERMANENTLY") ||
        name.toUpperCase().includes("PERMANENTLY CLOSED")) {
      removedClosed++;
      continue;
    }

    // Clean data
    const phone = formatPhone(row.phone);
    const website = cleanWebsite(row.website);
    const rating = row.rating ? parseFloat(row.rating) : null;

    cleanedRecords.push({
      name,
      phone,
      address: row.address?.trim() || null,
      city,
      state: row.state?.trim().toUpperCase() || "",
      website,
      rating: rating && !isNaN(rating) ? rating : null,
      vertical: normalizeVertical(row.vertical || ""),
      source: row.source?.trim() || "google_places",
    });
  }

  console.log(`  Removed - CLOSED_PERMANENTLY: ${removedClosed}`);
  console.log(`  Removed - Invalid name: ${removedInvalidName}`);
  console.log(`  Removed - Invalid city: ${removedInvalidCity}`);
  console.log(`  Records after cleaning: ${cleanedRecords.length}\n`);

  // ==========================================================================
  // STEP 3: Deduplicate (phone primary, name+city fallback)
  // ==========================================================================
  console.log("STEP 3: Deduplicating records...\n");

  const seenPhones = new Set<string>();
  const seenNameCity = new Set<string>();
  let duplicatesByPhone = 0;
  let duplicatesByNameCity = 0;

  const uniqueRecords: CleanedRecord[] = [];

  for (const record of cleanedRecords) {
    // Primary dedup: phone
    if (record.phone) {
      if (seenPhones.has(record.phone)) {
        duplicatesByPhone++;
        continue;
      }
      seenPhones.add(record.phone);
    }

    // Fallback dedup: name + city (for records without phone)
    const nameCityKey = `${record.name.toLowerCase()}|${record.city.toLowerCase()}`;
    if (seenNameCity.has(nameCityKey)) {
      duplicatesByNameCity++;
      continue;
    }
    seenNameCity.add(nameCityKey);

    uniqueRecords.push(record);
  }

  console.log(`  Duplicates removed by phone: ${duplicatesByPhone}`);
  console.log(`  Duplicates removed by name+city: ${duplicatesByNameCity}`);
  console.log(`  Unique records: ${uniqueRecords.length}\n`);

  // ==========================================================================
  // STEP 4: Remove records already in database
  // ==========================================================================
  console.log("STEP 4: Checking against existing database records...\n");

  // Get all existing phones and name+city combos from database
  const existingBusinesses = await prisma.business.findMany({
    select: {
      phone: true,
      name: true,
      city: true,
    },
  });

  console.log(`  Existing businesses in database: ${existingBusinesses.length}`);

  const dbPhones = new Set<string>();
  const dbNameCity = new Set<string>();

  for (const biz of existingBusinesses) {
    if (biz.phone) {
      // Normalize phone for comparison
      const normalizedPhone = formatPhone(biz.phone);
      if (normalizedPhone) {
        dbPhones.add(normalizedPhone);
      }
    }
    const nameCityKey = `${biz.name.toLowerCase()}|${biz.city.toLowerCase()}`;
    dbNameCity.add(nameCityKey);
  }

  let removedExistingByPhone = 0;
  let removedExistingByNameCity = 0;

  const newRecords: CleanedRecord[] = [];

  for (const record of uniqueRecords) {
    // Check phone
    if (record.phone && dbPhones.has(record.phone)) {
      removedExistingByPhone++;
      continue;
    }

    // Check name+city
    const nameCityKey = `${record.name.toLowerCase()}|${record.city.toLowerCase()}`;
    if (dbNameCity.has(nameCityKey)) {
      removedExistingByNameCity++;
      continue;
    }

    newRecords.push(record);
  }

  console.log(`  Already in DB (by phone): ${removedExistingByPhone}`);
  console.log(`  Already in DB (by name+city): ${removedExistingByNameCity}`);
  console.log(`  New records to import: ${newRecords.length}\n`);

  // ==========================================================================
  // STEP 5: Split into import_ready and no_website_leads
  // ==========================================================================
  console.log("STEP 5: Splitting output files...\n");

  const importReady = newRecords;
  const noWebsiteLeads = newRecords.filter(r => !r.website);

  console.log(`  All clean records (midwest_import_ready.csv): ${importReady.length}`);
  console.log(`  No website leads (midwest_no_website_leads.csv): ${noWebsiteLeads.length}`);

  if (!dryRun) {
    writeCSV(path.join(OUTPUT_DIR, IMPORT_READY_FILE), importReady);
    writeCSV(path.join(OUTPUT_DIR, NO_WEBSITE_FILE), noWebsiteLeads);
    console.log(`\n  ✓ Files written to ${OUTPUT_DIR}`);
  } else {
    console.log(`\n  (Dry run - files not written)`);
  }

  // ==========================================================================
  // STEP 6: Import to database
  // ==========================================================================
  if (!dryRun && !skipImport) {
    console.log("\n\nSTEP 6: Importing to database...\n");

    // Get all states and verticals
    const states = await prisma.state.findMany();
    const stateMap = new Map(states.map(s => [s.abbreviation, s]));

    const verticals = await prisma.vertical.findMany();
    const verticalSlugs = new Set(verticals.map(v => v.slug));

    // Track stats
    const stats = {
      imported: 0,
      skippedNoState: 0,
      skippedNoVertical: 0,
      duplicateSlugs: 0,
      errors: 0,
      citiesCreated: 0,
    };

    // City cache
    const cityCache = new Map<string, string>();

    for (let i = 0; i < importReady.length; i++) {
      const record = importReady[i];

      try {
        // Verify state exists
        const state = stateMap.get(record.state);
        if (!state) {
          stats.skippedNoState++;
          continue;
        }

        // Verify vertical exists
        if (!verticalSlugs.has(record.vertical)) {
          stats.skippedNoVertical++;
          continue;
        }

        // Find or create city
        const cityKey = `${record.city}|${record.state}`;
        let cityId = cityCache.get(cityKey);

        if (!cityId) {
          const citySlug = slugify(record.city);
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
                name: record.city,
                slug: citySlug,
                stateId: state.id,
              },
            });
            stats.citiesCreated++;
          }

          cityCache.set(cityKey, city.id);
          cityId = city.id;
        }

        // Generate unique slug
        let slug = generateBusinessSlug(record.name, record.city, record.state);
        let slugAttempt = 0;

        while (true) {
          const testSlug = slugAttempt === 0 ? slug : `${slug}-${slugAttempt}`;
          const existing = await prisma.business.findUnique({
            where: { slug: testSlug },
          });

          if (!existing) {
            slug = testSlug;
            break;
          }

          slugAttempt++;
          if (slugAttempt > 10) {
            stats.duplicateSlugs++;
            break;
          }
        }

        if (slugAttempt > 10) continue;

        // Create business
        await prisma.business.create({
          data: {
            name: record.name,
            slug,
            phone: record.phone,
            email: null,
            address: record.address,
            city: record.city,
            state: record.state,
            zip: null,
            website: record.website,
            rating: record.rating,
            reviewCount: 0,
            verticalSlug: record.vertical,
            hasWebsite: !!record.website,
            isFeatured: false,
            isClaimed: false,
            isVerified: false,
            isWomenOwned: false,
            logo: null,
            description: null,
            source: record.source,
            sourceId: null,
          },
        });

        stats.imported++;

        // Progress logging
        if ((i + 1) % 500 === 0) {
          console.log(`  Progress: ${i + 1}/${importReady.length} (${stats.imported} imported)`);
        }
      } catch (error) {
        stats.errors++;
        if (stats.errors <= 5) {
          console.error(`  Error on record ${i + 1}:`, error);
        }
      }
    }

    console.log(`\n  ✓ Import complete!`);
    console.log(`    Imported: ${stats.imported}`);
    console.log(`    Skipped (no state): ${stats.skippedNoState}`);
    console.log(`    Skipped (no vertical): ${stats.skippedNoVertical}`);
    console.log(`    Duplicate slugs: ${stats.duplicateSlugs}`);
    console.log(`    Errors: ${stats.errors}`);
    console.log(`    Cities created: ${stats.citiesCreated}`);

    // Update counts
    console.log("\n  Updating city and state business counts...");

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

    for (const state of states) {
      const count = await prisma.business.count({
        where: { state: state.abbreviation },
      });
      await prisma.state.update({
        where: { id: state.id },
        data: { businessCount: count },
      });
    }

    console.log("  ✓ Counts updated");
  } else if (skipImport) {
    console.log("\n\nSTEP 6: Skipped (--skip-import flag)");
  } else {
    console.log("\n\nSTEP 6: Skipped (dry run)");
  }

  // ==========================================================================
  // Summary
  // ==========================================================================
  console.log("\n========================================");
  console.log("SUMMARY");
  console.log("========================================");
  console.log(`Raw records from CSVs: ${allRows.length}`);
  console.log(`After cleaning: ${cleanedRecords.length}`);
  console.log(`After deduplication: ${uniqueRecords.length}`);
  console.log(`New records (not in DB): ${newRecords.length}`);
  console.log(`No-website leads: ${noWebsiteLeads.length}`);

  if (!dryRun) {
    console.log(`\nOutput files:`);
    console.log(`  ${path.join(OUTPUT_DIR, IMPORT_READY_FILE)}`);
    console.log(`  ${path.join(OUTPUT_DIR, NO_WEBSITE_FILE)}`);
  }

  // Show vertical breakdown
  console.log("\nBy vertical:");
  const byVertical = new Map<string, number>();
  for (const r of newRecords) {
    byVertical.set(r.vertical, (byVertical.get(r.vertical) || 0) + 1);
  }
  for (const [v, count] of Array.from(byVertical.entries()).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${v}: ${count}`);
  }

  // Show state breakdown
  console.log("\nBy state:");
  const byState = new Map<string, number>();
  for (const r of newRecords) {
    byState.set(r.state, (byState.get(r.state) || 0) + 1);
  }
  for (const [s, count] of Array.from(byState.entries()).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${s}: ${count}`);
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

/**
 * Import Outscraper enrichment data (emails, social links) into existing Business records
 *
 * This script:
 * 1. Reads CSV from ~/Desktop/outreach/heresmyguy/oh_il_enriched_full.csv
 * 2. Matches to existing businesses by website URL (primary) or name+city+state (fallback)
 * 3. Updates only empty fields - never overwrites existing data
 * 4. Logs statistics: total processed, matched, updated, unmatched
 *
 * Usage:
 *   npx tsx scripts/import-enrichment-data.ts              # Full import
 *   npx tsx scripts/import-enrichment-data.ts --dry-run    # Preview only
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// CSV file path
const DESKTOP_PATH = path.join(process.env.HOME || "", "Desktop");
const CSV_FILE = path.join(DESKTOP_PATH, "outreach", "heresmyguy", "oh_il_enriched_full.csv");

interface CsvRow {
  name: string;
  phone: string;
  website: string;
  city: string;
  state: string;
  vertical: string;
  email_1: string;
  email_2: string;
  email_3: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
  youtube: string;
  twitter: string;
}

interface UpdateFields {
  email?: string;
  email2?: string;
  email3?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
}

/**
 * Normalize URL for matching
 * Removes protocol, www, trailing slash, and query params
 */
function normalizeUrl(url: string): string {
  if (!url) return "";
  let n = url.toLowerCase().trim();

  // Remove protocol
  n = n.replace(/^https?:\/\//, "");

  // Remove www.
  n = n.replace(/^www\./, "");

  // Remove trailing slash
  n = n.replace(/\/$/, "");

  // Remove query string
  n = n.split("?")[0];

  // Remove hash
  n = n.split("#")[0];

  return n;
}

/**
 * Clean string value - return null if empty/invalid
 */
function cleanValue(val: unknown): string | null {
  if (!val) return null;
  const str = String(val).trim();
  const invalidValues = ["none", "false", "null", "n/a", "na", "undefined", ""];
  if (invalidValues.includes(str.toLowerCase())) {
    return null;
  }
  return str;
}

/**
 * Parse CSV content into rows
 */
function parseCSV(content: string): CsvRow[] {
  const lines = content.split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/ /g, "_"));

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
        values.push(current.trim().replace(/^"|"$/g, ""));
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ""));

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    rows.push(row as unknown as CsvRow);
  }

  return rows;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run") || args.includes("-d");

  console.log("========================================");
  console.log("Import Enrichment Data Script");
  console.log("========================================\n");

  if (dryRun) {
    console.log("*** DRY RUN MODE - No changes will be made ***\n");
  }

  // Check if CSV exists
  if (!fs.existsSync(CSV_FILE)) {
    console.error(`CSV file not found: ${CSV_FILE}`);
    process.exit(1);
  }

  // ==========================================================================
  // STEP 1: Load existing businesses and build lookup maps
  // ==========================================================================
  console.log("STEP 1: Loading existing businesses...\n");

  const businesses = await prisma.business.findMany({
    select: {
      id: true,
      name: true,
      city: true,
      state: true,
      website: true,
      email: true,
      email2: true,
      email3: true,
      facebook: true,
      instagram: true,
      linkedin: true,
      tiktok: true,
      youtube: true,
      twitter: true,
    },
  });

  console.log(`  Loaded ${businesses.length} businesses from database\n`);

  // Build lookup maps
  const websiteMap = new Map<string, string>(); // normalized_url -> business_id
  const nameCityStateMap = new Map<string, string>(); // "name|city|state" -> business_id

  for (const biz of businesses) {
    // Website map (primary match)
    if (biz.website) {
      const normalizedUrl = normalizeUrl(biz.website);
      if (normalizedUrl) {
        websiteMap.set(normalizedUrl, biz.id);
      }
    }

    // Name+city+state map (fallback match)
    const key = `${biz.name.toLowerCase()}|${biz.city.toLowerCase()}|${biz.state.toLowerCase()}`;
    nameCityStateMap.set(key, biz.id);
  }

  console.log(`  Website lookup map: ${websiteMap.size} entries`);
  console.log(`  Name+city+state lookup map: ${nameCityStateMap.size} entries\n`);

  // Create reverse lookup to get business data by ID
  const businessById = new Map(businesses.map(b => [b.id, b]));

  // ==========================================================================
  // STEP 2: Read and parse CSV
  // ==========================================================================
  console.log("STEP 2: Reading CSV file...\n");

  const csvContent = fs.readFileSync(CSV_FILE, "utf-8");
  const csvRows = parseCSV(csvContent);

  console.log(`  Parsed ${csvRows.length} rows from CSV\n`);

  // ==========================================================================
  // STEP 3: Match and update
  // ==========================================================================
  console.log("STEP 3: Matching and updating businesses...\n");

  const stats = {
    total: 0,
    matchedByWebsite: 0,
    matchedByName: 0,
    updated: 0,
    noUpdatesNeeded: 0,
    unmatched: 0,
  };

  const unmatchedRows: CsvRow[] = [];

  for (const row of csvRows) {
    stats.total++;

    let businessId: string | null = null;
    let matchType = "";

    // Try website match first
    if (row.website) {
      const normalizedUrl = normalizeUrl(row.website);
      if (normalizedUrl && websiteMap.has(normalizedUrl)) {
        businessId = websiteMap.get(normalizedUrl)!;
        matchType = "website";
        stats.matchedByWebsite++;
      }
    }

    // Fallback to name+city+state
    if (!businessId && row.name && row.city && row.state) {
      const key = `${row.name.toLowerCase()}|${row.city.toLowerCase()}|${row.state.toLowerCase()}`;
      if (nameCityStateMap.has(key)) {
        businessId = nameCityStateMap.get(key)!;
        matchType = "name+city+state";
        stats.matchedByName++;
      }
    }

    if (!businessId) {
      stats.unmatched++;
      unmatchedRows.push(row);
      continue;
    }

    // Get current business data
    const business = businessById.get(businessId);
    if (!business) continue;

    // Build update object - only fill empty fields
    const updates: UpdateFields = {};

    // Emails
    if (!business.email && cleanValue(row.email_1)) {
      updates.email = cleanValue(row.email_1)!;
    }
    if (!business.email2 && cleanValue(row.email_2)) {
      updates.email2 = cleanValue(row.email_2)!;
    }
    if (!business.email3 && cleanValue(row.email_3)) {
      updates.email3 = cleanValue(row.email_3)!;
    }

    // Social media
    if (!business.facebook && cleanValue(row.facebook)) {
      updates.facebook = cleanValue(row.facebook)!;
    }
    if (!business.instagram && cleanValue(row.instagram)) {
      updates.instagram = cleanValue(row.instagram)!;
    }
    if (!business.linkedin && cleanValue(row.linkedin)) {
      updates.linkedin = cleanValue(row.linkedin)!;
    }
    if (!business.tiktok && cleanValue(row.tiktok)) {
      updates.tiktok = cleanValue(row.tiktok)!;
    }
    if (!business.youtube && cleanValue(row.youtube)) {
      updates.youtube = cleanValue(row.youtube)!;
    }
    if (!business.twitter && cleanValue(row.twitter)) {
      updates.twitter = cleanValue(row.twitter)!;
    }

    // Apply updates if any
    if (Object.keys(updates).length > 0) {
      if (!dryRun) {
        await prisma.business.update({
          where: { id: businessId },
          data: updates,
        });
      }
      stats.updated++;

      // Update local cache for subsequent matches
      Object.assign(business, updates);
    } else {
      stats.noUpdatesNeeded++;
    }

    // Progress logging
    if (stats.total % 1000 === 0) {
      console.log(`  Progress: ${stats.total}/${csvRows.length}`);
    }
  }

  // ==========================================================================
  // STEP 4: Summary
  // ==========================================================================
  console.log("\n========================================");
  console.log("SUMMARY");
  console.log("========================================");
  console.log(`Total CSV rows: ${stats.total}`);
  console.log(`Matched by website: ${stats.matchedByWebsite}`);
  console.log(`Matched by name+city+state: ${stats.matchedByName}`);
  console.log(`Total matched: ${stats.matchedByWebsite + stats.matchedByName}`);
  console.log(`Updated (had new data): ${stats.updated}`);
  console.log(`No updates needed (fields already filled): ${stats.noUpdatesNeeded}`);
  console.log(`Unmatched: ${stats.unmatched}`);

  // Log some unmatched examples
  if (unmatchedRows.length > 0) {
    console.log("\nSample unmatched rows (first 10):");
    for (let i = 0; i < Math.min(10, unmatchedRows.length); i++) {
      const row = unmatchedRows[i];
      console.log(`  - ${row.name} | ${row.city}, ${row.state} | ${row.website || "(no website)"}`);
    }
  }

  if (dryRun) {
    console.log("\n*** DRY RUN - No changes were made ***");
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

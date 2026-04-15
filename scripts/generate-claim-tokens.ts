/**
 * Generate unique claim tokens for businesses in OH, IL, MN
 *
 * This script:
 * 1. Queries unclaimed businesses in OH, IL, MN without tokens
 * 2. Generates cryptographically secure 24-character hex tokens
 * 3. Updates each business with a unique token
 * 4. Reports statistics
 *
 * Usage:
 *   npx tsx scripts/generate-claim-tokens.ts              # Generate tokens
 *   npx tsx scripts/generate-claim-tokens.ts --dry-run    # Preview only
 */

import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

// Target states for outreach
const TARGET_STATES = ["OH", "IL", "MN"];

/**
 * Generate a cryptographically secure 24-character hex token
 * 12 bytes = 24 hex chars = 96 bits of entropy
 */
function generateSecureToken(): string {
  return randomBytes(12).toString("hex");
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run") || args.includes("-d");

  console.log("========================================");
  console.log("Generate Claim Tokens Script");
  console.log("========================================\n");

  if (dryRun) {
    console.log("*** DRY RUN MODE - No changes will be made ***\n");
  }

  console.log(`Target states: ${TARGET_STATES.join(", ")}\n`);

  // ==========================================================================
  // STEP 1: Find businesses that need tokens
  // ==========================================================================
  console.log("STEP 1: Finding businesses without tokens...\n");

  const businesses = await prisma.business.findMany({
    where: {
      state: { in: TARGET_STATES },
      claimToken: null,
      isClaimed: false,
    },
    select: {
      id: true,
      name: true,
      city: true,
      state: true,
    },
  });

  console.log(`  Found ${businesses.length} unclaimed businesses without tokens\n`);

  // Breakdown by state
  const byState = new Map<string, number>();
  for (const biz of businesses) {
    byState.set(biz.state, (byState.get(biz.state) || 0) + 1);
  }
  console.log("  Breakdown by state:");
  for (const state of TARGET_STATES) {
    console.log(`    ${state}: ${byState.get(state) || 0}`);
  }
  console.log("");

  if (businesses.length === 0) {
    console.log("No businesses need tokens. Done.");
    return;
  }

  // ==========================================================================
  // STEP 2: Generate and assign tokens
  // ==========================================================================
  console.log("STEP 2: Generating tokens...\n");

  const usedTokens = new Set<string>();
  let generated = 0;
  let errors = 0;

  for (let i = 0; i < businesses.length; i++) {
    const business = businesses[i];

    try {
      // Generate unique token
      let token: string;
      let attempts = 0;
      do {
        token = generateSecureToken();
        attempts++;
        if (attempts > 100) {
          throw new Error("Could not generate unique token after 100 attempts");
        }
      } while (usedTokens.has(token));

      usedTokens.add(token);

      // Update business
      if (!dryRun) {
        await prisma.business.update({
          where: { id: business.id },
          data: { claimToken: token },
        });
      }

      generated++;

      // Progress logging
      if ((i + 1) % 1000 === 0) {
        console.log(`  Progress: ${i + 1}/${businesses.length} (${generated} generated)`);
      }
    } catch (error) {
      errors++;
      if (errors <= 5) {
        console.error(`  Error generating token for ${business.name}: ${error}`);
      }
    }
  }

  // ==========================================================================
  // STEP 3: Summary
  // ==========================================================================
  console.log("\n========================================");
  console.log("SUMMARY");
  console.log("========================================");
  console.log(`Total businesses processed: ${businesses.length}`);
  console.log(`Tokens generated: ${generated}`);
  console.log(`Errors: ${errors}`);

  if (dryRun) {
    console.log("\n*** DRY RUN - No changes were made ***");
  } else {
    // Verify token count
    const tokenCount = await prisma.business.count({
      where: {
        state: { in: TARGET_STATES },
        claimToken: { not: null },
      },
    });
    console.log(`\nVerification: ${tokenCount} businesses now have tokens`);
  }

  // Show sample token format
  console.log(`\nSample token format: ${generateSecureToken()}`);
  console.log(`Claim URL format: /claim-listing/token?token=[token]`);
}

main()
  .catch((e) => {
    console.error("Token generation failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

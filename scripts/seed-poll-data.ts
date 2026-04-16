/**
 * Seed Poll Data Script
 *
 * Seeds the StatePoll table with realistic baseline data so the
 * heatmap and thermometers look alive on launch.
 *
 * Usage:
 *   npx tsx scripts/seed-poll-data.ts --dry-run  # Preview without inserting
 *   npx tsx scripts/seed-poll-data.ts            # Run the seed
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// State populations (from state-launch-config.ts)
const STATE_POPULATIONS: Record<string, number> = {
  AL: 5108468, AK: 733406, AZ: 7431344, AR: 3067732, CA: 38965193,
  CO: 5877610, CT: 3617176, DE: 1031890, FL: 23372215, GA: 11029227,
  HI: 1435138, ID: 1964726, IL: 12549689, IN: 6862199, IA: 3207004,
  KS: 2940546, KY: 4526154, LA: 4573749, ME: 1395722, MD: 6180253,
  MA: 7001399, MI: 10037261, MN: 5737915, MS: 2939690, MO: 6196156,
  MT: 1132812, NE: 1978379, NV: 3194176, NH: 1402054, NJ: 9290841,
  NM: 2114371, NY: 19571216, NC: 10835491, ND: 783926, OH: 11785935,
  OK: 4053824, OR: 4233358, PA: 12961683, RI: 1095962, SC: 5373555,
  SD: 919318, TN: 7126489, TX: 30503301, UT: 3417734, VT: 647464,
  VA: 8683619, WA: 7812880, WV: 1770071, WI: 5910955, WY: 584057,
};

// Major cities per state (for weighted city votes)
const STATE_MAJOR_CITIES: Record<string, string[]> = {
  AL: ["Birmingham", "Montgomery", "Huntsville", "Mobile", "Tuscaloosa"],
  AK: ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan"],
  AZ: ["Phoenix", "Tucson", "Mesa", "Scottsdale", "Chandler", "Gilbert"],
  AR: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro"],
  CA: ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Oakland", "Fresno"],
  CO: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Boulder", "Lakewood"],
  CT: ["Bridgeport", "New Haven", "Hartford", "Stamford", "Waterbury"],
  DE: ["Wilmington", "Dover", "Newark", "Middletown", "Bear"],
  FL: ["Miami", "Tampa", "Orlando", "Jacksonville", "Fort Lauderdale", "St. Petersburg"],
  GA: ["Atlanta", "Augusta", "Savannah", "Columbus", "Macon", "Athens"],
  HI: ["Honolulu", "Pearl City", "Hilo", "Kailua", "Waipahu"],
  ID: ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello"],
  IL: ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford", "Springfield"],
  IN: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel"],
  IA: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City"],
  KS: ["Wichita", "Overland Park", "Kansas City", "Olathe", "Topeka"],
  KY: ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington"],
  LA: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles"],
  ME: ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn"],
  MD: ["Baltimore", "Frederick", "Rockville", "Gaithersburg", "Bowie"],
  MA: ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell"],
  MI: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor", "Lansing"],
  MN: ["Minneapolis", "St. Paul", "Rochester", "Duluth", "Bloomington"],
  MS: ["Jackson", "Gulfport", "Southaven", "Biloxi", "Hattiesburg"],
  MO: ["Kansas City", "St. Louis", "Springfield", "Columbia", "Independence"],
  MT: ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte"],
  NE: ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"],
  NV: ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks"],
  NH: ["Manchester", "Nashua", "Concord", "Derry", "Dover"],
  NJ: ["Newark", "Jersey City", "Paterson", "Elizabeth", "Edison", "Trenton"],
  NM: ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell"],
  NY: ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany"],
  NC: ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem", "Fayetteville"],
  ND: ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo"],
  OH: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton"],
  OK: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond"],
  OR: ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro", "Bend"],
  PA: ["Philadelphia", "Pittsburgh", "Allentown", "Reading", "Erie", "Harrisburg"],
  RI: ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence"],
  SC: ["Charleston", "Columbia", "North Charleston", "Mount Pleasant", "Greenville"],
  SD: ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown"],
  TN: ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville"],
  TX: ["Houston", "Dallas", "San Antonio", "Austin", "Fort Worth", "El Paso"],
  UT: ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem"],
  VT: ["Burlington", "South Burlington", "Rutland", "Barre", "Montpelier"],
  VA: ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News", "Alexandria"],
  WA: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue", "Kent"],
  WV: ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling"],
  WI: ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine"],
  WY: ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs"],
};

// Project types with weights (higher = more common)
const PROJECT_TYPES = [
  { name: "Roofing", weight: 20 },
  { name: "Kitchen remodel", weight: 18 },
  { name: "Bathroom remodel", weight: 17 },
  { name: "HVAC", weight: 15 },
  { name: "Plumbing", weight: 14 },
  { name: "Electrical", weight: 10 },
  { name: "Landscaping", weight: 8 },
  { name: "Painting", weight: 7 },
  { name: "Flooring", weight: 6 },
  { name: "Windows/Doors", weight: 5 },
  { name: "Deck/Patio", weight: 4 },
  { name: "Siding", weight: 3 },
  { name: "Fencing", weight: 2 },
];

// Budget options with weights (bell curve around middle values)
const BUDGET_OPTIONS = [
  { name: "Under $1,000", weight: 5 },
  { name: "$1,000 - $5,000", weight: 15 },
  { name: "$5,000 - $15,000", weight: 30 },
  { name: "$15,000 - $50,000", weight: 28 },
  { name: "$50,000 - $100,000", weight: 15 },
  { name: "Over $100,000", weight: 7 },
];

// Hiring priorities with weights
const HIRING_PRIORITIES = [
  { name: "Quality of work", weight: 25 },
  { name: "Local reputation", weight: 22 },
  { name: "Licensed and insured", weight: 20 },
  { name: "Price", weight: 12 },
  { name: "Availability", weight: 10 },
  { name: "Communication", weight: 8 },
  { name: "Warranty offered", weight: 3 },
];

// State tiers for seeding percentages
const LAUNCHING_MAY_15 = ["IL", "OH"]; // 95% of threshold
const LAUNCHING_JUNE_15 = ["TX", "FL"]; // 90% of threshold
const LIVE_STATES = ["MN"]; // Skip entirely

// Top 10 by population (excluding launching states)
const TOP_10_POP = ["CA", "NY", "PA", "GA", "NC", "MI"];
// Next 10 by population
const NEXT_10_POP = ["NJ", "VA", "WA", "AZ", "MA", "TN", "IN", "MD", "MO", "WI"];
// Next 15 by population (excluding MN which is live)
const NEXT_15_POP = ["CO", "SC", "AL", "LA", "KY", "OR", "OK", "CT", "UT", "IA", "NV", "AR", "MS", "KS"];
// Bottom 15 by population
const BOTTOM_15_POP = ["NE", "ID", "NM", "WV", "HI", "NH", "ME", "MT", "RI", "DE", "SD", "ND", "AK", "VT", "WY"];

/**
 * Calculate launch threshold (0.001% of population)
 */
function calculateThreshold(population: number): number {
  return Math.ceil(population * 0.00001);
}

/**
 * Get a random number with some variance
 */
function randomWithVariance(base: number, variancePercent: number): number {
  const variance = base * (variancePercent / 100);
  return Math.round(base + (Math.random() * variance * 2) - variance);
}

/**
 * Weighted random selection from an array
 */
function weightedRandom<T extends { name: string; weight: number }>(items: T[]): string {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item.name;
    }
  }
  return items[items.length - 1].name;
}

/**
 * Get weighted random city (first cities in list are more likely)
 */
function getRandomCity(state: string): string {
  const cities = STATE_MAJOR_CITIES[state] || ["Unknown City"];
  // Weight toward earlier (larger) cities
  const weights = cities.map((_, i) => Math.pow(cities.length - i, 1.5));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < cities.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return cities[i];
    }
  }
  return cities[0];
}

/**
 * Generate random projects (1-3 projects per vote)
 */
function getRandomProjects(): string[] {
  const numProjects = Math.random() < 0.5 ? 1 : Math.random() < 0.7 ? 2 : 3;
  const projects: string[] = [];

  while (projects.length < numProjects) {
    const project = weightedRandom(PROJECT_TYPES);
    if (!projects.includes(project)) {
      projects.push(project);
    }
  }

  return projects;
}

/**
 * Generate random hiring priorities (1-2 priorities per vote)
 */
function getRandomPriorities(): string[] {
  const numPriorities = Math.random() < 0.4 ? 1 : 2;
  const priorities: string[] = [];

  while (priorities.length < numPriorities) {
    const priority = weightedRandom(HIRING_PRIORITIES);
    if (!priorities.includes(priority)) {
      priorities.push(priority);
    }
  }

  return priorities;
}

/**
 * Get target percentage for a state based on its tier
 */
function getTargetPercentage(state: string): number {
  if (LIVE_STATES.includes(state)) {
    return 0; // Skip live states
  }
  if (LAUNCHING_MAY_15.includes(state)) {
    return randomWithVariance(95, 3); // 92-98%
  }
  if (LAUNCHING_JUNE_15.includes(state)) {
    return randomWithVariance(90, 4); // 86-94%
  }
  if (TOP_10_POP.includes(state)) {
    return randomWithVariance(50, 20); // 40-60%
  }
  if (NEXT_10_POP.includes(state)) {
    return randomWithVariance(32, 22); // 25-40%
  }
  if (NEXT_15_POP.includes(state)) {
    return randomWithVariance(20, 25); // 15-25%
  }
  if (BOTTOM_15_POP.includes(state)) {
    return randomWithVariance(10, 50); // 5-15%
  }
  // Default fallback
  return randomWithVariance(15, 30);
}

/**
 * Generate a single poll record
 */
function generatePollRecord(state: string): {
  state: string;
  cityVote: string | null;
  projects: string[];
  budget: string | null;
  hiringPriorities: string[];
  recommendedContractorName: string | null;
  recommendedContractorCity: string | null;
  recommendedContractorWork: string | null;
  email: string | null;
  completedSteps: number;
  ipHash: string | null;
} {
  // Determine how many steps they completed (weighted toward completing more)
  const stepsRoll = Math.random();
  let completedSteps: number;
  if (stepsRoll < 0.1) completedSteps = 1;
  else if (stepsRoll < 0.2) completedSteps = 2;
  else if (stepsRoll < 0.35) completedSteps = 3;
  else if (stepsRoll < 0.6) completedSteps = 4;
  else if (stepsRoll < 0.8) completedSteps = 5;
  else completedSteps = 6;

  return {
    state,
    cityVote: completedSteps >= 1 ? getRandomCity(state) : null,
    projects: completedSteps >= 2 ? getRandomProjects() : [],
    budget: completedSteps >= 3 ? weightedRandom(BUDGET_OPTIONS) : null,
    hiringPriorities: completedSteps >= 4 ? getRandomPriorities() : [],
    recommendedContractorName: null, // Leave blank for seeded data
    recommendedContractorCity: null,
    recommendedContractorWork: null,
    email: null, // Leave blank for seeded data
    completedSteps,
    ipHash: `seed_${state}_${Math.random().toString(36).substring(7)}`,
  };
}

/**
 * Main seed function
 */
async function seedPollData(dryRun: boolean = false) {
  console.log(dryRun ? "\n=== DRY RUN MODE ===" : "\n=== SEEDING POLL DATA ===");
  console.log("Launch threshold = 0.001% of state population\n");

  // Check if data already exists
  const existingCount = await prisma.statePoll.count();
  if (existingCount > 0) {
    console.log(`Found ${existingCount} existing poll records.`);
    if (!dryRun) {
      console.log("To re-seed, first delete existing records with:");
      console.log("  npx prisma db execute --stdin <<< 'DELETE FROM \"StatePoll\" WHERE \"ipHash\" LIKE \\'seed_%\\';'");
      console.log("\nAborting to prevent duplicates.");
      return;
    }
  }

  const allStates = Object.keys(STATE_POPULATIONS);
  const statesToSeed = allStates.filter(s => !LIVE_STATES.includes(s));

  let totalRecords = 0;
  const stateStats: { state: string; votes: number; threshold: number; percent: number }[] = [];

  for (const state of statesToSeed) {
    const population = STATE_POPULATIONS[state];
    const threshold = calculateThreshold(population);
    const targetPercent = getTargetPercentage(state);
    const targetVotes = Math.round(threshold * (targetPercent / 100));

    if (targetVotes === 0) continue;

    stateStats.push({
      state,
      votes: targetVotes,
      threshold,
      percent: targetPercent,
    });

    if (!dryRun) {
      // Generate poll records
      const records = [];
      for (let i = 0; i < targetVotes; i++) {
        records.push(generatePollRecord(state));
      }

      // Insert in batches of 500
      const batchSize = 500;
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        await prisma.statePoll.createMany({ data: batch });
      }
    }

    totalRecords += targetVotes;
  }

  // Sort by percentage for display
  stateStats.sort((a, b) => b.percent - a.percent);

  console.log("State breakdown:\n");
  console.log("State | Votes | Threshold | Percent");
  console.log("------|-------|-----------|--------");

  for (const stat of stateStats) {
    const tier = LAUNCHING_MAY_15.includes(stat.state) ? " (May 15)" :
                 LAUNCHING_JUNE_15.includes(stat.state) ? " (Jun 15)" :
                 TOP_10_POP.includes(stat.state) ? " (Top 10)" :
                 NEXT_10_POP.includes(stat.state) ? " (Next 10)" :
                 NEXT_15_POP.includes(stat.state) ? " (Next 15)" :
                 " (Bottom)";
    console.log(
      `${stat.state.padEnd(5)} | ${stat.votes.toString().padStart(5)} | ${stat.threshold.toString().padStart(9)} | ${stat.percent.toFixed(1).padStart(5)}%${tier}`
    );
  }

  console.log("\n-----------------------------------");
  console.log(`Total records: ${totalRecords.toLocaleString()}`);

  if (dryRun) {
    console.log("\nThis was a dry run. No data was inserted.");
    console.log("Run without --dry-run to insert records.");
  } else {
    console.log("\nPoll data seeded successfully!");
  }
}

// Parse command line args
const dryRun = process.argv.includes("--dry-run");

seedPollData(dryRun)
  .catch((e) => {
    console.error("Error seeding poll data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

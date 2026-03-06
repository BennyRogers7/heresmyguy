import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// All US states
const states = [
  { name: "Alabama", abbreviation: "AL" },
  { name: "Alaska", abbreviation: "AK" },
  { name: "Arizona", abbreviation: "AZ" },
  { name: "Arkansas", abbreviation: "AR" },
  { name: "California", abbreviation: "CA" },
  { name: "Colorado", abbreviation: "CO" },
  { name: "Connecticut", abbreviation: "CT" },
  { name: "Delaware", abbreviation: "DE" },
  { name: "Florida", abbreviation: "FL" },
  { name: "Georgia", abbreviation: "GA" },
  { name: "Hawaii", abbreviation: "HI" },
  { name: "Idaho", abbreviation: "ID" },
  { name: "Illinois", abbreviation: "IL" },
  { name: "Indiana", abbreviation: "IN" },
  { name: "Iowa", abbreviation: "IA" },
  { name: "Kansas", abbreviation: "KS" },
  { name: "Kentucky", abbreviation: "KY" },
  { name: "Louisiana", abbreviation: "LA" },
  { name: "Maine", abbreviation: "ME" },
  { name: "Maryland", abbreviation: "MD" },
  { name: "Massachusetts", abbreviation: "MA" },
  { name: "Michigan", abbreviation: "MI" },
  { name: "Minnesota", abbreviation: "MN" },
  { name: "Mississippi", abbreviation: "MS" },
  { name: "Missouri", abbreviation: "MO" },
  { name: "Montana", abbreviation: "MT" },
  { name: "Nebraska", abbreviation: "NE" },
  { name: "Nevada", abbreviation: "NV" },
  { name: "New Hampshire", abbreviation: "NH" },
  { name: "New Jersey", abbreviation: "NJ" },
  { name: "New Mexico", abbreviation: "NM" },
  { name: "New York", abbreviation: "NY" },
  { name: "North Carolina", abbreviation: "NC" },
  { name: "North Dakota", abbreviation: "ND" },
  { name: "Ohio", abbreviation: "OH" },
  { name: "Oklahoma", abbreviation: "OK" },
  { name: "Oregon", abbreviation: "OR" },
  { name: "Pennsylvania", abbreviation: "PA" },
  { name: "Rhode Island", abbreviation: "RI" },
  { name: "South Carolina", abbreviation: "SC" },
  { name: "South Dakota", abbreviation: "SD" },
  { name: "Tennessee", abbreviation: "TN" },
  { name: "Texas", abbreviation: "TX" },
  { name: "Utah", abbreviation: "UT" },
  { name: "Vermont", abbreviation: "VT" },
  { name: "Virginia", abbreviation: "VA" },
  { name: "Washington", abbreviation: "WA" },
  { name: "West Virginia", abbreviation: "WV" },
  { name: "Wisconsin", abbreviation: "WI" },
  { name: "Wyoming", abbreviation: "WY" },
  { name: "District of Columbia", abbreviation: "DC" },
];

// Contractor verticals
const verticals = [
  {
    name: "Landscapers",
    slug: "landscapers",
    nameSingular: "Landscaper",
    icon: "🌿",
    description: "Professional landscaping, lawn care, and outdoor services",
    sortOrder: 1,
  },
  {
    name: "Roofers",
    slug: "roofers",
    nameSingular: "Roofer",
    icon: "🏠",
    description: "Roof installation, repair, and maintenance services",
    sortOrder: 2,
  },
  {
    name: "Electricians",
    slug: "electricians",
    nameSingular: "Electrician",
    icon: "⚡",
    description: "Electrical installation, repair, and maintenance services",
    sortOrder: 3,
  },
  {
    name: "HVAC",
    slug: "hvac",
    nameSingular: "HVAC Technician",
    icon: "❄️",
    description: "Heating, ventilation, and air conditioning services",
    sortOrder: 4,
  },
  {
    name: "Painters",
    slug: "painters",
    nameSingular: "Painter",
    icon: "🎨",
    description: "Interior and exterior painting services",
    sortOrder: 5,
  },
  {
    name: "Plumbers",
    slug: "plumbers",
    nameSingular: "Plumber",
    icon: "🔧",
    description: "Plumbing installation, repair, and maintenance services",
    sortOrder: 6,
  },
];

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

async function main() {
  console.log("Seeding database...");

  // Seed verticals
  console.log("Seeding verticals...");
  for (const vertical of verticals) {
    await prisma.vertical.upsert({
      where: { slug: vertical.slug },
      update: vertical,
      create: vertical,
    });
  }
  console.log(`  Created ${verticals.length} verticals`);

  // Seed states
  console.log("Seeding states...");
  for (const state of states) {
    await prisma.state.upsert({
      where: { abbreviation: state.abbreviation },
      update: {
        name: state.name,
        slug: slugify(state.name),
      },
      create: {
        name: state.name,
        slug: slugify(state.name),
        abbreviation: state.abbreviation,
      },
    });
  }
  console.log(`  Created ${states.length} states`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Types matching Prisma schema
export type Business = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string;
  state: string;
  zip: string | null;
  website: string | null;
  rating: number | null;
  reviewCount: number;
  verticalSlug: string;
  hasWebsite: boolean;
  isFeatured: boolean;
  isClaimed: boolean;
  isVerified: boolean;
  isWomenOwned: boolean;
  rank: number;
  claimedAt: Date | null;
  logo: string | null;
  description: string | null;
};

export type StateInfo = {
  id: string;
  name: string;
  slug: string;
  abbreviation: string;
  businessCount: number;
};

export type CityInfo = {
  id: string;
  name: string;
  slug: string;
  stateId: string;
  businessCount: number;
};

export type VerticalInfo = {
  id: string;
  name: string;
  slug: string;
  nameSingular: string;
  icon: string | null;
  description: string | null;
};

// Data fetching functions
export async function getBusinessesByCityAndVertical(
  stateSlug: string,
  citySlug: string,
  verticalSlug: string
): Promise<Business[]> {
  const state = await prisma.state.findUnique({
    where: { slug: stateSlug },
  });

  if (!state) return [];

  const businesses = await prisma.business.findMany({
    where: {
      state: state.abbreviation,
      verticalSlug,
    },
    orderBy: [
      { isFeatured: "desc" },      // 1. Featured (paid) first
      { isClaimed: "desc" },       // 2. Verified (claimed) before unclaimed
      { claimedAt: "asc" },        // 3. First come, first served for verified
      { rank: "desc" },            // 4. User rank (future feature)
      { rating: "desc" },          // 5. Google rating
      { reviewCount: "desc" },     // 6. More reviews = more trusted
      { name: "asc" },             // 7. Alphabetical tiebreaker
    ],
  });

  // Filter by city slug match (case-insensitive)
  return businesses.filter(
    (b) => b.city.toLowerCase().replace(/\s+/g, "-") === citySlug
  );
}

export async function getStateBySlug(slug: string): Promise<StateInfo | null> {
  return prisma.state.findUnique({
    where: { slug },
  });
}

export async function getCityBySlug(
  stateSlug: string,
  citySlug: string
): Promise<CityInfo | null> {
  const state = await prisma.state.findUnique({
    where: { slug: stateSlug },
  });

  if (!state) return null;

  return prisma.city.findUnique({
    where: {
      stateId_slug: {
        stateId: state.id,
        slug: citySlug,
      },
    },
  });
}

export async function getVerticalBySlug(slug: string): Promise<VerticalInfo | null> {
  return prisma.vertical.findUnique({
    where: { slug },
  });
}

export async function getAllStates(): Promise<StateInfo[]> {
  return prisma.state.findMany({
    where: { businessCount: { gt: 0 } },
    orderBy: { businessCount: "desc" },
  });
}

export async function getCitiesByState(stateSlug: string): Promise<CityInfo[]> {
  const state = await prisma.state.findUnique({
    where: { slug: stateSlug },
  });

  if (!state) return [];

  return prisma.city.findMany({
    where: {
      stateId: state.id,
      businessCount: { gt: 0 },
    },
    orderBy: { businessCount: "desc" },
  });
}

export async function getAllVerticals(): Promise<VerticalInfo[]> {
  return prisma.vertical.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  return prisma.business.findUnique({
    where: { slug },
  });
}

// For static generation
export async function getAllCityVerticalPaths(): Promise<
  { state: string; city: string; vertical: string }[]
> {
  const businesses = await prisma.business.findMany({
    select: {
      city: true,
      state: true,
      verticalSlug: true,
    },
    distinct: ["city", "state", "verticalSlug"],
  });

  const states = await prisma.state.findMany();
  const stateMap = new Map(states.map((s) => [s.abbreviation, s.slug]));

  return businesses
    .filter((b) => stateMap.has(b.state))
    .map((b) => ({
      state: stateMap.get(b.state)!,
      city: b.city.toLowerCase().replace(/\s+/g, "-"),
      vertical: b.verticalSlug,
    }));
}

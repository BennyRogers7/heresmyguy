import { Plumber, UserIntent } from './types';

export interface MatchResult {
  plumbers: Plumber[];
  matchedService: string | null;
  city: string;
}

// Keywords that indicate emergency services
const EMERGENCY_KEYWORDS = ['emergency', '24/7', '24 hour', 'urgent', '24-hour'];

function plumberOffersEmergency(plumber: Plumber): boolean {
  const servicesText = plumber.services.map((s) => s.toLowerCase()).join(' ');
  return EMERGENCY_KEYWORDS.some((keyword) => servicesText.includes(keyword.toLowerCase()));
}

function generateCitySlug(city: string): string {
  return city
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Sort: featured first, then by rating (Google reviews)
function comparePlumbers(a: Plumber, b: Plumber): number {
  // Featured plumbers always first
  if (a.isFeatured && !b.isFeatured) return -1;
  if (!a.isFeatured && b.isFeatured) return 1;

  // Then sort by rating (highest first)
  const ratingA = a.rating || 0;
  const ratingB = b.rating || 0;
  if (ratingB !== ratingA) return ratingB - ratingA;

  // Verified as tiebreaker
  if (a.isVerified && !b.isVerified) return -1;
  if (!a.isVerified && b.isVerified) return 1;

  return 0;
}

export function matchPlumbers(
  intent: UserIntent,
  allPlumbers: Plumber[],
  limit = 8
): MatchResult {
  const citySlug = intent.citySlug;
  const city = intent.city || '';

  if (!citySlug) {
    return {
      plumbers: [],
      matchedService: null,
      city: '',
    };
  }

  // Filter plumbers by city
  let plumbers = allPlumbers.filter(
    (p) => generateCitySlug(p.city) === citySlug
  );

  // If emergency, filter to only plumbers offering emergency services
  if (intent.isEmergency) {
    const emergencyPlumbers = plumbers.filter(plumberOffersEmergency);
    // Only filter if we have emergency plumbers, otherwise show all
    if (emergencyPlumbers.length > 0) {
      plumbers = emergencyPlumbers;
    }
  }

  // Sort: featured first, then by rating
  plumbers.sort(comparePlumbers);

  // Return top matches
  return {
    plumbers: plumbers.slice(0, limit),
    matchedService: intent.isEmergency ? 'Emergency Plumbing' : null,
    city,
  };
}

export function getAlternativeCities(
  currentCitySlug: string,
  allCities: { name: string; slug: string; count: number }[]
): { name: string; slug: string; count: number }[] {
  return allCities
    .filter((c) => c.slug !== currentCitySlug)
    .slice(0, 5);
}

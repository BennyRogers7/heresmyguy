// ZIP code configuration for Minneapolis/St. Paul neighborhoods and suburban corrections

// Minneapolis neighborhoods by ZIP code
export const MINNEAPOLIS_NEIGHBORHOODS: Record<string, string[]> = {
  'Northeast': ['55413', '55414', '55418'],
  'Downtown': ['55401', '55402', '55403', '55404', '55415'],
  'Uptown': ['55408'],
  'South': ['55406', '55407', '55417', '55419'],
  'Southwest': ['55409', '55410'],
  'North': ['55411', '55412'],
};

// Saint Paul neighborhoods by ZIP code
export const ST_PAUL_NEIGHBORHOODS: Record<string, string[]> = {
  'Downtown': ['55101', '55102'],
  'Highland': ['55116'],
  'Hamline-University': ['55104', '55105'],
  'East Side': ['55103', '55106', '55119', '55130'],
  'West Side': ['55107'],
};

// Suburban ZIP codes that should be corrected from Minneapolis/St. Paul to their actual city
export const SUBURB_ZIP_TO_CITY: Record<string, string> = {
  // Plymouth
  '55441': 'Plymouth',
  '55442': 'Plymouth',
  '55447': 'Plymouth',
  '55449': 'Plymouth',
  // Crystal
  '55428': 'Crystal',
  '55429': 'Crystal',
  // St. Louis Park
  '55426': 'St. Louis Park',
  // Osseo
  '55369': 'Osseo',
  // Fridley
  '55432': 'Fridley',
  '55433': 'Fridley',
  '55434': 'Fridley',
  // Richfield
  '55423': 'Richfield',
  '55431': 'Richfield',
  // Shoreview
  '55112': 'Shoreview',
  '55113': 'Shoreview',
  '55126': 'Shoreview',
  // Golden Valley
  '55416': 'Golden Valley',
  '55427': 'Golden Valley',
  // Columbia Heights
  '55421': 'Columbia Heights',
  // Bloomington
  '55420': 'Bloomington',
  '55437': 'Bloomington',
  '55438': 'Bloomington',
  // Burnsville
  '55337': 'Burnsville',
  // White Bear Lake
  '55110': 'White Bear Lake',
  '55115': 'White Bear Lake',
  // Roseville
  '55117': 'Roseville',
  // Eagan
  '55121': 'Eagan',
  '55122': 'Eagan',
  '55123': 'Eagan',
  '55124': 'Eagan',
  // Woodbury
  '55125': 'Woodbury',
  '55128': 'Woodbury',
  '55129': 'Woodbury',
  // Vadnais Heights
  '55127': 'Vadnais Heights',
  // Lake Elmo / Stillwater area
  '55042': 'Lake Elmo',
  '55055': 'Stillwater',
  // Brooklyn Park
  '55443': 'Brooklyn Park',
  '55444': 'Brooklyn Park',
  '55445': 'Brooklyn Park',
  // Brooklyn Center
  '55430': 'Brooklyn Center',
  // Coon Rapids
  '55448': 'Coon Rapids',
  // Circle Pines
  '55014': 'Circle Pines',
  // Andover
  '55304': 'Andover',
  // Eden Prairie
  '55344': 'Eden Prairie',
  '55346': 'Eden Prairie',
  '55347': 'Eden Prairie',
  // Wayzata
  '55391': 'Wayzata',
  // Hopkins
  '55305': 'Hopkins',
  '55343': 'Hopkins',
  // Champlin
  '55316': 'Champlin',
  // Maple Grove
  '55311': 'Maple Grove',
  // Anoka
  '55303': 'Anoka',
  // Maplewood
  '55109': 'Maplewood',
  // Hugo
  '55038': 'Hugo',
  // Rosemount
  '55068': 'Rosemount',
  // South St. Paul
  '55075': 'South St. Paul',
  // Mendota Heights
  '55120': 'Mendota Heights',
  // Inver Grove Heights
  '55076': 'Inver Grove Heights',
  '55077': 'Inver Grove Heights',
  // Cottage Grove
  '55016': 'Cottage Grove',
  // North St. Paul
  '55090': 'North St. Paul',
  // Lakeville
  '55044': 'Lakeville',
  // Farmington
  '55024': 'Farmington',
};

// All Minneapolis proper ZIP codes (for neighborhoods)
export const MINNEAPOLIS_ZIPS = new Set(
  Object.values(MINNEAPOLIS_NEIGHBORHOODS).flat()
);

// All Saint Paul proper ZIP codes (for neighborhoods)
export const ST_PAUL_ZIPS = new Set(
  Object.values(ST_PAUL_NEIGHBORHOODS).flat()
);

// Helper: Extract ZIP code from address string
export function extractZipFromAddress(address: string): string | null {
  // Match 5-digit ZIP code pattern (Minnesota ZIPs start with 55 or 56)
  const match = address.match(/\b(55\d{3}|56\d{3})\b/);
  return match ? match[1] : null;
}

// Helper: Get neighborhood name for a Minneapolis ZIP
export function getMinneapolisNeighborhood(zip: string): string | null {
  for (const [neighborhood, zips] of Object.entries(MINNEAPOLIS_NEIGHBORHOODS)) {
    if (zips.includes(zip)) {
      return neighborhood;
    }
  }
  return null;
}

// Helper: Get neighborhood name for a St. Paul ZIP
export function getStPaulNeighborhood(zip: string): string | null {
  for (const [neighborhood, zips] of Object.entries(ST_PAUL_NEIGHBORHOODS)) {
    if (zips.includes(zip)) {
      return neighborhood;
    }
  }
  return null;
}

// Helper: Get corrected city for a suburban ZIP
export function getSuburbCity(zip: string): string | null {
  return SUBURB_ZIP_TO_CITY[zip] || null;
}

// Helper: Determine the display city/neighborhood for a plumber based on ZIP
export interface CityResolution {
  city: string;
  neighborhood?: string;
  isNeighborhood: boolean;
}

export function resolveCityFromZip(zip: string, originalCity: string): CityResolution {
  // Check if it's a suburban ZIP that needs correction
  const suburbCity = getSuburbCity(zip);
  if (suburbCity) {
    return {
      city: suburbCity,
      isNeighborhood: false,
    };
  }

  // Check if it's a Minneapolis proper ZIP
  if (MINNEAPOLIS_ZIPS.has(zip)) {
    const neighborhood = getMinneapolisNeighborhood(zip);
    if (neighborhood) {
      return {
        city: `Minneapolis ${neighborhood}`,
        neighborhood,
        isNeighborhood: true,
      };
    }
  }

  // Check if it's a St. Paul proper ZIP
  if (ST_PAUL_ZIPS.has(zip)) {
    const neighborhood = getStPaulNeighborhood(zip);
    if (neighborhood) {
      return {
        city: `St. Paul ${neighborhood}`,
        neighborhood,
        isNeighborhood: true,
      };
    }
  }

  // Return original city if no mapping found
  return {
    city: originalCity,
    isNeighborhood: false,
  };
}

// Generate slug for city/neighborhood
export function generateLocationSlug(city: string): string {
  return city
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Get all neighborhood entries for static generation
export interface NeighborhoodEntry {
  name: string;
  slug: string;
  parentCity: 'Minneapolis' | 'Saint Paul';
  zips: string[];
}

export function getAllNeighborhoods(): NeighborhoodEntry[] {
  const neighborhoods: NeighborhoodEntry[] = [];

  for (const [name, zips] of Object.entries(MINNEAPOLIS_NEIGHBORHOODS)) {
    neighborhoods.push({
      name: `Minneapolis ${name}`,
      slug: generateLocationSlug(`Minneapolis ${name}`),
      parentCity: 'Minneapolis',
      zips,
    });
  }

  for (const [name, zips] of Object.entries(ST_PAUL_NEIGHBORHOODS)) {
    neighborhoods.push({
      name: `St. Paul ${name}`,
      slug: generateLocationSlug(`St. Paul ${name}`),
      parentCity: 'Saint Paul',
      zips,
    });
  }

  return neighborhoods;
}

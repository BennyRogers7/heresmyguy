/**
 * State Launch Configuration
 * Defines which states are live, launching soon, or coming soon.
 * Launch threshold is 0.001% of state population.
 */

export type LaunchStatus = "live" | "launching" | "coming_soon";

export interface StateLaunchInfo {
  status: LaunchStatus;
  launchDate?: string; // ISO date for launching states
  population: number;
  launchThreshold: number; // population * 0.00001
}

// State populations (2024 estimates)
const STATE_POPULATIONS: Record<string, number> = {
  AL: 5108468,
  AK: 733406,
  AZ: 7431344,
  AR: 3067732,
  CA: 38965193,
  CO: 5877610,
  CT: 3617176,
  DE: 1031890,
  FL: 23372215,
  GA: 11029227,
  HI: 1435138,
  ID: 1964726,
  IL: 12549689,
  IN: 6862199,
  IA: 3207004,
  KS: 2940546,
  KY: 4526154,
  LA: 4573749,
  ME: 1395722,
  MD: 6180253,
  MA: 7001399,
  MI: 10037261,
  MN: 5737915,
  MS: 2939690,
  MO: 6196156,
  MT: 1132812,
  NE: 1978379,
  NV: 3194176,
  NH: 1402054,
  NJ: 9290841,
  NM: 2114371,
  NY: 19571216,
  NC: 10835491,
  ND: 783926,
  OH: 11785935,
  OK: 4053824,
  OR: 4233358,
  PA: 12961683,
  RI: 1095962,
  SC: 5373555,
  SD: 919318,
  TN: 7126489,
  TX: 30503301,
  UT: 3417734,
  VT: 647464,
  VA: 8683619,
  WA: 7812880,
  WV: 1770071,
  WI: 5910955,
  WY: 584057,
};

// State names for display
export const STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

// Major cities per state for poll dropdown
export const STATE_MAJOR_CITIES: Record<string, string[]> = {
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

// Launch status configuration
const LAUNCH_CONFIG: Record<string, { status: LaunchStatus; launchDate?: string }> = {
  // Live states
  MN: { status: "live" },

  // Launching May 15, 2026
  IL: { status: "launching", launchDate: "May 15, 2026" },
  OH: { status: "launching", launchDate: "May 15, 2026" },

  // Launching June 15, 2026
  TX: { status: "launching", launchDate: "June 15, 2026" },
  FL: { status: "launching", launchDate: "June 15, 2026" },
};

/**
 * Calculate launch threshold (0.001% of population)
 */
function calculateThreshold(population: number): number {
  return Math.ceil(population * 0.00001);
}

/**
 * Get launch status for a state
 */
export function getStateLaunchStatus(stateAbbreviation: string): StateLaunchInfo {
  const upperState = stateAbbreviation.toUpperCase();
  const population = STATE_POPULATIONS[upperState] || 0;
  const config = LAUNCH_CONFIG[upperState];

  return {
    status: config?.status || "coming_soon",
    launchDate: config?.launchDate,
    population,
    launchThreshold: calculateThreshold(population),
  };
}

/**
 * Check if a state is live (fully launched)
 */
export function isStateLaunched(stateAbbreviation: string): boolean {
  const status = getStateLaunchStatus(stateAbbreviation);
  return status.status === "live";
}

/**
 * Check if a state is launching soon
 */
export function isStateLaunching(stateAbbreviation: string): boolean {
  const status = getStateLaunchStatus(stateAbbreviation);
  return status.status === "launching";
}

/**
 * Check if a state is coming soon (not live or launching)
 */
export function isStateComingSoon(stateAbbreviation: string): boolean {
  const status = getStateLaunchStatus(stateAbbreviation);
  return status.status === "coming_soon";
}

/**
 * Get all live state abbreviations
 */
export function getLiveStates(): string[] {
  return Object.entries(LAUNCH_CONFIG)
    .filter(([, config]) => config.status === "live")
    .map(([state]) => state);
}

/**
 * Get all launching state abbreviations
 */
export function getLaunchingStates(): string[] {
  return Object.entries(LAUNCH_CONFIG)
    .filter(([, config]) => config.status === "launching")
    .map(([state]) => state);
}

/**
 * Get all states with their launch info
 */
export function getAllStateLaunchInfo(): Record<string, StateLaunchInfo> {
  const allStates = Object.keys(STATE_POPULATIONS);
  const result: Record<string, StateLaunchInfo> = {};
  for (const state of allStates) {
    result[state] = getStateLaunchStatus(state);
  }
  return result;
}

/**
 * Get state name from abbreviation
 */
export function getStateName(stateAbbreviation: string): string {
  return STATE_NAMES[stateAbbreviation.toUpperCase()] || stateAbbreviation;
}

/**
 * Get major cities for a state
 */
export function getStateMajorCities(stateAbbreviation: string): string[] {
  return STATE_MAJOR_CITIES[stateAbbreviation.toUpperCase()] || [];
}

/**
 * Format launch date for display
 * Dates are now stored in "Month Day, Year" format, so this just returns the string.
 * For short format (badges), extracts just "Month Day".
 */
export function formatLaunchDate(dateString: string, short: boolean = true): string {
  if (short) {
    // Extract "May 15" from "May 15, 2026"
    const match = dateString.match(/^(\w+ \d+)/);
    return match ? match[1] : dateString;
  }
  return dateString;
}

// Legacy function for backwards compatibility
export function getLaunchedStates(): string[] {
  return getLiveStates();
}

/**
 * State Launch Configuration
 * Defines which states are launched and which are coming soon.
 */

export type LaunchStatus = "launched" | "coming_soon";

export interface StateLaunchInfo {
  status: LaunchStatus;
  launchDate?: string; // ISO date string for launched states
  targetLaunchDate?: string; // Expected launch date for coming_soon states
}

// States that are fully launched
const LAUNCHED_STATES = new Set(["OH", "IL", "MN"]);

// Default launch info for states
const stateLaunchOverrides: Record<string, Partial<StateLaunchInfo>> = {
  OH: {
    status: "launched",
    launchDate: "2026-04-14",
  },
  IL: {
    status: "launched",
    launchDate: "2026-04-14",
  },
  MN: {
    status: "launched",
    launchDate: "2026-04-14",
  },
  // Add more states as they launch
};

/**
 * Get launch status for a state
 * @param stateAbbreviation Two-letter state code (e.g., "OH", "CA")
 */
export function getStateLaunchStatus(stateAbbreviation: string): StateLaunchInfo {
  const upperState = stateAbbreviation.toUpperCase();

  if (stateLaunchOverrides[upperState]) {
    return {
      status: LAUNCHED_STATES.has(upperState) ? "launched" : "coming_soon",
      ...stateLaunchOverrides[upperState],
    } as StateLaunchInfo;
  }

  // Default to coming_soon for unlisted states
  return {
    status: LAUNCHED_STATES.has(upperState) ? "launched" : "coming_soon",
  };
}

/**
 * Check if a state is launched
 */
export function isStateLaunched(stateAbbreviation: string): boolean {
  return LAUNCHED_STATES.has(stateAbbreviation.toUpperCase());
}

/**
 * Get all launched state abbreviations
 */
export function getLaunchedStates(): string[] {
  return Array.from(LAUNCHED_STATES);
}

/**
 * Get all states with their launch status
 */
export function getAllStateLaunchInfo(): Record<string, StateLaunchInfo> {
  const allStates = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  const result: Record<string, StateLaunchInfo> = {};
  for (const state of allStates) {
    result[state] = getStateLaunchStatus(state);
  }
  return result;
}

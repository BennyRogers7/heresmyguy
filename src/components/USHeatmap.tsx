"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface StateData {
  abbreviation: string;
  name: string;
  status: "live" | "launching" | "coming_soon";
  launchDate?: string;
  voteCount: number;
  threshold: number;
  percentToLaunch: number;
}

interface StatesResponse {
  states: StateData[];
  summary: {
    liveCount: number;
    launchingCount: number;
    comingSoonCount: number;
    totalVotes: number;
  };
}

// State abbreviation to slug mapping
const stateSlugMap: Record<string, string> = {
  AL: "alabama", AK: "alaska", AZ: "arizona", AR: "arkansas", CA: "california",
  CO: "colorado", CT: "connecticut", DE: "delaware", FL: "florida", GA: "georgia",
  HI: "hawaii", ID: "idaho", IL: "illinois", IN: "indiana", IA: "iowa",
  KS: "kansas", KY: "kentucky", LA: "louisiana", ME: "maine", MD: "maryland",
  MA: "massachusetts", MI: "michigan", MN: "minnesota", MS: "mississippi", MO: "missouri",
  MT: "montana", NE: "nebraska", NV: "nevada", NH: "new-hampshire", NJ: "new-jersey",
  NM: "new-mexico", NY: "new-york", NC: "north-carolina", ND: "north-dakota", OH: "ohio",
  OK: "oklahoma", OR: "oregon", PA: "pennsylvania", RI: "rhode-island", SC: "south-carolina",
  SD: "south-dakota", TN: "tennessee", TX: "texas", UT: "utah", VT: "vermont",
  VA: "virginia", WA: "washington", WV: "west-virginia", WI: "wisconsin", WY: "wyoming",
};

export default function USHeatmap() {
  const [data, setData] = useState<StatesResponse | null>(null);
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/states/status")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const getStateColor = (state: StateData) => {
    if (state.status === "live") return "#22c55e"; // Green
    if (state.status === "launching") return "#d4a853"; // Gold
    // Heat gradient for coming soon based on percentage
    const pct = state.percentToLaunch;
    if (pct >= 75) return "#ef4444"; // Red hot
    if (pct >= 50) return "#f97316"; // Orange
    if (pct >= 25) return "#eab308"; // Yellow
    if (pct > 0) return "#84cc16"; // Lime
    return "#e5e7eb"; // Gray for 0 votes
  };

  const getTooltipText = (state: StateData) => {
    if (state.status === "live") return `${state.name} — Live`;
    if (state.status === "launching") return `${state.name} — Launching ${state.launchDate}`;
    return `${state.name} — ${state.voteCount} / ${state.threshold} votes (${state.percentToLaunch}% to launch)`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-400">Loading map...</div>
      </div>
    );
  }

  if (!data) return null;

  const stateMap = new Map(data.states.map((s) => [s.abbreviation, s]));

  return (
    <div>
      {/* Desktop: SVG Map */}
      <div className="hidden md:block relative">
        {/* Tooltip */}
        {hoveredState && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#1a1a2e] text-white px-4 py-2 rounded-lg text-sm z-10 whitespace-nowrap shadow-lg">
            {getTooltipText(hoveredState)}
          </div>
        )}

        {/* Simplified US Map SVG */}
        <svg viewBox="0 0 960 600" className="w-full h-auto">
          {/* State paths - simplified representation */}
          {Object.entries(US_STATE_PATHS).map(([abbr, path]) => {
            const state = stateMap.get(abbr);
            if (!state) return null;
            const slug = stateSlugMap[abbr];

            return (
              <Link key={abbr} href={`/${slug}`}>
                <path
                  d={path}
                  fill={getStateColor(state)}
                  stroke="#fff"
                  strokeWidth="1"
                  className="cursor-pointer transition-all duration-200 hover:brightness-110 hover:stroke-[#1a1a2e] hover:stroke-2"
                  onMouseEnter={() => setHoveredState(state)}
                  onMouseLeave={() => setHoveredState(null)}
                />
              </Link>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-gray-600">Live</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#d4a853]" />
            <span className="text-gray-600">Launching Soon</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-gray-200 via-orange-400 to-red-500" />
            <span className="text-gray-600">Coming Soon (heat = demand)</span>
          </div>
        </div>
      </div>

      {/* Mobile: Card List */}
      <div className="md:hidden space-y-3">
        {/* Live States */}
        {data.states.filter((s) => s.status === "live").length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-green-600 mb-2">Live Now</h4>
            <div className="grid grid-cols-2 gap-2">
              {data.states
                .filter((s) => s.status === "live")
                .map((state) => (
                  <Link
                    key={state.abbreviation}
                    href={`/${stateSlugMap[state.abbreviation]}`}
                    className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
                  >
                    {state.name}
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Launching States */}
        {data.states.filter((s) => s.status === "launching").length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-[#d4a853] mb-2">Launching Soon</h4>
            <div className="grid grid-cols-2 gap-2">
              {data.states
                .filter((s) => s.status === "launching")
                .map((state) => (
                  <Link
                    key={state.abbreviation}
                    href={`/${stateSlugMap[state.abbreviation]}`}
                    className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm hover:bg-amber-100 transition-colors"
                  >
                    <span className="font-medium text-amber-700">{state.name}</span>
                    <span className="block text-xs text-amber-600">{state.launchDate}</span>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Top Coming Soon States (by demand) */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Top Demand</h4>
          <div className="space-y-2">
            {data.states
              .filter((s) => s.status === "coming_soon")
              .slice(0, 10)
              .map((state) => (
                <Link
                  key={state.abbreviation}
                  href={`/${stateSlugMap[state.abbreviation]}`}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-[#d4a853] transition-colors"
                >
                  <span className="font-medium text-[#1a1a2e]">{state.name}</span>
                  <span className="text-sm text-gray-500">
                    {state.percentToLaunch}% to launch
                  </span>
                </Link>
              ))}
          </div>
          <Link
            href="/#browse-states"
            className="block text-center text-sm text-[#d4a853] mt-3 hover:underline"
          >
            View all states →
          </Link>
        </div>
      </div>
    </div>
  );
}

// Simplified US state paths (approximate positions for visual representation)
const US_STATE_PATHS: Record<string, string> = {
  AL: "M628,389 L628,450 L590,450 L590,389 Z",
  AK: "M120,460 L200,460 L200,540 L120,540 Z",
  AZ: "M210,340 L280,340 L280,430 L210,430 Z",
  AR: "M530,360 L590,360 L590,410 L530,410 Z",
  CA: "M100,220 L170,220 L170,400 L100,400 Z",
  CO: "M290,280 L380,280 L380,350 L290,350 Z",
  CT: "M830,210 L860,210 L860,240 L830,240 Z",
  DE: "M790,260 L810,260 L810,300 L790,300 Z",
  FL: "M660,420 L750,420 L750,520 L660,520 Z",
  GA: "M660,360 L720,360 L720,430 L660,430 Z",
  HI: "M250,500 L320,500 L320,550 L250,550 Z",
  ID: "M200,140 L260,140 L260,260 L200,260 Z",
  IL: "M570,240 L620,240 L620,350 L570,350 Z",
  IN: "M620,260 L665,260 L665,350 L620,350 Z",
  IA: "M490,230 L570,230 L570,290 L490,290 Z",
  KS: "M380,300 L490,300 L490,360 L380,360 Z",
  KY: "M610,310 L710,310 L710,360 L610,360 Z",
  LA: "M530,420 L590,420 L590,490 L530,490 Z",
  ME: "M860,100 L900,100 L900,180 L860,180 Z",
  MD: "M740,270 L790,270 L790,310 L740,310 Z",
  MA: "M840,180 L890,180 L890,210 L840,210 Z",
  MI: "M600,140 L680,140 L680,230 L600,230 Z",
  MN: "M480,120 L560,120 L560,220 L480,220 Z",
  MS: "M580,380 L630,380 L630,460 L580,460 Z",
  MO: "M500,300 L580,300 L580,380 L500,380 Z",
  MT: "M220,100 L340,100 L340,180 L220,180 Z",
  NE: "M370,230 L480,230 L480,290 L370,290 Z",
  NV: "M160,200 L220,200 L220,340 L160,340 Z",
  NH: "M850,140 L875,140 L875,190 L850,190 Z",
  NJ: "M800,220 L830,220 L830,290 L800,290 Z",
  NM: "M280,350 L370,350 L370,450 L280,450 Z",
  NY: "M760,150 L850,150 L850,230 L760,230 Z",
  NC: "M690,320 L800,320 L800,370 L690,370 Z",
  ND: "M380,120 L480,120 L480,180 L380,180 Z",
  OH: "M665,250 L730,250 L730,330 L665,330 Z",
  OK: "M380,360 L490,360 L490,420 L380,420 Z",
  OR: "M100,140 L200,140 L200,220 L100,220 Z",
  PA: "M730,210 L810,210 L810,270 L730,270 Z",
  RI: "M860,200 L880,200 L880,225 L860,225 Z",
  SC: "M700,360 L770,360 L770,410 L700,410 Z",
  SD: "M380,180 L480,180 L480,240 L380,240 Z",
  TN: "M580,340 L700,340 L700,380 L580,380 Z",
  TX: "M320,380 L520,380 L520,540 L320,540 Z",
  UT: "M220,230 L290,230 L290,340 L220,340 Z",
  VT: "M835,130 L860,130 L860,180 L835,180 Z",
  VA: "M710,280 L800,280 L800,340 L710,340 Z",
  WA: "M120,80 L210,80 L210,150 L120,150 Z",
  WV: "M700,270 L750,270 L750,330 L700,330 Z",
  WI: "M560,150 L620,150 L620,240 L560,240 Z",
  WY: "M280,180 L370,180 L370,260 L280,260 Z",
};

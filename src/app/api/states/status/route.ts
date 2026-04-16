import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  getAllStateLaunchInfo,
  getStateName,
  STATE_NAMES,
} from "@/lib/state-launch-config";

export const revalidate = 60; // Cache for 1 minute

export async function GET() {
  try {
    // Get launch info for all states
    const launchInfo = getAllStateLaunchInfo();

    // Get vote counts per state
    const voteCounts = await prisma.statePoll.groupBy({
      by: ["state"],
      _count: { state: true },
    });

    const voteCountMap = new Map(
      voteCounts.map((v) => [v.state, v._count.state])
    );

    // Build response with all state data
    const states = Object.keys(STATE_NAMES).map((abbr) => {
      const info = launchInfo[abbr];
      const voteCount = voteCountMap.get(abbr) || 0;
      const percentToLaunch = info.launchThreshold > 0
        ? Math.min((voteCount / info.launchThreshold) * 100, 100)
        : 0;

      return {
        abbreviation: abbr,
        name: getStateName(abbr),
        status: info.status,
        launchDate: info.launchDate,
        population: info.population,
        threshold: info.launchThreshold,
        voteCount,
        percentToLaunch: Math.round(percentToLaunch * 10) / 10,
      };
    });

    // Sort by status priority (live first, then launching, then by vote percentage)
    states.sort((a, b) => {
      const statusOrder = { live: 0, launching: 1, coming_soon: 2 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      return b.percentToLaunch - a.percentToLaunch;
    });

    return NextResponse.json({
      states,
      summary: {
        liveCount: states.filter((s) => s.status === "live").length,
        launchingCount: states.filter((s) => s.status === "launching").length,
        comingSoonCount: states.filter((s) => s.status === "coming_soon").length,
        totalVotes: states.reduce((sum, s) => sum + s.voteCount, 0),
      },
    });
  } catch (error) {
    console.error("States status error:", error);
    return NextResponse.json(
      { error: "Failed to fetch states status" },
      { status: 500 }
    );
  }
}

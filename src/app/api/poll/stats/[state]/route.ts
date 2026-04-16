import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStateLaunchStatus } from "@/lib/state-launch-config";

interface RouteParams {
  params: Promise<{ state: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { state: stateParam } = await params;
    const state = stateParam.toUpperCase();

    // Get launch info for threshold
    const launchInfo = getStateLaunchStatus(state);

    // Get total vote count
    const voteCount = await prisma.statePoll.count({
      where: { state },
    });

    // Get city vote distribution
    const cityVotes = await prisma.statePoll.groupBy({
      by: ["cityVote"],
      where: {
        state,
        cityVote: { not: null },
      },
      _count: { cityVote: true },
      orderBy: { _count: { cityVote: "desc" } },
      take: 5,
    });

    // Get project distribution (need to flatten arrays)
    const pollsWithProjects = await prisma.statePoll.findMany({
      where: {
        state,
        projects: { isEmpty: false },
      },
      select: { projects: true },
    });

    const projectCounts: Record<string, number> = {};
    for (const poll of pollsWithProjects) {
      for (const project of poll.projects) {
        projectCounts[project] = (projectCounts[project] || 0) + 1;
      }
    }
    const topProjects = Object.entries(projectCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Get hiring priority distribution
    const pollsWithPriorities = await prisma.statePoll.findMany({
      where: {
        state,
        hiringPriorities: { isEmpty: false },
      },
      select: { hiringPriorities: true },
    });

    const priorityCounts: Record<string, number> = {};
    for (const poll of pollsWithPriorities) {
      for (const priority of poll.hiringPriorities) {
        priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
      }
    }
    const topPriorities = Object.entries(priorityCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Get budget distribution
    const budgetVotes = await prisma.statePoll.groupBy({
      by: ["budget"],
      where: {
        state,
        budget: { not: null },
      },
      _count: { budget: true },
      orderBy: { _count: { budget: "desc" } },
    });

    // Calculate percentages
    const threshold = launchInfo.launchThreshold;
    const percentToLaunch = threshold > 0 ? Math.min((voteCount / threshold) * 100, 100) : 0;

    const totalCityVotes = cityVotes.reduce((sum, v) => sum + v._count.cityVote, 0);
    const totalProjectVotes = Object.values(projectCounts).reduce((sum, v) => sum + v, 0);
    const totalPriorityVotes = Object.values(priorityCounts).reduce((sum, v) => sum + v, 0);

    return NextResponse.json({
      state,
      voteCount,
      threshold,
      percentToLaunch: Math.round(percentToLaunch * 10) / 10,
      status: launchInfo.status,
      launchDate: launchInfo.launchDate,

      topCity: cityVotes[0] ? {
        name: cityVotes[0].cityVote,
        count: cityVotes[0]._count.cityVote,
        percent: totalCityVotes > 0 ? Math.round((cityVotes[0]._count.cityVote / totalCityVotes) * 100) : 0,
      } : null,

      topProject: topProjects[0] ? {
        name: topProjects[0][0],
        count: topProjects[0][1],
        percent: totalProjectVotes > 0 ? Math.round((topProjects[0][1] / totalProjectVotes) * 100) : 0,
      } : null,

      topPriority: topPriorities[0] ? {
        name: topPriorities[0][0],
        count: topPriorities[0][1],
        percent: totalPriorityVotes > 0 ? Math.round((topPriorities[0][1] / totalPriorityVotes) * 100) : 0,
      } : null,

      cityBreakdown: cityVotes.map(v => ({
        name: v.cityVote,
        count: v._count.cityVote,
        percent: totalCityVotes > 0 ? Math.round((v._count.cityVote / totalCityVotes) * 100) : 0,
      })),

      projectBreakdown: topProjects.map(([name, count]) => ({
        name,
        count,
        percent: totalProjectVotes > 0 ? Math.round((count / totalProjectVotes) * 100) : 0,
      })),

      priorityBreakdown: topPriorities.map(([name, count]) => ({
        name,
        count,
        percent: totalPriorityVotes > 0 ? Math.round((count / totalPriorityVotes) * 100) : 0,
      })),

      budgetBreakdown: budgetVotes.map(v => ({
        name: v.budget,
        count: v._count.budget,
      })),
    });
  } catch (error) {
    console.error("Poll stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch poll stats" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

interface PollSubmission {
  state: string;
  cityVote?: string;
  projects?: string[];
  budget?: string;
  hiringPriorities?: string[];
  recommendedContractorName?: string;
  recommendedContractorCity?: string;
  recommendedContractorWork?: string;
  email?: string;
  completedSteps?: number;
}

function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export async function POST(request: NextRequest) {
  try {
    const data: PollSubmission = await request.json();

    if (!data.state || data.state.length !== 2) {
      return NextResponse.json(
        { error: "Valid state abbreviation required" },
        { status: 400 }
      );
    }

    const state = data.state.toUpperCase();

    // Get IP for rate limiting (hashed for privacy)
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
               request.headers.get("x-real-ip") ||
               "unknown";
    const ipHash = hashIP(ip);

    // Check for recent submission from same IP for same state (rate limit: 1 per hour)
    const recentSubmission = await prisma.statePoll.findFirst({
      where: {
        state,
        ipHash,
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
        },
      },
    });

    if (recentSubmission) {
      // Update existing submission instead of creating new one
      const updated = await prisma.statePoll.update({
        where: { id: recentSubmission.id },
        data: {
          cityVote: data.cityVote || recentSubmission.cityVote,
          projects: data.projects || recentSubmission.projects,
          budget: data.budget || recentSubmission.budget,
          hiringPriorities: data.hiringPriorities || recentSubmission.hiringPriorities,
          recommendedContractorName: data.recommendedContractorName || recentSubmission.recommendedContractorName,
          recommendedContractorCity: data.recommendedContractorCity || recentSubmission.recommendedContractorCity,
          recommendedContractorWork: data.recommendedContractorWork || recentSubmission.recommendedContractorWork,
          email: data.email || recentSubmission.email,
          completedSteps: Math.max(data.completedSteps || 0, recentSubmission.completedSteps),
        },
      });

      return NextResponse.json({
        success: true,
        pollId: updated.id,
        message: "Poll updated",
      });
    }

    // Create new submission
    const poll = await prisma.statePoll.create({
      data: {
        state,
        cityVote: data.cityVote,
        projects: data.projects || [],
        budget: data.budget,
        hiringPriorities: data.hiringPriorities || [],
        recommendedContractorName: data.recommendedContractorName,
        recommendedContractorCity: data.recommendedContractorCity,
        recommendedContractorWork: data.recommendedContractorWork,
        email: data.email,
        completedSteps: data.completedSteps || 1,
        ipHash,
      },
    });

    // If email provided, also add to launch notifications
    if (data.email) {
      try {
        await prisma.launchNotification.upsert({
          where: {
            email_state: {
              email: data.email.toLowerCase(),
              state,
            },
          },
          update: {},
          create: {
            email: data.email.toLowerCase(),
            state,
          },
        });
      } catch {
        // Ignore duplicate errors
      }
    }

    return NextResponse.json({
      success: true,
      pollId: poll.id,
      message: "Vote counted",
    });
  } catch (error) {
    console.error("Poll submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit poll" },
      { status: 500 }
    );
  }
}

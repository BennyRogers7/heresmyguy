import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface LaunchNotifyRequest {
  email: string;
  state: string;
  vertical?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: LaunchNotifyRequest = await request.json();

    if (!data.email || !data.state) {
      return NextResponse.json(
        { error: "Email and state are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Normalize state to uppercase
    const state = data.state.toUpperCase();

    // Check if already subscribed
    const existing = await prisma.launchNotification.findUnique({
      where: {
        email_state: {
          email: data.email.toLowerCase().trim(),
          state,
        },
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "You're already on the list!",
      });
    }

    // Create notification subscription
    await prisma.launchNotification.create({
      data: {
        email: data.email.toLowerCase().trim(),
        state,
        vertical: data.vertical || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed!",
    });
  } catch (error) {
    console.error("Launch notify error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

// GET endpoint to check subscription status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const state = searchParams.get("state");

  if (!email || !state) {
    return NextResponse.json(
      { error: "Email and state are required" },
      { status: 400 }
    );
  }

  const existing = await prisma.launchNotification.findUnique({
    where: {
      email_state: {
        email: email.toLowerCase().trim(),
        state: state.toUpperCase(),
      },
    },
  });

  return NextResponse.json({
    subscribed: !!existing,
  });
}

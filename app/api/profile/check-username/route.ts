import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { message: "Username parameter is required" },
        { status: 400 }
      );
    }

    // Get current user's profile
    const session = await getAuthSession();
    let currentUserId = "";
    
    if (session?.user) {
      const userProfile = await prisma.profile.findUnique({
        where: {
          userId: session.user.id,
        },
        select: {
          userId: true,
        },
      });
      
      if (userProfile) {
        currentUserId = userProfile.userId;
      }
    }

    // Check if username exists
    const existingProfile = await prisma.profile.findUnique({
      where: {
        username,
      },
      select: {
        userId: true,
      },
    });

    // If the username belongs to the current user, it's available for them
    if (existingProfile && existingProfile.userId === currentUserId) {
      return NextResponse.json({ available: true });
    }

    return NextResponse.json({ available: !existingProfile });
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
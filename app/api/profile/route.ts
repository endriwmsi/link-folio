import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        profile: true,
        subscription: true,
      },
    });

    if (!user?.profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      profile: user.profile,
      subscription: user.subscription || { planType: "free" },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { username, displayName, bio, bookingHtml, theme } = await req.json();

    // Check if username is already taken by another user
    if (username) {
      const existingProfile = await prisma.profile.findUnique({
        where: {
          username,
        },
      });

      if (existingProfile && existingProfile.userId !== session.user.id) {
        return NextResponse.json(
          { message: "Username already taken" },
          { status: 409 }
        );
      }
    }

    // Get user with subscription to check premium status
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        subscription: true,
      },
    });

    // Check if user can use premium themes
    const isPremiumTheme = ["dark-mode", "neon", "pastel"].includes(theme);
    const hasPremiumAccess = ["premium", "pro"].includes(
      user?.subscription?.planType || ""
    );

    if (isPremiumTheme && !hasPremiumAccess) {
      return NextResponse.json(
        { message: "Premium subscription required for this theme" },
        { status: 403 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!profile) {
      // Create a new profile if one doesn't exist
      const newProfile = await prisma.profile.create({
        data: {
          userId: session.user.id,
          username,
          displayName,
          bio,
          bookingHtml,
          theme,
        },
      });

      return NextResponse.json({ profile: newProfile });
    }

    // Update existing profile
    const updatedProfile = await prisma.profile.update({
      where: {
        userId: session.user.id,
      },
      data: {
        username,
        displayName,
        bio,
        bookingHtml,
        theme,
      },
    });

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

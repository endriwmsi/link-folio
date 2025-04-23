import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { links } = await req.json();

    // Get the user's profile
    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!profile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    // Update each link's position
    for (const link of links) {
      await prisma.link.update({
        where: {
          id: link.id,
        },
        data: {
          position: link.position,
        },
      });
    }

    return NextResponse.json({ message: "Links reordered successfully" });
  } catch (error) {
    console.error("Error reordering links:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
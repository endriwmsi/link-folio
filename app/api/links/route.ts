import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        links: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ links: profile.links });
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, url, position } = await req.json();

    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!profile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    // Create the new link
    const link = await prisma.link.create({
      data: {
        title,
        url,
        position,
        profileId: profile.id,
      },
    });

    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error("Error creating link:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
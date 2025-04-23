import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { enabled } = await req.json();

    // First, check if the link belongs to the user
    const link = await prisma.link.findUnique({
      where: {
        id: params.id,
      },
      include: {
        profile: true,
      },
    });

    if (!link) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 });
    }

    if (link.profile.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Update the link's enabled status
    const updatedLink = await prisma.link.update({
      where: {
        id: params.id,
      },
      data: {
        enabled,
      },
    });

    return NextResponse.json({ link: updatedLink });
  } catch (error) {
    console.error("Error updating link status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
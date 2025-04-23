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

    const { title, url } = await req.json();

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

    // Update the link
    const updatedLink = await prisma.link.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        url,
      },
    });

    return NextResponse.json({ link: updatedLink });
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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

    // Delete the link
    await prisma.link.delete({
      where: {
        id: params.id,
      },
    });

    // Update positions of remaining links
    const remainingLinks = await prisma.link.findMany({
      where: {
        profileId: link.profileId,
        position: {
          gt: link.position,
        },
      },
    });

    for (const remainingLink of remainingLinks) {
      await prisma.link.update({
        where: {
          id: remainingLink.id,
        },
        data: {
          position: remainingLink.position - 1,
        },
      });
    }

    return NextResponse.json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { referrer, userAgent } = await req.json();

    // First, check if the link exists
    const link = await prisma.link.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!link) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 });
    }

    // Increment click count
    await prisma.link.update({
      where: {
        id: params.id,
      },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });

    // Record click details
    await prisma.linkClick.create({
      data: {
        linkId: params.id,
        referrer,
        userAgent,
        source: referrer ? new URL(referrer).hostname : null,
      },
    });

    return NextResponse.json({ message: "Click recorded successfully" });
  } catch (error) {
    console.error("Error recording click:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // In a real implementation, upload the file to a storage service like AWS S3
    // For this example, we'll simulate it by creating a fake URL
    const fileName = `background-${session.user.id}-${Date.now()}.${file.name
      .split(".")
      .pop()}`;
    const backgroundUrl = `https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1920&h=1080&auto=format&fit=crop`;

    // Update the user's profile with the new background URL
    await prisma.profile.update({
      where: {
        userId: session.user.id,
      },
      data: {
        backgroundUrl,
      },
    });

    return NextResponse.json({ backgroundUrl });
  } catch (error) {
    console.error("Error uploading background:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

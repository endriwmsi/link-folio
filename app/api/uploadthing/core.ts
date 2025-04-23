import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";

const f = createUploadthing();

const handleAuth = async () => {
  const session = await getAuthSession();
  if (!session || !session.user) throw new Error("Unauthorized");
  return { userId: session.user.id };
};

export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      // Find the user's profile
      const profile = await prisma.profile.findFirst({
        where: {
          userId: metadata.userId,
        },
      });

      if (!profile) throw new Error("Profile not found");

      // Update profile with the new avatar URL
      await prisma.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          avatarUrl: file.ufsUrl,
        },
      });

      return { url: file.ufsUrl };
    }),

  backgroundImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      const profile = await prisma.profile.findFirst({
        where: {
          userId: metadata.userId,
        },
      });

      if (!profile) throw new Error("Profile not found");

      await prisma.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          backgroundUrl: file.ufsUrl,
        },
      });

      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

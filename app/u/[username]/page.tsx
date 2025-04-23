import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LinkDisplay } from "@/components/profile/link-display";
import { ProfileHeader } from "@/components/profile/profile-header";
import prisma from "@/lib/db";
import { BookingBlock } from "@/components/profile/booking-block";

interface PageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = params;

  const profile = await prisma.profile.findUnique({
    where: {
      username,
    },
  });

  if (!profile) {
    return {
      title: "Profile Not Found",
      description: "The profile you're looking for doesn't exist.",
    };
  }

  return {
    title: `${profile.displayName} | LinkFolio`,
    description: profile.bio || `Check out ${profile.displayName}'s links`,
    openGraph: {
      title: `${profile.displayName} | LinkFolio`,
      description: profile.bio || `Check out ${profile.displayName}'s links`,
      images: profile.avatarUrl
        ? [{ url: profile.avatarUrl }]
        : [{ url: "https://link-folio.vercel.app/og-image.jpg" }],
    },
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = params;

  // Increment view count
  await prisma.profile.update({
    where: {
      username,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  const profile = await prisma.profile.findUnique({
    where: {
      username,
    },
    include: {
      links: {
        where: {
          enabled: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!profile) {
    notFound();
  }

  return (
    <div
      className={`min-h-screen bg-background flex flex-col relative`}
      style={{
        backgroundImage: profile.backgroundUrl
          ? `url(${profile.backgroundUrl})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {profile.backgroundUrl && (
        <div className="absolute inset-0 bg-black/50" />
      )}
      <div className="flex-1 flex flex-col items-center p-4 md:p-8 max-w-lg mx-auto w-full relative z-10">
        <ProfileHeader
          avatarUrl={profile.avatarUrl}
          displayName={profile.displayName}
          bio={profile.bio}
          theme={profile.theme}
        />

        {profile.bookingHtml && <BookingBlock html={profile.bookingHtml} />}

        <div className="w-full mt-6 space-y-4">
          {profile.links.map((link) => (
            <LinkDisplay
              key={link.id}
              id={link.id}
              title={link.title}
              url={link.url}
              theme={profile.theme}
            />
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Powered by LinkFolio</p>
        </div>
      </div>
    </div>
  );
}

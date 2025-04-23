import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart3, ExternalLink, Link as LinkIcon, Users } from "lucide-react";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent userId={session.user.id} />
    </Suspense>
  );
}

async function DashboardContent({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      profile: {
        include: {
          links: true,
        },
      },
      subscription: true,
    },
  });

  if (!user?.profile) {
    redirect("/dashboard/appearance");
  }

  const totalClicks = user.profile.links.reduce(
    (acc, link) => acc + link.clicks,
    0
  );
  const totalLinks = user.profile.links.length;

  const subscriptionPlan = user.subscription?.planType || "free";
  const isSubscribed = subscriptionPlan !== "free";

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href={`/u/${user.profile.username}`} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Your Page
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="py-4">
            <CardDescription>Total Profile Views</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{user.profile.views}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardDescription>Total Link Clicks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{totalClicks}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardDescription>Total Links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <LinkIcon className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{totalLinks}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardDescription>Subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold capitalize">
                {subscriptionPlan}
              </div>
              {!isSubscribed && (
                <Button asChild variant="secondary" size="sm">
                  <Link href="/dashboard/settings">Upgrade</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:bg-accent transition-colors">
            <Link href="/dashboard/links">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LinkIcon className="h-5 w-5 mr-2" />
                  Manage Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add, edit, or remove links from your profile.
                </p>
              </CardContent>
            </Link>
          </Card>
          <Card className="hover:bg-accent transition-colors">
            <Link href="/dashboard/appearance">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Update Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Edit your profile information and appearance.
                </p>
              </CardContent>
            </Link>
          </Card>
          <Card className="hover:bg-accent transition-colors">
            <Link href="/dashboard/analytics">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track views and clicks on your profile and links.
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

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
import { BarChart, PieChart } from "@/components/dashboard/charts";
import { AnalyticsSkeleton } from "@/components/dashboard/analytics-skeleton";

export default async function AnalyticsPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <AnalyticsContent userId={session.user.id} />
    </Suspense>
  );
}

async function AnalyticsContent({ userId }: { userId: string }) {
  const profile = await prisma.profile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      links: {
        include: {
          clickDetails: true,
        },
      },
    },
  });

  if (!profile) {
    redirect("/dashboard/appearance");
  }

  const totalClicks = profile.links.reduce((acc, link) => acc + link.clicks, 0);
  const totalViews = profile.views;
  const conversionRate =
    totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0;

  // Link performance data
  const linkPerformance = profile.links
    .map((link) => ({
      name: link.title,
      clicks: link.clicks,
    }))
    .sort((a, b) => b.clicks - a.clicks);

  // Last 7 days of traffic
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  // Mock traffic data (in a real app, this would come from the database)
  const trafficData = last7Days.map((date) => ({
    date,
    views: Math.floor(Math.random() * 20) + 5,
    clicks: Math.floor(Math.random() * 15),
  }));

  // Referrer data (in a real app, this would come from LinkClick records)
  const referrerData = [
    { name: "Direct", value: Math.floor(Math.random() * 40) + 30 },
    { name: "Social", value: Math.floor(Math.random() * 30) + 20 },
    { name: "Search", value: Math.floor(Math.random() * 20) + 10 },
    { name: "Other", value: Math.floor(Math.random() * 15) + 5 },
  ];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="py-4">
            <CardDescription>Total Profile Views</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalViews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardDescription>Total Link Clicks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalClicks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardDescription>Click-through Rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <BarChart data={trafficData} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <PieChart data={referrerData} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Link Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {linkPerformance.map((link) => (
              <div key={link.name} className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{link.name}</p>
                </div>
                <div className="flex items-center">
                  <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${Math.min(
                          100,
                          (link.clicks /
                            (Math.max(
                              ...linkPerformance.map((l) => l.clicks)
                            ) || 1)) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="ml-4 text-sm text-muted-foreground">
                    {link.clicks} clicks
                  </span>
                </div>
              </div>
            ))}
            {linkPerformance.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No link data available yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

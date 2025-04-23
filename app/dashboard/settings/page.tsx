import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Check } from "lucide-react";
import { SettingsSkeleton } from "@/components/dashboard/settings-skeleton";

export default async function SettingsPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsContent userId={session.user.id} />
    </Suspense>
  );
}

async function SettingsContent({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      subscription: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const isPremium = user.subscription?.planType === "premium";
  const subscriptionEndsAt = user.subscription?.stripeCurrentPeriodEnd;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Manage your account details and subscription.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p>{user.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p>{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Subscription
                  </p>
                  <div className="flex items-center">
                    <p className="capitalize">
                      {user.subscription?.planType || "Free"}
                    </p>
                    {isPremium && (
                      <Badge variant="outline" className="ml-2">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
                {isPremium && subscriptionEndsAt && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Next Billing Date
                    </p>
                    <p>
                      {new Date(subscriptionEndsAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2">
            <Button variant="outline" className="w-full sm:w-auto">
              Change Password
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Subscription Plans</CardTitle>
              {isPremium && <Badge variant="secondary">Current Plan</Badge>}
            </div>
            <CardDescription>
              Choose a subscription plan that works for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Premium</h3>
                </div>
                <p className="font-semibold">$4.99/month</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <p className="text-sm">All free features</p>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <p className="text-sm">7 premium themes</p>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <p className="text-sm">Advanced analytics</p>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <p className="text-sm">Custom domain support</p>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <p className="text-sm">No LinkFolio branding</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {isPremium ? (
              <Button variant="outline" className="w-full">
                Manage Subscription
              </Button>
            ) : (
              <Button className="w-full">Upgrade to Premium</Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions related to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Delete Account</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

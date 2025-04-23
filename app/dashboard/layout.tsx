import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard/nav";
import { UserAccountNav } from "@/components/dashboard/user-account-nav";
import { Suspense } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-10">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <DashboardNav />
          </div>
          <div className="flex items-center gap-4">
            <UserAccountNav
              user={{
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
              }}
            />
          </div>
        </div>
      </header>
      <main className="flex-1 mx-10">
        <Suspense>{children}</Suspense>
      </main>
    </div>
  );
}

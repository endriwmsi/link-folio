"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3Icon,
  Link as LinkIcon,
  Settings,
  UserIcon,
  LayoutDashboard,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [activePath, setActivePath] = useState(pathname);
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (path: string) => {
    if (path === pathname) return;
    setIsNavigating(true);
    setActivePath(path);
    setIsOpen(false);
    router.push(path);
  };

  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/links",
      label: "Links",
      icon: LinkIcon,
    },
    {
      href: "/dashboard/appearance",
      label: "Appearance",
      icon: UserIcon,
    },
    {
      href: "/dashboard/analytics",
      label: "Analytics",
      icon: BarChart3Icon,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const NavLinks = () => (
    <>
      {links.map((link) => {
        const isActive = activePath === link.href;
        return (
          <button
            key={link.href}
            onClick={() => handleNavigation(link.href)}
            className={cn(
              "flex items-center text-sm font-medium transition-colors relative w-full p-2 rounded-md",
              isActive
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            )}
          >
            <link.icon className="mr-2 h-4 w-4" />
            <span>{link.label}</span>
            {isNavigating && isActive && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-pulse" />
            )}
          </button>
        );
      })}
    </>
  );

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-accent">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-4">
            <div className="flex flex-col space-y-2 mt-4">
              <NavLinks />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-4">
        <NavLinks />
      </nav>
    </>
  );
}

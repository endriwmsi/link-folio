"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LinkIcon } from "lucide-react";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Benefits } from "@/components/landing/benefits";
import { CTA } from "@/components/landing/cta";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <motion.header
        className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="container flex h-14 items-center justify-between">
          <motion.div
            className="flex gap-6 md:gap-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <LinkIcon className="h-6 w-6" />
              <span className="font-bold inline-block">LinkFolio</span>
            </Link>
          </motion.div>
          <motion.nav
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ThemeSwitch />
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-medium">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="default" className="text-sm font-medium">
                Sign Up
              </Button>
            </Link>
          </motion.nav>
        </div>
      </motion.header>

      <main className="flex-1">
        <Hero />
        <Features />
        <Benefits />
        <CTA />
      </main>

      <motion.footer
        className="border-t py-6 md:py-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="container flex h-14 items-center justify-between gap-4">
          <div className="flex flex-1 items-center justify-start gap-4 text-sm">
            <Link href="/" className="font-medium">
              © 2025 LinkFolio
            </Link>
          </div>
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/terms"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Privacy
            </Link>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

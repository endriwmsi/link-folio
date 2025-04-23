"use client";

import { motion } from "framer-motion";
import {
  AlignHorizontalDistributeCenter,
  ArrowRight,
  ExternalLink,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const features = [
  {
    title: "Beautiful Themes",
    description:
      "Choose from a variety of professionally designed themes to match your brand.",
    icon: Sparkles,
  },
  {
    title: "Analytics Dashboard",
    description: "Track your page views, link clicks, and audience engagement.",
    icon: LinkIcon,
  },
  {
    title: "Custom Domains",
    description: "Use your own domain name for a more professional presence.",
    icon: ArrowRight,
  },
  {
    title: "Social Integration",
    description: "Connect all your social media profiles in one place.",
    icon: ExternalLink,
  },
  {
    title: "Booking Integration",
    description: "Let visitors schedule meetings directly through your page.",
    icon: Sparkles,
  },
  {
    title: "Mobile Optimized",
    description: "Your page looks great on all devices, automatically.",
    icon: Sparkles,
  },
];

export function Features() {
  return (
    <section className="w-full flex flex-col justify-center space-y-6 bg-slate-50 py-8 dark:bg-slate-900/30 md:py-12 lg:py-24">
      <motion.div
        className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="rounded-2xl px-4 py-1.5 font-medium flex items-center border gap-2"
          variants={fadeIn}
        >
          Our Features
          <AlignHorizontalDistributeCenter className="h-4 w-4 text-primary" />
        </motion.div>
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Features you&apos;ll love
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Everything you need to create a professional online presence
        </p>
      </motion.div>

      <motion.div
        className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            className="relative overflow-hidden rounded-lg border bg-background p-2"
            variants={fadeIn}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <feature.icon className="h-12 w-12 text-primary" />
              <div className="space-y-2">
                <h3 className="font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

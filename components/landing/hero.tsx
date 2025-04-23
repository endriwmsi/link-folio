"use client";

import Link from "next/link";
import { useScroll, motion, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

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

const images = [
  "https://landing-page-linvxcode.vercel.app/_next/image?url=%2F1.png&w=640&q=100",
  "https://landing-page-linvxcode.vercel.app/_next/image?url=%2F2.png&w=640&q=100",
  "https://landing-page-linvxcode.vercel.app/_next/image?url=%2F3.png&w=640&q=100",
  "https://landing-page-linvxcode.vercel.app/_next/image?url=%2F4.png&w=640&q=100",
  "https://landing-page-linvxcode.vercel.app/_next/image?url=%2F5.png&w=640&q=100",
  "https://landing-page-linvxcode.vercel.app/_next/image?url=%2F6.png&w=640&q=100",
];

export function Hero() {
  const { scrollY } = useScroll();
  const rotateX = useTransform(scrollY, [0, 500], [45, 0]);
  const scale = useTransform(scrollY, [0, 500], [0.8, 1]);
  const translateY = useTransform(scrollY, [0, 500], [100, 0]);
  const translateZ = useTransform(scrollY, [0, 500], [-100, 0]);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-background">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:6rem_4rem]" />
      </div>

      <div className="flex justify-center space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <motion.div
          className="container flex max-w-[64rem] flex-col items-center gap-4 text-center z-10"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="rounded-2xl border px-4 py-1.5 text-sm font-medium flex items-center"
            variants={fadeIn}
          >
            🚀 Launching on Product Hunt Soon
          </motion.div>
          <motion.h1
            className="font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
            variants={fadeIn}
          >
            <span className="inline-block animate-gradient bg-gradient-to-r from-foreground to-background bg-clip-text text-transparent bg-[length:400%_400%]">
              Your Digital Identity, Beautifully Curated
            </span>
          </motion.h1>
          <motion.p
            className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
            variants={fadeIn}
          >
            Create a stunning link-in-bio page that reflects your personal
            brand. Share your content, showcase your work, and connect with your
            audience—all in one place.
          </motion.p>
          <motion.div className="space-x-4" variants={fadeIn}>
            <Link href="/register">
              <Button size="lg" className="group">
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          <div className="flex justify-center w-full">
            <motion.div
              className="relative w-full h-[500px] mt-2"
              style={{ perspective: 1500 }}
            >
              <motion.div
                className="grid grid-cols-6 gap-4 absolute inset-0"
                style={{
                  rotateX,
                  scale,
                  translateZ,
                  translateY,
                  transformStyle: "preserve-3d",
                  transformOrigin: "center top",
                }}
              >
                {images.map((image, i) => (
                  <motion.div
                    key={i}
                    className="relative rounded-lg overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      transformStyle: "preserve-3d",
                      transform: `translateZ(${i * 10}px)`,
                    }}
                  >
                    <Image
                      src={image}
                      width={200}
                      height={500}
                      alt="Feature preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

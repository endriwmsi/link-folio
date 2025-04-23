"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

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

const benefits = [
  {
    title: "Professional Design",
    description:
      "Stand out with beautiful, responsive layouts that showcase your brand identity.",
  },
  {
    title: "Easy to Use",
    description:
      "Set up your page in minutes with our intuitive drag-and-drop interface.",
  },
  {
    title: "Detailed Analytics",
    description:
      "Understand your audience with comprehensive click and view tracking.",
  },
  {
    title: "Regular Updates",
    description:
      "We're constantly adding new features and improvements based on user feedback.",
  },
];

export function Benefits() {
  return (
    <section className="flex flex-col justify-center py-8 md:py-12 lg:py-24">
      <motion.div
        className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Why choose LinkFolio?
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Join thousands of creators who trust LinkFolio
        </p>
      </motion.div>

      <motion.div
        className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 mt-8"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        {benefits.map((benefit) => (
          <motion.div
            key={benefit.title}
            className="flex items-start gap-4"
            variants={fadeIn}
          >
            <CheckCircle2 className="mt-1 h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-bold">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

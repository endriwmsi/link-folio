"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface LinkDisplayProps {
  id: string;
  title: string;
  url: string;
  theme: string;
}

export function LinkDisplay({ id, title, url, theme }: LinkDisplayProps) {
  const [isHovering, setIsHovering] = useState(false);

  // Track click
  const handleClick = async () => {
    try {
      // Send click analytics
      await fetch(`/api/links/${id}/click`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referrer: document.referrer,
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      // If analytics fail, we still want the link to work
      console.error("Failed to track click", error);
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case "default":
        return {
          button: "bg-primary hover:bg-primary/90 text-primary-foreground",
          hoverEffect: { y: -5 },
        };
      case "minimal":
        return {
          button:
            "bg-background border border-primary hover:bg-primary/10 text-primary",
          hoverEffect: { scale: 1.02 },
        };
      case "colorful":
        return {
          button:
            "bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white",
          hoverEffect: { y: -3, scale: 1.01 },
        };
      case "dark-mode":
        return {
          button: "bg-zinc-800 hover:bg-zinc-700 text-zinc-100",
          hoverEffect: { y: -3, scale: 1.01 },
        };
      case "neon":
        return {
          button:
            "bg-black border border-green-500 hover:bg-green-950/30 text-green-500 shadow-[0_0_10px_theme(colors.green.500)]",
          hoverEffect: { y: -3, scale: 1.01 },
        };
      case "pastel":
        return {
          button: "bg-pink-200 hover:bg-pink-300 text-pink-900",
          hoverEffect: { y: -3, scale: 1.01 },
        };
      default:
        return {
          button: "bg-primary hover:bg-primary/90 text-primary-foreground",
          hoverEffect: { y: -5 },
        };
    }
  };

  const { button, hoverEffect } = getThemeStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hoverEffect}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      className="w-full"
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block w-full"
      >
        <Button
          variant="default"
          className={`w-full py-6 text-base ${button} transform transition-all duration-200`}
        >
          {title}
        </Button>
      </a>
    </motion.div>
  );
}

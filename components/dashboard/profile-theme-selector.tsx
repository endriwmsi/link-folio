"use client";

import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ProfileThemeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  isPremium: boolean;
}

const themes = [
  {
    id: "default",
    name: "Default",
    description: "Clean, professional appearance with subtle animations",
    buttonPreview: "bg-primary hover:bg-primary/90 text-primary-foreground",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple, understated design with a focus on content",
    buttonPreview:
      "bg-background border border-primary hover:bg-primary/10 text-primary",
  },
  {
    id: "colorful",
    name: "Colorful",
    description: "Vibrant gradient buttons that stand out",
    buttonPreview:
      "bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white",
  },
  {
    id: "dark-mode",
    name: "Dark Mode",
    description: "Sleek dark theme with high contrast elements",
    buttonPreview: "bg-zinc-800 hover:bg-zinc-700 text-zinc-100",
    premium: true,
  },
  {
    id: "neon",
    name: "Neon",
    description: "Eye-catching neon effects with glowing buttons",
    buttonPreview:
      "bg-black border border-green-500 hover:bg-green-950/30 text-green-500 shadow-[0_0_10px_theme(colors.green.500)]",
    premium: true,
  },
  {
    id: "pastel",
    name: "Pastel",
    description: "Soft pastel colors for a gentle aesthetic",
    buttonPreview: "bg-pink-200 hover:bg-pink-300 text-pink-900",
    premium: true,
  },
];

export function ProfileThemeSelector({
  value,
  onChange,
  isPremium,
}: ProfileThemeSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {themes.map((theme) => {
        const isDisabled = theme.premium && !isPremium;
        const isSelected = value === theme.id;

        return (
          <div key={theme.id}>
            <RadioGroupItem
              value={theme.id}
              id={theme.id}
              className="peer sr-only"
              disabled={isDisabled}
            />
            <Label
              htmlFor={theme.id}
              className={cn(
                "relative flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary [&:has([data-state=checked])]:border-primary",
                isDisabled &&
                  "opacity-50 cursor-not-allowed hover:bg-popover hover:text-popover-foreground",
                isSelected && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <div className="w-full space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{theme.name}</h4>
                  {theme.premium && (
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase bg-primary/10 text-primary rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {theme.description}
                </p>
              </div>
              <div className="mt-3 w-full">
                <div
                  className={cn(
                    "w-full py-1.5 px-3 rounded-md text-xs text-center transition-all",
                    theme.buttonPreview
                  )}
                >
                  Button Preview
                </div>
              </div>
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}

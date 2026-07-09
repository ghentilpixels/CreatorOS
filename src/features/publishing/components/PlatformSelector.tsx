"use client";

import { PLATFORM_META } from "../services/platforms";
import type { IntegrationPlatform } from "@/lib/types";

interface PlatformSelectorProps {
  selected: Record<string, boolean>;
  onChange: (platform: IntegrationPlatform, enabled: boolean) => void;
  disabled?: boolean;
}

export function PlatformSelector({ selected, onChange, disabled }: PlatformSelectorProps) {
  const platforms = Object.keys(PLATFORM_META) as IntegrationPlatform[];

  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((platform) => {
        const isSelected = selected[platform];
        const meta = PLATFORM_META[platform];
        return (
          <button
            key={platform}
            type="button"
            disabled={disabled}
            onClick={() => onChange(platform, !isSelected)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              isSelected
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10"
            } disabled:opacity-50`}
          >
            <span>{meta.icon}</span>
            {meta.name}
          </button>
        );
      })}
    </div>
  );
}

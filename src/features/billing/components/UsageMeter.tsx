"use client";

import type { UsageSnapshot } from "@/lib/usage/limits";

interface UsageMeterProps {
  label: string;
  snapshot: UsageSnapshot;
}

export function UsageMeter({ label, snapshot }: UsageMeterProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {snapshot.unlimited
            ? "Unlimited"
            : `${snapshot.used.toLocaleString()} / ${snapshot.limit.toLocaleString()}`}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            snapshot.percent >= 90 ? "bg-red-500" : "bg-primary"
          }`}
          style={{ width: `${snapshot.unlimited ? 0 : snapshot.percent}%` }}
        />
      </div>
    </div>
  );
}

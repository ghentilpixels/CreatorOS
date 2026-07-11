"use client";

import type { UsageSnapshot } from "@/lib/usage/limits";
import { motion } from "framer-motion";

interface UsageMeterProps {
  label: string;
  snapshot: UsageSnapshot;
}

export function UsageMeter({ label, snapshot }: UsageMeterProps) {
  const isDanger = !snapshot.unlimited && snapshot.percent >= 90;
  const isWarning = !snapshot.unlimited && snapshot.percent >= 75 && snapshot.percent < 90;
  
  // Calculate width, clamping between 2% (to show a sliver) and 100%
  const targetWidth = snapshot.unlimited ? 100 : Math.max(2, Math.min(100, snapshot.percent));

  return (
    <div className="space-y-3 group">
      <div className="flex justify-between items-end">
        <span className="text-sm font-semibold text-foreground/80 group-hover:text-white transition-colors">
          {label}
        </span>
        <span className={`text-xs font-bold font-mono px-2 py-1 rounded-md border ${
          snapshot.unlimited 
            ? "bg-primary/10 text-primary border-primary/20"
            : isDanger
            ? "bg-red-500/10 text-red-400 border-red-500/20"
            : isWarning
            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
            : "bg-white/5 text-muted-foreground border-white/5 group-hover:border-white/10"
        }`}>
          {snapshot.unlimited
            ? "Unlimited"
            : `${snapshot.used.toLocaleString()} / ${snapshot.limit.toLocaleString()}`}
        </span>
      </div>
      
      <div className="relative h-2.5 w-full rounded-full bg-black/40 overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${targetWidth}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`absolute left-0 top-0 h-full rounded-full ${
            snapshot.unlimited
              ? "bg-gradient-to-r from-primary/40 to-primary/80"
              : isDanger
              ? "bg-gradient-to-r from-red-600 to-red-400"
              : isWarning
              ? "bg-gradient-to-r from-amber-600 to-amber-400"
              : "bg-gradient-to-r from-primary/60 to-primary"
          }`}
        >
          {/* Shimmer effect inside the bar */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
        </motion.div>
      </div>
      
      {!snapshot.unlimited && (
        <p className={`text-[10px] text-right font-medium tracking-wide ${
          isDanger ? "text-red-400 animate-pulse" : isWarning ? "text-amber-400" : "text-transparent"
        }`}>
          {isDanger ? "Approaching limit!" : isWarning ? "Getting close" : "Healthy"}
        </p>
      )}
    </div>
  );
}

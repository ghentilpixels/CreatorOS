"use client";

import { PlaySquare, TrendingUp, MousePointerClick, Clock, Heart } from "lucide-react";
import type { TopContentItem } from "@/lib/types";

interface TopContentProps {
  items: TopContentItem[];
}

export function TopContent({ items }: TopContentProps) {
  return (
    <div className="glass rounded-2xl p-5 border-white/5">
      <div className="mb-4">
        <h3 className="font-semibold text-lg">Top Content</h3>
        <p className="text-sm text-muted-foreground">Your best performing videos</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm">
          <PlaySquare className="w-8 h-8 mx-auto mb-3 opacity-30" />
          No published videos yet. Publish content to see top performers.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-sm text-primary">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {item.platform ?? "Unknown platform"} • {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "Draft"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-xs">
                <div className="text-right">
                  <p className="text-muted-foreground flex items-center justify-end gap-1">
                    <TrendingUp className="w-3 h-3" /> Views
                  </p>
                  <p className="font-semibold">{item.views.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" /> Watch
                  </p>
                  <p className="font-semibold">{item.watchTime}m</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground flex items-center justify-end gap-1">
                    <MousePointerClick className="w-3 h-3" /> CTR
                  </p>
                  <p className="font-semibold">{item.ctr.toFixed(1)}%</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground flex items-center justify-end gap-1">
                    <Heart className="w-3 h-3" /> Eng.
                  </p>
                  <p className="font-semibold">{item.engagement.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

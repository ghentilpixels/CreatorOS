"use client";

import { motion } from "framer-motion";
import { Eye, Users, MousePointerClick, Clock, DollarSign, Heart } from "lucide-react";
import type { AnalyticsOverview } from "@/lib/types";

interface MetricCardsProps {
  metrics: AnalyticsOverview["metrics"];
  previous: AnalyticsOverview["previous"];
}

function trend(current: number, prev: number) {
  if (prev === 0) return { value: "0%", isUp: true };
  const change = ((current - prev) / prev) * 100;
  return {
    value: `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`,
    isUp: change >= 0,
  };
}

function fmt(value: number, type: "num" | "pct" | "cur" | "time") {
  if (type === "pct") return `${value.toFixed(1)}%`;
  if (type === "cur") return `$${value.toFixed(2)}`;
  if (type === "time") {
    const h = Math.floor(value / 60);
    const m = value % 60;
    return `${h}h ${m}m`;
  }
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

export function MetricCards({ metrics, previous }: MetricCardsProps) {
  const items = [
    { id: "views", label: "Views", value: metrics.views, prev: previous.views, type: "num" as const, icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "subscribers", label: "Subscribers", value: metrics.subscribers, prev: previous.subscribers, type: "num" as const, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: "ctr", label: "Avg CTR", value: metrics.ctr, prev: previous.ctr, type: "pct" as const, icon: MousePointerClick, color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: "watchTime", label: "Watch Time", value: metrics.watchTime, prev: previous.watchTime, type: "time" as const, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { id: "revenue", label: "Revenue", value: metrics.revenue, prev: previous.revenue, type: "cur" as const, icon: DollarSign, color: "text-rose-500", bg: "bg-rose-500/10" },
    { id: "engagement", label: "Engagement", value: metrics.engagement, prev: previous.engagement, type: "pct" as const, icon: Heart, color: "text-pink-500", bg: "bg-pink-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, i) => {
        const tr = trend(item.value, item.prev);
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5 border-white/5 relative overflow-hidden group"
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${item.bg} blur-2xl opacity-40 group-hover:opacity-80 transition-opacity`} />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  tr.isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                }`}
              >
                {tr.value}
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold">{fmt(item.value, item.type)}</h3>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

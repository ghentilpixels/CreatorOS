"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Loader2, AlertCircle } from "lucide-react";
import { getAnalyticsOverview } from "@/features/analytics/actions";
import { MetricCards } from "@/features/analytics/components/MetricCards";
import { GrowthChart } from "@/features/analytics/components/GrowthChart";
import { PerformanceChart } from "@/features/analytics/components/PerformanceChart";
import { TopContent } from "@/features/analytics/components/TopContent";
import { AIInsightsPanel } from "@/features/analytics/components/AIInsightsPanel";
import type { AnalyticsOverview, DateRange } from "@/lib/types";

const RANGES: { label: string; value: DateRange }[] = [
  { label: "7 Days", value: "7d" },
  { label: "28 Days", value: "28d" },
  { label: "90 Days", value: "90d" },
  { label: "12 Months", value: "12m" },
];

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<DateRange>("28d");
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getAnalyticsOverview(range)
      .then((res) => {
        if (cancelled) return;
        if (res.success) {
          setData(res.data);
        } else {
          setError(res.error ?? "Failed to load analytics");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Unexpected error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [range]);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-glow flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-primary" />
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1">Deep dive into your content performance.</p>
        </div>

        <div className="flex bg-muted/50 p-1 rounded-lg">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                range === r.value
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-muted-foreground"
          >
            <Loader2 className="w-8 h-8 animate-spin mb-3" />
            <p className="text-sm">Loading analytics...</p>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {!loading && !error && data && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <MetricCards metrics={data.metrics} previous={data.previous} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GrowthChart data={data.growth} />
              <PerformanceChart data={data.performance} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TopContent items={data.topContent} />
              </div>
              <div className="lg:col-span-1">
                <AIInsightsPanel range={range} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsOverview } from "@/lib/types";

interface GrowthChartProps {
  data: AnalyticsOverview["growth"];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 rounded-lg border-white/10 shadow-xl text-xs">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="flex items-center gap-2" style={{ color: entry.color }}>
            <span>{entry.name}:</span>
            <span className="font-bold">{entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function GrowthChart({ data }: GrowthChartProps) {
  return (
    <div className="glass rounded-2xl p-5 border-white/5">
      <div className="mb-4">
        <h3 className="font-semibold text-lg">Growth Chart</h3>
        <p className="text-sm text-muted-foreground">Views and subscriber growth over time</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGrowthViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorGrowthSubs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              yAxisId="left"
              stroke="#888888"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${Number(v) >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#888888"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="views"
              name="Views"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorGrowthViews)"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="subscribers"
              name="Subscribers"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorGrowthSubs)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

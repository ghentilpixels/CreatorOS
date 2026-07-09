"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsOverview } from "@/lib/types";

interface PerformanceChartProps {
  data: AnalyticsOverview["performance"];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 rounded-lg border-white/10 shadow-xl text-xs">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="flex items-center gap-2" style={{ color: entry.color }}>
            <span>{entry.name}:</span>
            <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <div className="glass rounded-2xl p-5 border-white/5">
      <div className="mb-4">
        <h3 className="font-semibold text-lg">Performance Chart</h3>
        <p className="text-sm text-muted-foreground">Normalized performance index (0-100)</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="views" name="Views" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="watchTime" name="Watch Time" stackId="a" fill="#f59e0b" />
            <Bar dataKey="engagement" name="Engagement" stackId="a" fill="#ec4899" />
            <Bar dataKey="ctr" name="CTR" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

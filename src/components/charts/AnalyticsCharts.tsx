"use client";

import { motion } from "framer-motion";
import { TimeSeriesDataPoint } from "@/lib/analytics/types";

interface LineChartProps {
  data: TimeSeriesDataPoint[];
  title: string;
  unit?: string;
  color?: string;
}

export function LineChart({
  data,
  title,
  unit = "",
  color = "text-blue-400",
}: LineChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  // Calculate SVG coordinates
  const points = data
    .map((point, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((point.value - minValue) / range) * 80 - 10;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-48"
      >
        {/* Grid lines */}
        <line
          x1="0"
          y1="20"
          x2="100"
          y2="20"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
        />
        <line
          x1="0"
          y1="40"
          x2="100"
          y2="40"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
        />
        <line
          x1="0"
          y1="60"
          x2="100"
          y2="60"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
        />
        <line
          x1="0"
          y1="80"
          x2="100"
          y2="80"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
        />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={
            color === "text-blue-400"
              ? "#60a5fa"
              : color === "text-emerald-400"
                ? "#34d399"
                : "#a78bfa"
          }
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Fill under line */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill={
            color === "text-blue-400"
              ? "rgba(96,165,250,0.1)"
              : color === "text-emerald-400"
                ? "rgba(52,211,153,0.1)"
                : "rgba(167,139,250,0.1)"
          }
        />
      </svg>

      <div className="flex justify-between items-end mt-4 pt-4 border-t border-white/5">
        <div>
          <p className="text-xs text-zinc-500 mb-1">Latest Value</p>
          <p className="text-lg font-semibold text-white">
            {data[data.length - 1].value.toLocaleString()} {unit}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500 mb-1">Change</p>
          <p
            className={`text-lg font-semibold ${data[data.length - 1].value > data[0].value ? "text-emerald-400" : "text-red-400"}`}
          >
            {(
              ((data[data.length - 1].value - data[0].value) / data[0].value) *
              100
            ).toFixed(1)}
            %
          </p>
        </div>
      </div>
    </div>
  );
}

interface BarChartProps {
  data: { label: string; value: number }[];
  title: string;
  color?: string;
}

export function BarChart({
  data,
  title,
  color = "bg-blue-500",
}: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>

      <div className="space-y-4">
        {data.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            className="space-y-2"
          >
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-300 font-medium truncate">
                {item.label}
              </span>
              <span className="text-white font-semibold ml-2">
                {item.value.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ delay: i * 0.05 + 0.2, duration: 0.6 }}
                className={`h-full ${color} rounded-full`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: number | string;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  unit?: string;
  icon?: React.ReactNode;
}

export function MetricCard({
  label,
  value,
  change,
  changeType,
  unit = "",
  icon,
}: MetricCardProps) {
  const changeColor =
    changeType === "increase"
      ? "text-emerald-400"
      : changeType === "decrease"
        ? "text-red-400"
        : "text-zinc-400";
  const changeBg =
    changeType === "increase"
      ? "bg-emerald-500/10"
      : changeType === "decrease"
        ? "bg-red-500/10"
        : "bg-zinc-500/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-zinc-400">{label}</p>
        {icon && <div className="text-zinc-500">{icon}</div>}
      </div>

      <div className="mb-3">
        <p className="text-2xl font-bold text-white">
          {typeof value === "number" ? value.toLocaleString() : value} {unit}
        </p>
      </div>

      <div
        className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${changeBg} ${changeColor}`}
      >
        {change > 0 ? "+" : ""}
        {change}% vs last period
      </div>
    </motion.div>
  );
}

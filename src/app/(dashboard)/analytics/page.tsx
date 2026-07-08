"use client";

import { motion } from "framer-motion";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Line, LineChart } from "recharts";
import { TrendingUp, Users, Clock, Eye, ArrowUpRight, PlaySquare } from "lucide-react";

// Mock Data
const viewsData = [
  { name: "Jan", views: 4000, ctr: 4.2 },
  { name: "Feb", views: 3000, ctr: 3.8 },
  { name: "Mar", views: 5000, ctr: 4.8 },
  { name: "Apr", views: 8780, ctr: 5.9 },
  { name: "May", views: 5890, ctr: 4.6 },
  { name: "Jun", views: 10390, ctr: 6.8 },
  { name: "Jul", views: 14490, ctr: 7.2 },
];

const retentionData = [
  { time: "0:00", retention: 100 },
  { time: "1:00", retention: 85 },
  { time: "2:00", retention: 70 },
  { time: "3:00", retention: 65 },
  { time: "4:00", retention: 62 },
  { time: "5:00", retention: 55 },
  { time: "6:00", retention: 40 },
];

const topVideos = [
  { name: "React 19 Changes", views: 45000 },
  { name: "Next.js SaaS Tutorial", views: 32000 },
  { name: "Tailwind V4 Guide", views: 28000 },
  { name: "Setup My Desk 2024", views: 21000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 rounded-lg border-white/10 shadow-xl">
        <p className="text-sm font-semibold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-glow">Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into your content performance.</p>
        </div>
        
        <div className="flex bg-muted/50 p-1 rounded-lg">
          <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-background shadow-sm text-foreground">7 Days</button>
          <button className="px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground">28 Days</button>
          <button className="px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground">90 Days</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Views", value: "2.4M", trend: "+14%", icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Watch Time (hrs)", value: "128K", trend: "+8%", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Subscribers", value: "+4.2K", trend: "+24%", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Avg. CTR", value: "6.2%", trend: "-1.2%", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10", isDown: true },
        ].map((kpi, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={kpi.label} 
            className="p-5 glass rounded-2xl border-white/5 relative overflow-hidden group"
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${kpi.bg} blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`} />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${kpi.isDown ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                {kpi.trend} {kpi.isDown ? '' : <ArrowUpRight className="w-3 h-3 ml-1" />}
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-1">{kpi.value}</h3>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Views Area Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass rounded-2xl p-6 border-white/5"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Views Overview</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="views" name="Views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Videos Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6 border-white/5"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Top Content</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topVideos} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} hide />
                <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.02)'}} />
                <Bar dataKey="views" name="Views" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Audience Retention Line Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-3 glass rounded-2xl p-6 border-white/5"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Average Audience Retention</h3>
            <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-md border border-emerald-500/20 font-medium">
              Excellent Performance
            </span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="retention" name="Retention %" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: "#10b981", stroke: "#000", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

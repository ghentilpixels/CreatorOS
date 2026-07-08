"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Search, Plus, FileText, BarChart3, ChevronRight } from "lucide-react";
import Link from "next/link";
// import { getResearches } from "@/features/research/actions";

export default function ResearchPage() {
  const [researches, setResearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchResearch = async () => {
  //     setLoading(true);
  //     const res = await getResearches();
  //     if (res.success && res.data) {
  //       setResearches(res.data);
  //     }
  //     setLoading(false);
  //   };
  //   fetchResearch();
  // }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header section */}
      <div className="relative border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-glow flex items-center gap-3">
                <Search className="w-8 h-8 text-blue-400" />
                Research Library
              </h1>
              <p className="text-muted-foreground mt-2 text-sm max-w-xl">
                Access your past market research, audience analysis, and trending topic reports.
              </p>
            </div>
            <Link
              href="/research-studio"
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-background shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
            >
              <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />
              New Research
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer pointer-events-none" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
               <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : researches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Display research cards here once DB is connected */}
            {researches.map((item) => (
              <div key={item.id} className="p-6 rounded-2xl bg-background/40 border border-white/5 hover:border-blue-500/30 transition-all flex flex-col gap-4 group cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{item.topic}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {item.summary || "Detailed market and audience analysis report."}
                  </p>
                </div>
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <BarChart3 className="w-4 h-4" /> Analyzed
                  </span>
                  <span className="text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Report <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
              <Search className="w-10 h-10 text-blue-400 relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">No research reports yet</h3>
            <p className="text-zinc-400 mb-8 max-w-md">
              Start researching topics, analyzing competitors, and uncovering audience pain points using AI.
            </p>
            <Link
              href="/research-studio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors font-medium text-sm text-white hover:text-white group"
            >
              <Sparkles className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
              Go to Research Studio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

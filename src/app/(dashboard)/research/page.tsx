"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Search, Plus, FileText, BarChart3, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ResearchPage() {
  const [researches, setResearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-8 pb-10">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-glow flex items-center gap-3">
            <div className="p-2 bg-blue-500/15 rounded-xl">
              <Search className="w-6 h-6 text-blue-400" />
            </div>
            Research Library
          </h1>
          <p className="text-muted-foreground mt-1 max-w-xl">
            Access your past market research, audience analysis, and trend reports.
          </p>
        </div>
        <Link href="/research-studio">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 group relative overflow-hidden">
            <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />
            New Research
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer pointer-events-none" />
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
               <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : researches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researches.map((item) => (
              <div key={item.id} className="glass rounded-3xl p-6 hover:bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all flex flex-col gap-4 group cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-md border border-white/5">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{item.topic}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                    {item.summary || "Detailed market and audience analysis report."}
                  </p>
                </div>
                <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <BarChart3 className="w-4 h-4" /> Analyzed
                  </span>
                  <span className="text-blue-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Report <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-3xl p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
            <div className="w-20 h-20 rounded-2xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center mb-6 relative z-10 shadow-xl shadow-blue-500/10">
              <Search className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2 relative z-10">No research reports yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md relative z-10">
              Start researching topics, analyzing competitors, and uncovering audience pain points using AI.
            </p>
            <Link href="/research-studio" className="relative z-10">
              <Button variant="outline" className="gap-2 bg-background/50 border-white/10 hover:bg-white/5">
                <Sparkles className="w-4 h-4 text-blue-400" /> Go to Research Studio
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

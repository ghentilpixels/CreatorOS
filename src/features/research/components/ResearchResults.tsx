"use client";

import React from "react";
import { ResearchResult } from "@/lib/ai/types";
import { 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Users, 
  Search, 
  Video, 
  PlayCircle,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  result: ResearchResult;
}

export function ResearchResults({ result }: Props) {
  return (
    <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div whileHover={{ scale: 1.01 }} className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Topic Summary</h3>
          </div>
          <p className="text-zinc-300 leading-relaxed text-sm">{result.topicSummary}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Market Opportunity</h3>
          </div>
          <p className="text-zinc-300 leading-relaxed text-sm">{result.marketOpportunity}</p>
        </motion.div>
      </div>

      {/* Middle Section: Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-blue-400" />
            <h4 className="font-medium text-zinc-100">Trending Questions</h4>
          </div>
          <ul className="space-y-2">
            {result.trendingQuestions.map((q, i) => (
              <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                <span className="text-blue-500/50 mt-0.5">•</span>
                {q}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-rose-400" />
            <h4 className="font-medium text-zinc-100">Audience Pain Points</h4>
          </div>
          <ul className="space-y-2">
            {result.audiencePainPoints.map((p, i) => (
              <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                <span className="text-rose-500/50 mt-0.5">•</span>
                {p}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-orange-400" />
            <h4 className="font-medium text-zinc-100">Competitor Analysis</h4>
          </div>
          <p className="text-sm text-zinc-400">{result.competitorAnalysis}</p>
        </motion.div>
      </div>

      {/* Lower Section: Keywords and Ideas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <h4 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-zinc-400" /> Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.keywordSuggestions.map((kw, i) => (
                <span key={i} className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <h4 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" /> Content Angles
            </h4>
            <ul className="space-y-3">
              {result.contentAngles.map((angle, i) => (
                <li key={i} className="text-sm text-zinc-300 bg-zinc-800/50 p-3 rounded-lg border border-zinc-800/80">
                  {angle}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Video className="w-32 h-32" />
          </div>
          <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
            <PlayCircle className="w-5 h-5 text-indigo-400" /> Recommended Videos
          </h4>
          
          <div className="space-y-6 relative z-10 flex-1">
            <div>
              <h5 className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Video Ideas</h5>
              <div className="space-y-2">
                {result.videoIdeas.map((idea, i) => (
                  <div key={i} className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-sm text-zinc-200">
                    {idea}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Winning Titles</h5>
              <div className="space-y-2">
                {result.recommendedTitles.map((title, i) => (
                  <div key={i} className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-sm font-medium text-indigo-200">
                    {title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

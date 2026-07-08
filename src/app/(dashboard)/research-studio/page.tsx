"use client";

import React, { useState } from "react";
import { generateResearch } from "@/features/research/actions";
import { ResearchResult } from "@/lib/ai/types";
import { ResearchResults } from "@/features/research/components/ResearchResults";
import { Loader2, Sparkles, Target, Users, PlaySquare, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function ResearchStudioPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const topic = formData.get("topic") as string;
    const audience = formData.get("audience") as string;
    const platform = formData.get("platform") as string;
    const contentType = formData.get("contentType") as string;

    const res = await generateResearch({ topic, audience, platform, contentType });
    if (res.success && res.data) {
      setResult(res.data);
    } else {
      alert("Failed to generate research. Did you set up the Google/OpenAI API key?");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 w-full">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-3">Research Studio</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Discover profitable content ideas, understand your audience, and analyze the market using AI.
        </p>
      </div>

      {!result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="max-w-2xl mx-auto bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl"
        >
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Search className="w-4 h-4 text-zinc-500" /> Topic
              </label>
              <input 
                name="topic" 
                required 
                placeholder="e.g. Notion Productivity System" 
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-zinc-500" /> Target Audience
                </label>
                <input 
                  name="audience" 
                  required 
                  placeholder="e.g. Students, Freelancers" 
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <PlaySquare className="w-4 h-4 text-zinc-500" /> Platform
                </label>
                <select 
                  name="platform" 
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram">Instagram Reels</option>
                  <option value="Twitter">Twitter/X</option>
                  <option value="LinkedIn">LinkedIn</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Target className="w-4 h-4 text-zinc-500" /> Content Type
              </label>
              <select 
                name="contentType" 
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
              >
                <option value="Educational Tutorial">Educational Tutorial</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Vlog">Vlog</option>
                <option value="Review / Tech">Review / Tech</option>
                <option value="Short Form">Short Form</option>
              </select>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-white text-black hover:bg-zinc-200 font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Market...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Research
                </>
              )}
            </button>
          </form>
        </motion.div>
      )}

      {result && !loading && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Research Intelligence Report</h2>
            <button 
              onClick={() => setResult(null)}
              className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              New Research
            </button>
          </div>
          <ResearchResults result={result} />
        </div>
      )}
    </div>
  );
}

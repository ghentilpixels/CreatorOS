"use client";

import React, { useState } from "react";
import { generateResearch } from "@/features/research/actions";
import { ResearchResult } from "@/lib/ai/types";
import { ResearchResults } from "@/features/research/components/ResearchResults";
import { Loader2, Sparkles, Target, Users, PlaySquare, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
      alert("Failed to generate research. Check your AI API keys.");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-glow flex items-center justify-center gap-3">
          <div className="p-2 bg-blue-500/15 rounded-xl">
            <Search className="w-6 h-6 text-blue-400" />
          </div>
          Research Studio
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Discover profitable content ideas, understand your audience, and analyze the market using AI.
        </p>
      </div>

      {!result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto glass rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

          <form onSubmit={onSubmit} className="space-y-6 relative z-10">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Search className="w-3.5 h-3.5" /> Topic
              </label>
              <input
                name="topic"
                required
                placeholder="e.g. Notion Productivity System"
                className="w-full bg-background/60 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" /> Target Audience
                </label>
                <input
                  name="audience"
                  required
                  placeholder="e.g. Students, Freelancers"
                  className="w-full bg-background/60 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <PlaySquare className="w-3.5 h-3.5" /> Platform
                </label>
                <select
                  name="platform"
                  className="w-full bg-background/60 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram">Instagram Reels</option>
                  <option value="Twitter">Twitter/X</option>
                  <option value="LinkedIn">LinkedIn</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Target className="w-3.5 h-3.5" /> Content Type
              </label>
              <select
                name="contentType"
                className="w-full bg-background/60 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
              >
                <option value="Educational Tutorial">Educational Tutorial</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Vlog">Vlog</option>
                <option value="Review / Tech">Review / Tech</option>
                <option value="Short Form">Short Form</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2 py-3 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 disabled:opacity-50"
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
            </Button>
          </form>
        </motion.div>
      )}

      {result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Research Intelligence Report</h2>
            <Button
              variant="outline"
              onClick={() => setResult(null)}
              className="border-white/10 bg-background/50 hover:bg-white/5"
            >
              New Research
            </Button>
          </div>
          <ResearchResults result={result} />
        </motion.div>
      )}
    </div>
  );
}

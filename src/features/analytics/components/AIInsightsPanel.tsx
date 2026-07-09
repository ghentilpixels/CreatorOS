"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analyzePerformance } from "@/features/analytics/ai-actions";

interface AIInsightsPanelProps {
  range?: "7d" | "28d" | "90d" | "12m";
}

export function AIInsightsPanel({ range = "28d" }: AIInsightsPanelProps) {
  const [question, setQuestion] = useState("");
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestions = [
    "What content type performs best?",
    "Which day should I post?",
    "Why is my CTR dropping?",
    "How can I increase watch time?",
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!question.trim() && insights.length > 0) return;

    setLoading(true);
    setError(null);

    try {
      const result = await analyzePerformance({ question: question.trim() || undefined, range });
      if (result.success) {
        setInsights(result.insights);
      } else {
        setError(result.error ?? "Could not generate insights.");
      }
    } catch (err) {
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-5 border-white/5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-purple-500/10">
          <Sparkles className="w-4 h-4 text-purple-500" />
        </div>
        <div>
          <h3 className="font-semibold text-base">AI Analytics Agent</h3>
          <p className="text-xs text-muted-foreground">Ask anything about your performance</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative mb-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What content type performs best?"
          className="w-full bg-black/30 border border-white/10 rounded-xl pl-4 pr-12 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <Button
          type="submit"
          size="icon-sm"
          className="absolute right-1.5 top-1/2 -translate-y-1/2"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2 mb-4">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => {
              setQuestion(s);
            }}
            className="text-xs px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors border border-white/5"
          >
            {s}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        {insights.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {insights.map((insight, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5"
              >
                <div className="mt-0.5 w-5 h-5 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm leading-relaxed">{insight}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

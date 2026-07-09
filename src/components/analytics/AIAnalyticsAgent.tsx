"use client";

import { useState } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export interface AIInsight {
  id: string;
  message: string;
  timestamp: Date;
  type: "insight" | "recommendation" | "alert";
  data?: Record<string, any>;
}

const SAMPLE_INSIGHTS: AIInsight[] = [
  {
    id: "1",
    message:
      "Your tutorials perform 3.2x better than news videos. Consider increasing tutorial content.",
    type: "recommendation",
    timestamp: new Date(Date.now() - 3600000),
    data: { tutorialCTR: 5.8, newsCTR: 1.8 },
  },
  {
    id: "2",
    message:
      "Peak engagement occurs on Friday 8-10 PM. Schedule uploads for maximum visibility.",
    type: "insight",
    timestamp: new Date(Date.now() - 7200000),
    data: { day: "Friday", time: "8-10 PM", engagementBoost: "47%" },
  },
  {
    id: "3",
    message:
      "Average watch time decreased 8% from last week. Try adding more hook content in first 10 seconds.",
    type: "alert",
    timestamp: new Date(Date.now() - 10800000),
    data: { decrease: "8%", suggestion: "stronger hooks" },
  },
  {
    id: "4",
    message:
      "Your React content has a 23% higher subscriber conversion rate. Focus more on this niche.",
    type: "recommendation",
    timestamp: new Date(Date.now() - 14400000),
    data: { category: "React", conversionBoost: "23%" },
  },
];

export function AIAnalyticsAgent() {
  const [insights, setInsights] = useState<AIInsight[]>(SAMPLE_INSIGHTS);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!input.trim()) return;

    setLoading(true);
    const userMessage = input;
    setInput("");

    // Simulate API call to AI backend
    setTimeout(() => {
      const newInsight: AIInsight = {
        id: `insight-${Date.now()}`,
        message: `Based on your question "${userMessage}", I've analyzed your content. ${getAIResponse(userMessage)}`,
        type: "insight",
        timestamp: new Date(),
      };

      setInsights((prev) => [newInsight, ...prev]);
      setLoading(false);
    }, 1500);
  }

  function getAIResponse(query: string): string {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("why") || lowerQuery.includes("performance")) {
      return "Your recent drop in views might be due to inconsistent upload schedule. You have the best engagement on Fridays.";
    } else if (lowerQuery.includes("improve") || lowerQuery.includes("grow")) {
      return "To grow faster, focus on creating more tutorials (your best performing content type) and optimize thumbnails based on top performers.";
    } else if (lowerQuery.includes("when") || lowerQuery.includes("schedule")) {
      return "Best posting times: Friday 8-10 PM for maximum views, Wednesday 2-4 PM for engagement, and Saturdays for subscriber growth.";
    }

    return "That's an interesting question. Based on your analytics, I recommend analyzing your top 5 videos to identify common success patterns.";
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            AI Analytics Agent
          </h3>
        </div>
        <p className="text-sm text-zinc-400 ml-13">
          Ask me anything about your content performance
        </p>
      </div>

      {/* Chat Messages */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {insights.map((insight) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl border ${
                insight.type === "alert"
                  ? "bg-red-500/10 border-red-500/20"
                  : insight.type === "recommendation"
                    ? "bg-blue-500/10 border-blue-500/20"
                    : "bg-white/5 border-white/10"
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                    insight.type === "alert"
                      ? "bg-red-400"
                      : insight.type === "recommendation"
                        ? "bg-blue-400"
                        : "bg-purple-400"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-white mb-1">{insight.message}</p>
                  <p className="text-xs text-zinc-500">
                    {insight.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Ask about your content performance..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          className="bg-white/5 border-white/10"
          disabled={loading}
        />
        <Button
          onClick={handleAnalyze}
          disabled={loading || !input.trim()}
          size="icon"
          className="bg-purple-600 hover:bg-purple-700"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

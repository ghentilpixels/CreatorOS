"use client";

import { useState } from "react";
import { Bot, Settings, Play, Activity, Clock, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { AgentSettingsModal } from "@/features/agents/components/AgentSettingsModal";

const MOCK_AGENTS = [
  { id: "1", name: "Research Agent", type: "research", status: "active", model: "gpt-4o", provider: "openai", lastRun: "10 mins ago", usage: "1.2k tokens" },
  { id: "2", name: "Script Agent", type: "script", status: "active", model: "claude-3-5-sonnet", provider: "anthropic", lastRun: "1 hour ago", usage: "3.4k tokens" },
  { id: "3", name: "SEO Agent", type: "seo", status: "active", model: "gpt-4o", provider: "openai", lastRun: "2 days ago", usage: "450 tokens" },
  { id: "4", name: "Thumbnail Agent", type: "thumbnail", status: "inactive", model: "gemini-1.5-pro", provider: "google", lastRun: "Never", usage: "0 tokens" },
  { id: "5", name: "Trend Agent", type: "trend", status: "active", model: "gpt-4o-mini", provider: "openai", lastRun: "5 mins ago", usage: "120 tokens" },
  { id: "6", name: "Analytics Agent", type: "analytics", status: "active", model: "claude-3-haiku", provider: "anthropic", lastRun: "1 week ago", usage: "8.9k tokens" },
];

export default function AgentsDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);

  return (
    <div className="flex-1 overflow-y-auto bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <Bot className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Agent Fleet</h1>
            </div>
            <p className="text-zinc-400">Manage and configure your specialized AI agents.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_AGENTS.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl hover:bg-zinc-900/60 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${agent.status === 'active' ? 'bg-green-500/20' : 'bg-zinc-800'}`}>
                    <Bot className={`w-5 h-5 ${agent.status === 'active' ? 'text-green-400' : 'text-zinc-500'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-zinc-600'}`} />
                      <span className="text-xs text-zinc-400 capitalize">{agent.status}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAgent(agent)}
                  className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Cpu className="w-4 h-4" />
                    Model
                  </div>
                  <span className="text-zinc-300 bg-white/5 px-2 py-1 rounded-md text-xs font-mono">{agent.model}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Clock className="w-4 h-4" />
                    Last Run
                  </div>
                  <span className="text-zinc-300">{agent.lastRun}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Activity className="w-4 h-4" />
                    Usage
                  </div>
                  <span className="text-zinc-300">{agent.usage}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2 rounded-xl text-sm font-medium transition-colors">
                  <Play className="w-4 h-4" />
                  Test Run
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedAgent && (
        <AgentSettingsModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </div>
  );
}

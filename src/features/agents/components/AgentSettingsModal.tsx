"use client";

import { useState } from "react";
import { X, Save, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AgentSettingsModal({ agent, onClose }: { agent: any, onClose: () => void }) {
  const [model, setModel] = useState(agent.model);
  const [temperature, setTemperature] = useState(0.7);
  const [instructions, setInstructions] = useState("You are an expert AI agent designed to help digital creators. Follow all specific instructions accurately.");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50">
            <div>
              <h2 className="text-xl font-bold text-white">{agent.name} Settings</h2>
              <p className="text-sm text-zinc-400">Configure model parameters and core instructions.</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Model Selection</label>
                <select 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                >
                  <option value="gpt-4o">GPT-4o (OpenAI)</option>
                  <option value="gpt-4o-mini">GPT-4o Mini (OpenAI)</option>
                  <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Anthropic)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Google)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 flex justify-between">
                  <span>Temperature</span>
                  <span className="text-blue-400 font-mono">{temperature}</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="1" step="0.1" 
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 mt-3"
                />
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">System Instructions</label>
              <textarea 
                rows={4}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none font-mono text-sm"
              />
              <p className="text-xs text-zinc-500">These instructions define the core behavior of the agent.</p>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Recent Logs
              </label>
              <div className="bg-black/50 border border-white/5 rounded-xl p-4 font-mono text-xs text-green-400/70 h-32 overflow-y-auto">
                <div>[10:45:02] Agent validated input schema.</div>
                <div>[10:45:03] Sending request to {model}...</div>
                <div>[10:45:08] Received response. Tokens: 450 prompt, 120 completion.</div>
                <div>[10:45:09] Agent execution finished successfully.</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-zinc-900/50 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

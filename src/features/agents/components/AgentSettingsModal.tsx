"use client";

import { useState, useEffect } from "react";
import { X, Save, Terminal, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateAgent, getAgentLogs } from "../actions";

interface AgentSettingsModalProps {
  agent: any;
  onClose: () => void;
  onSave?: () => void;
}

const MODEL_OPTIONS = {
  openai: ["gpt-4o", "gpt-4-turbo", "gpt-4o-mini"],
  anthropic: [
    "claude-3-5-sonnet-20241022",
    "claude-3-opus-20240229",
    "claude-3-haiku-20240307",
  ],
  google: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro"],
};

const PROVIDERS = ["openai", "anthropic", "google"];

export function AgentSettingsModal({
  agent,
  onClose,
  onSave,
}: AgentSettingsModalProps) {
  const [formData, setFormData] = useState({
    model: agent.model,
    temperature: agent.temperature || 0.7,
    instructions: agent.instructions || "",
    status: agent.status,
  });

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"settings" | "logs">("settings");
  const [provider, setProvider] = useState(agent.provider || "openai");

  useEffect(() => {
    if (activeTab === "logs") {
      fetchLogs();
    }
  }, [activeTab]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const result = await getAgentLogs(agent.id, agent.userId || "", 10);
      setLogs(result);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAgent(
        {
          id: agent.id,
          model: formData.model,
          temperature: formData.temperature,
          instructions: formData.instructions,
          status: formData.status,
        },
        agent.userId || "",
      );
      onSave?.();
      onClose();
    } catch (error) {
      console.error("Failed to save agent:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50">
            <div>
              <h2 className="text-xl font-bold text-white">
                {agent.name} Settings
              </h2>
              <p className="text-sm text-zinc-400">
                Configure model parameters and core instructions.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border-b border-white/10 px-6 bg-zinc-900/30">
            {["settings", "logs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "settings" | "logs")}
                className={`py-4 px-4 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? "text-white border-b-2 border-blue-500"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab === "settings" ? "Configuration" : "Execution Logs"}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1">
            {activeTab === "settings" ? (
              <div className="space-y-6">
                {/* Provider */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Provider
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => {
                      setProvider(e.target.value);
                      const models =
                        MODEL_OPTIONS[
                          e.target.value as keyof typeof MODEL_OPTIONS
                        ];
                      setFormData((prev) => ({ ...prev, model: models[0] }));
                    }}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                  >
                    {PROVIDERS.map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Model Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Model Selection
                  </label>
                  <select
                    value={formData.model}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        model: e.target.value,
                      }))
                    }
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                  >
                    {MODEL_OPTIONS[provider as keyof typeof MODEL_OPTIONS]?.map(
                      (model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                {/* Temperature Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-zinc-300">
                      Temperature
                    </label>
                    <span className="text-sm text-blue-400 font-mono">
                      {formData.temperature.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        temperature: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-zinc-500">
                    Lower = more focused, Higher = more creative (0.0 - 2.0)
                  </p>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Agent Status
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Enable or disable this agent
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {["active", "inactive"].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, status }))
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.status === status
                            ? "bg-blue-500 text-white"
                            : "bg-white/5 text-zinc-400 hover:bg-white/10"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    System Instructions
                  </label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        instructions: e.target.value,
                      }))
                    }
                    placeholder="Enter custom instructions for this agent..."
                    className="w-full h-32 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  />
                  <p className="text-xs text-zinc-500">
                    Customize the agent's behavior and output format
                  </p>
                </div>
              </div>
            ) : (
              /* Logs Tab */
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader className="w-5 h-5 text-zinc-400 animate-spin" />
                  </div>
                ) : logs.length === 0 ? (
                  <div className="text-center py-12">
                    <Terminal className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                    <p className="text-zinc-400 text-sm">
                      No execution logs yet
                    </p>
                  </div>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-mono ${
                              log.status === "completed"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {log.status}
                          </span>
                          <time className="text-xs text-zinc-500">
                            {new Date(log.createdAt).toLocaleString()}
                          </time>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <p className="text-zinc-500">Tokens</p>
                          <p className="text-zinc-300 font-mono">
                            {log.tokensUsed}
                          </p>
                        </div>
                        <div>
                          <p className="text-zinc-500">Execution Time</p>
                          <p className="text-zinc-300 font-mono">
                            {log.executionTime}ms
                          </p>
                        </div>
                        <div>
                          <p className="text-zinc-500">Type</p>
                          <p className="text-zinc-300 font-mono capitalize">
                            {log.agentType}
                          </p>
                        </div>
                      </div>
                      {log.error && (
                        <p className="text-xs text-red-400 mt-2 bg-red-500/10 p-2 rounded">
                          {log.error}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {activeTab === "settings" && (
            <div className="flex gap-3 p-6 border-t border-white/10 bg-zinc-900/50">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-white bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

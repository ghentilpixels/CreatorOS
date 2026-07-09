"use client";

import { useState } from "react";
import { Plus, X, Save, Play, ZapOff, Code2, GitBranch } from "lucide-react";
import { motion } from "framer-motion";

export interface WorkflowStep {
  id: string;
  agentType: string;
  agentName: string;
  config?: Record<string, any>;
}

interface WorkflowBuilderProps {
  onSave?: (workflow: {
    name: string;
    trigger: string;
    steps: WorkflowStep[];
  }) => void;
  onClose?: () => void;
}

const AVAILABLE_AGENTS = [
  {
    type: "research",
    name: "Research Agent",
    icon: "🔍",
    description: "Analyze and research topics",
  },
  {
    type: "script",
    name: "Script Agent",
    icon: "✍️",
    description: "Generate video scripts",
  },
  {
    type: "seo",
    name: "SEO Agent",
    icon: "📊",
    description: "Optimize for search",
  },
  {
    type: "thumbnail",
    name: "Thumbnail Agent",
    icon: "🖼️",
    description: "Design thumbnails",
  },
  {
    type: "trend",
    name: "Trend Agent",
    icon: "📈",
    description: "Find trending topics",
  },
  {
    type: "analytics",
    name: "Analytics Agent",
    icon: "📉",
    description: "Analyze metrics",
  },
];

const TRIGGERS = [
  { value: "manual", label: "Manual Trigger", icon: Play },
  { value: "new_topic_added", label: "New Topic Added", icon: Plus },
  { value: "scheduled", label: "Scheduled", icon: GitBranch },
  { value: "webhook", label: "Webhook", icon: Code2 },
];

export function WorkflowBuilder({ onSave, onClose }: WorkflowBuilderProps) {
  const [workflowName, setWorkflowName] = useState("Content Pipeline");
  const [selectedTrigger, setSelectedTrigger] = useState("manual");
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const addStep = (agentType: string, agentName: string) => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      agentType,
      agentName,
    };
    setSteps([...steps, newStep]);
    setShowAgentPicker(false);
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter((s) => s.id !== stepId));
  };

  const moveStep = (stepId: string, direction: "up" | "down") => {
    const index = steps.findIndex((s) => s.id === stepId);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...steps];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newSteps[index], newSteps[swapIndex]] = [
      newSteps[swapIndex],
      newSteps[index],
    ];
    setSteps(newSteps);
  };

  const handleSave = async () => {
    if (steps.length === 0) {
      alert("Please add at least one agent to the workflow");
      return;
    }

    setSaving(true);
    try {
      onSave?.({
        name: workflowName,
        trigger: selectedTrigger,
        steps,
      });
      setSaving(false);
      onClose?.();
    } catch (error) {
      console.error("Error saving workflow:", error);
      setSaving(false);
    }
  };

  return (
    <div className="w-full bg-black min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-6 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            Workflow Builder
          </h1>
          <p className="text-zinc-400">
            Chain multiple agents to automate your content creation process
          </p>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Configuration */}
          <div className="lg:col-span-2 space-y-8">
            {/* Workflow Name */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                Workflow Name
              </label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Name your workflow"
              />
            </div>

            {/* Trigger Selection */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
              <label className="block text-sm font-medium text-zinc-300 mb-4">
                Trigger Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {TRIGGERS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setSelectedTrigger(value)}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      selectedTrigger === value
                        ? "bg-blue-500/20 border-blue-500 text-white"
                        : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <label className="block text-sm font-medium text-zinc-300">
                  Workflow Steps
                </label>
                <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-zinc-400">
                  {steps.length} step{steps.length !== 1 ? "s" : ""}
                </span>
              </div>

              {steps.length === 0 ? (
                <div className="text-center py-12">
                  <ZapOff className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-500 text-sm mb-4">
                    No agents added yet
                  </p>
                  <button
                    onClick={() => setShowAgentPicker(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Agent
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-black/50 border border-white/10 rounded-xl p-4 flex items-center justify-between group hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {step.agentName}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {step.agentType}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {index > 0 && (
                          <button
                            onClick={() => moveStep(step.id, "up")}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                            title="Move up"
                          >
                            ↑
                          </button>
                        )}
                        {index < steps.length - 1 && (
                          <button
                            onClick={() => moveStep(step.id, "down")}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                            title="Move down"
                          >
                            ↓
                          </button>
                        )}
                        <button
                          onClick={() => removeStep(step.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-zinc-400 hover:text-red-400"
                          title="Remove step"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {/* Add Another Step */}
                  <button
                    onClick={() => setShowAgentPicker(true)}
                    className="w-full mt-4 p-4 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 transition-colors text-zinc-400 hover:text-white font-medium flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Agent
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Preview */}
          <div className="space-y-4">
            {/* Preview */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl sticky top-6">
              <h3 className="text-sm font-medium text-zinc-300 mb-4">
                Workflow Preview
              </h3>

              <div className="space-y-3 mb-6">
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs text-blue-400 font-mono">
                    TRIGGER: {selectedTrigger}
                  </p>
                </div>

                {steps.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500 text-sm">
                    Add agents to see the workflow flow
                  </div>
                ) : (
                  <>
                    {steps.map((step, index) => (
                      <div key={step.id}>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <p className="text-xs text-zinc-300 font-mono">
                            STEP {index + 1}: {step.agentName}
                          </p>
                        </div>
                        {index < steps.length - 1 && (
                          <div className="flex justify-center py-2">
                            <div className="w-0.5 h-4 bg-gradient-to-b from-white/20 to-transparent" />
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-xs text-green-400 font-mono">
                        OUTPUT: Content Package
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Stats */}
              {steps.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-white/10 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Total Steps:</span>
                    <span className="text-white font-mono">{steps.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Time:</span>
                    <span className="text-white font-mono">
                      ~{steps.length * 2}m
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || steps.length === 0}
                className="flex-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Workflow"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Picker Modal */}
      {showAgentPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Select an Agent</h2>
              <button
                onClick={() => setShowAgentPicker(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVAILABLE_AGENTS.map((agent) => (
                <button
                  key={agent.type}
                  onClick={() => addStep(agent.type, agent.name)}
                  className="p-4 rounded-xl border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all text-left"
                >
                  <div className="text-2xl mb-2">{agent.icon}</div>
                  <p className="font-medium text-white">{agent.name}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {agent.description}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Bot, Settings, Play, Activity, Clock, Cpu, Zap, LayoutGrid, List,
} from "lucide-react";
import { motion } from "framer-motion";
import { AgentSettingsModal } from "@/features/agents/components/AgentSettingsModal";
import { WorkflowBuilder } from "@/features/agents/components/WorkflowBuilder";

const AGENT_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
  research:  { bg: "bg-blue-500/15",   text: "text-blue-400",   glow: "shadow-blue-500/20" },
  script:    { bg: "bg-purple-500/15", text: "text-purple-400", glow: "shadow-purple-500/20" },
  seo:       { bg: "bg-emerald-500/15",text: "text-emerald-400",glow: "shadow-emerald-500/20" },
  thumbnail: { bg: "bg-orange-500/15", text: "text-orange-400", glow: "shadow-orange-500/20" },
  trend:     { bg: "bg-pink-500/15",   text: "text-pink-400",   glow: "shadow-pink-500/20" },
  analytics: { bg: "bg-cyan-500/15",   text: "text-cyan-400",   glow: "shadow-cyan-500/20" },
};

const MOCK_AGENTS = [
  { id: "1", name: "Research Agent",   type: "research",  status: "active",   model: "gpt-4o",                       provider: "openai",    temperature: 0.7, instructions: "", lastRun: "10 mins ago", usage: 1200, successRate: 98 },
  { id: "2", name: "Script Agent",     type: "script",    status: "active",   model: "claude-3-5-sonnet-20241022",   provider: "anthropic", temperature: 0.8, instructions: "", lastRun: "1 hour ago",  usage: 3400, successRate: 95 },
  { id: "3", name: "SEO Agent",        type: "seo",       status: "active",   model: "gpt-4o",                       provider: "openai",    temperature: 0.5, instructions: "", lastRun: "2 days ago",  usage: 450,  successRate: 100 },
  { id: "4", name: "Thumbnail Agent",  type: "thumbnail", status: "inactive", model: "gemini-1.5-pro",               provider: "google",    temperature: 0.7, instructions: "", lastRun: "Never",       usage: 0,    successRate: 0 },
  { id: "5", name: "Trend Agent",      type: "trend",     status: "active",   model: "gpt-4o-mini",                  provider: "openai",    temperature: 0.6, instructions: "", lastRun: "5 mins ago",  usage: 120,  successRate: 92 },
  { id: "6", name: "Analytics Agent",  type: "analytics", status: "active",   model: "claude-3-haiku-20240307",      provider: "anthropic", temperature: 0.4, instructions: "", lastRun: "1 week ago",  usage: 8900, successRate: 99 },
];

const MOCK_WORKFLOWS = [
  { id: "1", name: "Content Pipeline", trigger: "manual",    steps: ["research","script","seo","thumbnail"], executionCount: 12, lastExecution: "2 days ago" },
  { id: "2", name: "Trend Analyzer",   trigger: "scheduled", steps: ["trend","research","analytics"],        executionCount: 45, lastExecution: "1 hour ago" },
];

export default function AgentsDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [agents] = useState(MOCK_AGENTS);
  const [workflows, setWorkflows] = useState(MOCK_WORKFLOWS);

  const handleWorkflowSave = (workflow: any) => {
    setWorkflows([...workflows, { id: `workflow-${Date.now()}`, ...workflow, executionCount: 0, lastExecution: null }]);
    setShowWorkflowBuilder(false);
  };

  const stats = {
    totalAgents:    agents.length,
    activeAgents:   agents.filter(a => a.status === "active").length,
    totalTokens:    agents.reduce((s, a) => s + a.usage, 0),
    totalWorkflows: workflows.length,
  };

  if (showWorkflowBuilder) {
    return <WorkflowBuilder onSave={handleWorkflowSave} onClose={() => setShowWorkflowBuilder(false)} />;
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-glow flex items-center gap-3">
            <div className="p-2 bg-blue-500/15 rounded-xl"><Bot className="w-6 h-6 text-blue-400" /></div>
            Agent Fleet
          </h1>
          <p className="text-muted-foreground mt-1">Manage and configure your specialized AI agents.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowWorkflowBuilder(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm transition-all hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Zap className="w-4 h-4" /> New Workflow
          </button>
          <div className="flex gap-1 glass rounded-xl p-1">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Agents",  value: stats.totalAgents,                            icon: Bot,      color: "text-blue-400" },
          { label: "Active",        value: stats.activeAgents,                           icon: Activity, color: "text-emerald-400" },
          { label: "Workflows",     value: stats.totalWorkflows,                         icon: Zap,      color: "text-purple-400" },
          { label: "Total Tokens",  value: `${(stats.totalTokens / 1000).toFixed(1)}k`, icon: Cpu,      color: "text-cyan-400" },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-5 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-3xl font-bold">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Agents */}
      <div>
        <h2 className="text-xl font-bold mb-5">My Agents</h2>
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {agents.map((agent, i) => {
              const c = AGENT_COLORS[agent.type] ?? AGENT_COLORS.research;
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass rounded-2xl p-5 hover:bg-white/5 transition-all group relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 ${c.bg} blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none`} />

                  <div className="flex justify-between items-start mb-5 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${c.bg}`}>
                        <Bot className={`w-5 h-5 ${c.text}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">{agent.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "active" ? "bg-emerald-500" : "bg-zinc-600"}`} />
                          <span className="text-xs text-muted-foreground capitalize">{agent.status}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedAgent(agent)}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2.5 relative z-10">
                    {[
                      { icon: Cpu,      label: "Model",       value: agent.model,              mono: true },
                      { icon: Clock,    label: "Last Run",    value: agent.lastRun,             mono: false },
                      { icon: Activity, label: "Success",     value: `${agent.successRate}%`,   mono: false },
                    ].map(({ icon: Icon, label, value, mono }) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icon className="w-3.5 h-3.5" /> {label}
                        </div>
                        <span className={`${mono ? "font-mono text-xs bg-white/5 px-2 py-0.5 rounded-md" : ""} text-foreground`}>{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/5 relative z-10">
                    <button className={`w-full flex items-center justify-center gap-2 ${c.bg} hover:brightness-110 ${c.text} py-2 rounded-xl text-sm font-medium transition-all`}>
                      <Play className="w-3.5 h-3.5" /> Test Run
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden divide-y divide-border">
            {agents.map((agent) => {
              const c = AGENT_COLORS[agent.type] ?? AGENT_COLORS.research;
              return (
                <div key={agent.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors group">
                  <div className={`p-2 rounded-lg ${c.bg} shrink-0`}>
                    <Bot className={`w-4 h-4 ${c.text}`} />
                  </div>
                  <div className="min-w-[140px]">
                    <h3 className="text-sm font-semibold">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{agent.type}</p>
                  </div>
                  <div className="hidden md:grid grid-cols-3 gap-8 flex-1 text-sm">
                    <div><p className="text-xs text-muted-foreground">Model</p><p className="font-mono text-xs mt-0.5">{agent.model}</p></div>
                    <div><p className="text-xs text-muted-foreground">Last Run</p><p className="mt-0.5">{agent.lastRun}</p></div>
                    <div><p className="text-xs text-muted-foreground">Success</p><p className="mt-0.5">{agent.successRate}%</p></div>
                  </div>
                  <div className="flex gap-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className={`p-2 ${c.bg} ${c.text} rounded-lg transition-colors`}><Play className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setSelectedAgent(agent)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Settings className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Workflows */}
      {workflows.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-5">Active Workflows</h2>
          <div className="space-y-3">
            {workflows.map((workflow, i) => (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="glass rounded-2xl p-4 hover:bg-white/5 transition-all flex items-center gap-4 group"
              >
                <div className="p-2.5 bg-purple-500/15 rounded-xl shrink-0">
                  <Zap className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{workflow.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{workflow.steps.length} agents · {workflow.trigger}</p>
                </div>
                <div className="hidden md:grid grid-cols-3 gap-8 text-sm">
                  <div><p className="text-xs text-muted-foreground">Executions</p><p className="font-mono mt-0.5">{workflow.executionCount}</p></div>
                  <div><p className="text-xs text-muted-foreground">Last Run</p><p className="mt-0.5">{workflow.lastExecution || "Never"}</p></div>
                  <div><p className="text-xs text-muted-foreground">Status</p><p className="text-emerald-400 mt-0.5">Active</p></div>
                </div>
                <button className="p-2 bg-purple-500/15 text-purple-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:brightness-110 ml-auto">
                  <Play className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {selectedAgent && <AgentSettingsModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />}
    </div>
  );
}

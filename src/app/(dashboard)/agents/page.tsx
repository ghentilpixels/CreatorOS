'use client';

import { useState } from 'react';
import { Bot, Settings, Play, Activity, Clock, Cpu, Zap, Plus, LayoutGrid, List } from 'lucide-react';
import { motion } from 'framer-motion';
import { AgentSettingsModal } from '@/features/agents/components/AgentSettingsModal';
import { WorkflowBuilder } from '@/features/agents/components/WorkflowBuilder';

const MOCK_AGENTS = [
  { id: '1', name: 'Research Agent', type: 'research', status: 'active', model: 'gpt-4o', provider: 'openai', userId: 'user1', temperature: 0.7, instructions: '', lastRun: '10 mins ago', usage: 1200, successRate: 98 },
  { id: '2', name: 'Script Agent', type: 'script', status: 'active', model: 'claude-3-5-sonnet-20241022', provider: 'anthropic', userId: 'user1', temperature: 0.8, instructions: '', lastRun: '1 hour ago', usage: 3400, successRate: 95 },
  { id: '3', name: 'SEO Agent', type: 'seo', status: 'active', model: 'gpt-4o', provider: 'openai', userId: 'user1', temperature: 0.5, instructions: '', lastRun: '2 days ago', usage: 450, successRate: 100 },
  { id: '4', name: 'Thumbnail Agent', type: 'thumbnail', status: 'inactive', model: 'gemini-1.5-pro', provider: 'google', userId: 'user1', temperature: 0.7, instructions: '', lastRun: 'Never', usage: 0, successRate: 0 },
  { id: '5', name: 'Trend Agent', type: 'trend', status: 'active', model: 'gpt-4o-mini', provider: 'openai', userId: 'user1', temperature: 0.6, instructions: '', lastRun: '5 mins ago', usage: 120, successRate: 92 },
  { id: '6', name: 'Analytics Agent', type: 'analytics', status: 'active', model: 'claude-3-haiku-20240307', provider: 'anthropic', userId: 'user1', temperature: 0.4, instructions: '', lastRun: '1 week ago', usage: 8900, successRate: 99 },
];

const MOCK_WORKFLOWS = [
  {
    id: '1',
    name: 'Content Pipeline',
    trigger: 'manual',
    steps: ['research', 'script', 'seo', 'thumbnail'],
    executionCount: 12,
    lastExecution: '2 days ago',
  },
  {
    id: '2',
    name: 'Trend Analyzer',
    trigger: 'scheduled',
    steps: ['trend', 'research', 'analytics'],
    executionCount: 45,
    lastExecution: '1 hour ago',
  },
];

export default function AgentsDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [agents, setAgents] = useState(MOCK_AGENTS);
  const [workflows, setWorkflows] = useState(MOCK_WORKFLOWS);

  const handleWorkflowSave = (workflow: any) => {
    console.log('Workflow saved:', workflow);
    setWorkflows([
      ...workflows,
      {
        id: `workflow-${Date.now()}`,
        ...workflow,
        executionCount: 0,
        lastExecution: null,
      },
    ]);
    setShowWorkflowBuilder(false);
  };

  const stats = {
    totalAgents: agents.length,
    activeAgents: agents.filter((a) => a.status === 'active').length,
    totalTokens: agents.reduce((sum, a) => sum + a.usage, 0),
    totalWorkflows: workflows.length,
  };

  if (showWorkflowBuilder) {
    return (
      <WorkflowBuilder
        onSave={handleWorkflowSave}
        onClose={() => setShowWorkflowBuilder(false)}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
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
          <div className="flex gap-3">
            <button
              onClick={() => setShowWorkflowBuilder(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              <Zap className="w-4 h-4" />
              New Workflow
            </button>
            <div className="flex gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white/10 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white/10 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Agents', value: stats.totalAgents, icon: Bot },
            { label: 'Active', value: stats.activeAgents, icon: Activity },
            { label: 'Workflows', value: stats.totalWorkflows, icon: Zap },
            { label: 'Total Tokens', value: `${(stats.totalTokens / 1000).toFixed(1)}k`, icon: Cpu },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-zinc-400 text-sm">{label}</p>
                <Icon className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Agents Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6">My Agents</h2>

          {viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl hover:bg-zinc-900/60 transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${
                          agent.status === 'active'
                            ? 'bg-green-500/20'
                            : 'bg-zinc-800'
                        }`}
                      >
                        <Bot
                          className={`w-5 h-5 ${
                            agent.status === 'active'
                              ? 'text-green-400'
                              : 'text-zinc-500'
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {agent.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              agent.status === 'active'
                                ? 'bg-green-500'
                                : 'bg-zinc-600'
                            }`}
                          />
                          <span className="text-xs text-zinc-400 capitalize">
                            {agent.status}
                          </span>
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
                      <span className="text-zinc-300 bg-white/5 px-2 py-1 rounded-md text-xs font-mono">
                        {agent.model}
                      </span>
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
                        Success Rate
                      </div>
                      <span className="text-zinc-300">
                        {agent.successRate}%
                      </span>
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
          ) : (
            /* List View */
            <div className="space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 backdrop-blur-xl hover:bg-zinc-900/60 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`p-2 rounded-lg ${
                        agent.status === 'active'
                          ? 'bg-green-500/20'
                          : 'bg-zinc-800'
                      }`}
                    >
                      <Bot
                        className={`w-4 h-4 ${
                          agent.status === 'active'
                            ? 'text-green-400'
                            : 'text-zinc-500'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-zinc-500">{agent.type}</p>
                    </div>
                    <div className="grid grid-cols-4 gap-8 flex-1">
                      <div>
                        <p className="text-xs text-zinc-500">Model</p>
                        <p className="text-sm text-white font-mono">
                          {agent.model}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Last Run</p>
                        <p className="text-sm text-white">
                          {agent.lastRun}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Success Rate</p>
                        <p className="text-sm text-white">
                          {agent.successRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Status</p>
                        <p
                          className={`text-sm font-medium capitalize ${
                            agent.status === 'active'
                              ? 'text-green-400'
                              : 'text-zinc-500'
                          }`}
                        >
                          {agent.status}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400 hover:text-blue-300">
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedAgent(agent)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Workflows Section */}
        {workflows.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Active Workflows</h2>
            <div className="space-y-3">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 backdrop-blur-xl hover:bg-zinc-900/60 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Zap className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white">
                        {workflow.name}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        {workflow.steps.length} agents • {workflow.trigger}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-8 flex-1">
                      <div>
                        <p className="text-xs text-zinc-500">Executions</p>
                        <p className="text-sm text-white font-mono">
                          {workflow.executionCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Last Run</p>
                        <p className="text-sm text-white">
                          {workflow.lastExecution || 'Never'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Status</p>
                        <p className="text-sm text-white font-medium">Active</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400 hover:text-blue-300">
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedAgent && (
        <AgentSettingsModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}
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

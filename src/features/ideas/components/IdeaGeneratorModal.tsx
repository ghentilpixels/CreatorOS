"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, X } from "lucide-react";
import { generateIdeasAI, createIdea } from "@/features/ideas/actions";
import { GeneratedIdea } from "@/lib/ai/agents/IdeaAgent";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function IdeaGeneratorModal({ isOpen, onClose, onSuccess }: Props) {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<GeneratedIdea[] | null>(null);

  if (!isOpen) return null;

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await generateIdeasAI(topic, platform);
    if (res.success && res.data) {
      setIdeas(res.data);
    } else {
      alert("Failed to generate ideas. Ensure AI key is set.");
    }
    setLoading(false);
  }

  async function handleSave(idea: GeneratedIdea) {
    await createIdea(idea);
    onSuccess();
    // Remove from list
    setIdeas(ideas?.filter(i => i !== idea) || null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            AI Idea Generator
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {!ideas ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Topic / Keyword</label>
                <input 
                  autoFocus
                  required
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. Minimalist Desk Setup"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Platform (Optional)</label>
                <input 
                  value={platform}
                  onChange={e => setPlatform(e.target.value)}
                  placeholder="e.g. YouTube Shorts"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Generate Ideas
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-zinc-400 mb-4">Click "Save" to add these to your inbox.</p>
              {ideas.length === 0 && <p className="text-zinc-400">No ideas generated.</p>}
              {ideas.map((idea, idx) => (
                <div key={idx} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-start gap-4 justify-between group transition-colors hover:border-indigo-500/50">
                  <div>
                    <h4 className="font-medium text-zinc-100 mb-1">{idea.title}</h4>
                    <p className="text-sm text-zinc-400">{idea.description}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-500/10 text-blue-400 uppercase tracking-wider">
                      {idea.platform}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleSave(idea)}
                    className="px-4 py-2 text-sm font-medium bg-zinc-800 text-zinc-300 hover:bg-white hover:text-black rounded-lg transition-all whitespace-nowrap"
                  >
                    Save
                  </button>
                </div>
              ))}
              {ideas.length === 0 && (
                <button onClick={() => setIdeas(null)} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                  Try Again
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

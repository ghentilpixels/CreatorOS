"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Plus, Lightbulb } from "lucide-react";
import { IdeaCard } from "@/features/ideas/components/IdeaCard";
import { IdeaGeneratorModal } from "@/features/ideas/components/IdeaGeneratorModal";
import { getIdeas } from "@/features/ideas/actions";

export default function IdeasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIdeas = async () => {
    setLoading(true);
    const res = await getIdeas();
    if (res.success && res.data) {
      setIdeas(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header section */}
      <div className="relative border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-glow flex items-center gap-3">
                <Lightbulb className="w-8 h-8 text-indigo-400" />
                Idea Inbox
              </h1>
              <p className="text-muted-foreground mt-2 text-sm max-w-xl">
                Store your raw concepts, generate new ones with AI, and refine them before moving to production.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all bg-indigo-600 rounded-xl hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-background shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
            >
              <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />
              Generate Ideas
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer pointer-events-none" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : ideas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
              <Lightbulb className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No ideas yet</h3>
            <p className="text-zinc-400 mb-8 max-w-md">
              Your idea inbox is empty. Use the AI generator to spark some inspiration or add them manually.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors font-medium text-sm text-zinc-300 hover:text-white"
            >
              <Plus className="w-4 h-4" />
              Add your first idea
            </button>
          </div>
        )}
      </div>

      <IdeaGeneratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchIdeas();
        }}
      />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Plus, Lightbulb } from "lucide-react";
import { IdeaCard } from "@/features/ideas/components/IdeaCard";
import { IdeaGeneratorModal } from "@/features/ideas/components/IdeaGeneratorModal";
import { getIdeas } from "@/features/ideas/actions";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-8 pb-10">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-glow flex items-center gap-3">
            <div className="p-2 bg-indigo-500/15 rounded-xl">
              <Lightbulb className="w-6 h-6 text-indigo-400" />
            </div>
            Idea Inbox
          </h1>
          <p className="text-muted-foreground mt-1 max-w-xl">
            Store raw concepts, generate new ones with AI, and refine them.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 group relative overflow-hidden"
        >
          <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />
          Generate Ideas
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer pointer-events-none" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : ideas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-3xl p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
            <div className="w-20 h-20 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center mb-6 relative z-10 shadow-xl shadow-indigo-500/10">
              <Lightbulb className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2 relative z-10">No ideas yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md relative z-10">
              Your idea inbox is empty. Use the AI generator to spark some inspiration or add them manually.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              className="gap-2 bg-background/50 border-white/10 hover:bg-white/5 relative z-10"
            >
              <Plus className="w-4 h-4" /> Add your first idea
            </Button>
          </div>
        )}
      </div>

      <IdeaGeneratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchIdeas()}
      />
    </div>
  );
}

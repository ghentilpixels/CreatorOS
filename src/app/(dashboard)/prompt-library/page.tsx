"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Copy, Check, MessageSquare, Tag, FolderOpen, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockPrompts = [
  {
    id: 1,
    title: "YouTube Hook Generator",
    category: "Scripts",
    content:
      "Act as an expert YouTube scriptwriter. Generate 3 high-retention hooks for a video titled '[INSERT TITLE]'. The hooks should use the 'Open Loop' psychological principle.",
    tags: ["youtube", "hooks", "retention"],
    uses: 124,
  },
  {
    id: 2,
    title: "SEO Description Writer",
    category: "SEO",
    content:
      "Write a YouTube video description optimized for search. Include timestamps, 3 external links, and natural keyword density for the topic '[INSERT TOPIC]'.",
    tags: ["seo", "description"],
    uses: 89,
  },
  {
    id: 3,
    title: "Sponsorship Outreach Email",
    category: "Business",
    content:
      "Write a concise, professional outreach email to a brand manager at [COMPANY]. Highlight my channel's demographics (Tech, 18-35) and pitch a seamless integration.",
    tags: ["email", "sponsors"],
    uses: 42,
  },
  {
    id: 4,
    title: "Thumbnail Concept Brainstorm",
    category: "Ideas",
    content:
      "Provide 5 distinct, high-contrast thumbnail concepts for a video about [TOPIC]. Describe the background, foreground subject, and large text overlay for each.",
    tags: ["design", "thumbnails"],
    uses: 215,
  },
];

const categories = ["All", "Scripts", "SEO", "Business", "Ideas", "Community"];

const CATEGORY_COLORS: Record<string, { pill: string; dot: string }> = {
  Scripts:   { pill: "bg-purple-500/15 text-purple-400 border-purple-500/20", dot: "bg-purple-500" },
  SEO:       { pill: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500" },
  Business:  { pill: "bg-blue-500/15 text-blue-400 border-blue-500/20", dot: "bg-blue-500" },
  Ideas:     { pill: "bg-amber-500/15 text-amber-400 border-amber-500/20", dot: "bg-amber-500" },
  Community: { pill: "bg-pink-500/15 text-pink-400 border-pink-500/20", dot: "bg-pink-500" },
};

export default function PromptLibrary() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleCopy = (id: number, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPrompts = mockPrompts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 pb-6">
      {/* Sidebar */}
      <div className="w-full md:w-60 shrink-0 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-glow mb-1">Prompt Library</h1>
          <p className="text-sm text-muted-foreground">Your personal AI system prompts.</p>
        </div>

        <Button className="w-full gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> New Prompt
        </Button>

        <div className="space-y-0.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-3">Categories</h4>
          {categories.map((cat) => {
            const cc = CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                  activeCategory === cat
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {cat === "All" ? (
                  <FolderOpen className="w-4 h-4 shrink-0" />
                ) : (
                  <span className={`w-2 h-2 rounded-full shrink-0 ${cc?.dot ?? "bg-zinc-500"}`} />
                )}
                {cat}
                <span className="ml-auto text-xs opacity-50">
                  {cat === "All" ? mockPrompts.length : mockPrompts.filter(p => p.category === cat).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden glass rounded-3xl border-white/5 shadow-2xl relative">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        {/* Search Bar */}
        <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row gap-3 justify-between items-center bg-background/20 backdrop-blur-md relative z-10">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              className="pl-9 bg-background/50 border-white/10 focus:border-primary/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0 glass px-3 py-1.5 rounded-lg">
            <MessageSquare className="w-4 h-4" />
            <span>{filteredPrompts.length} Prompts</span>
          </div>
        </div>

        {/* Prompt Grid */}
        <div className="flex-1 overflow-y-auto p-5 relative z-10">
          {filteredPrompts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 text-muted-foreground">
              <MessageSquare className="w-12 h-12 opacity-10 mb-4" />
              <h3 className="text-base font-medium mb-1">No prompts found</h3>
              <p className="text-sm max-w-xs">Try adjusting your search or category filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {filteredPrompts.map((prompt, i) => {
                const cc = CATEGORY_COLORS[prompt.category];
                const isExpanded = expandedId === prompt.id;
                return (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-background/40 border border-white/8 rounded-2xl p-5 hover:border-white/15 hover:bg-background/60 transition-all flex flex-col group"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base group-hover:text-primary transition-colors truncate">
                          {prompt.title}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1.5 inline-flex items-center gap-1 border ${cc?.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cc?.dot}`} />
                          {prompt.category}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(prompt.id, prompt.content)}
                        className="p-2 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        title="Copy prompt"
                      >
                        {copiedId === prompt.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Content */}
                    <div
                      className="bg-black/20 border border-white/5 p-4 rounded-xl text-sm text-muted-foreground mb-4 flex-1 font-mono leading-relaxed cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : prompt.id)}
                    >
                      <p className={isExpanded ? "" : "line-clamp-3"}>{prompt.content}</p>
                      {!isExpanded && prompt.content.length > 120 && (
                        <span className="text-primary text-xs mt-1 inline-block hover:underline">Show more</span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5 flex-wrap">
                        {prompt.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] uppercase tracking-wider text-muted-foreground bg-white/5 border border-white/5 px-2 py-0.5 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Heart className="w-3 h-3" /> {prompt.uses}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

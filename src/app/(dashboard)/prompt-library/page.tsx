"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Copy,
  Check,
  MessageSquare,
  Tag,
  FolderOpen,
  Heart,
} from "lucide-react";
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

export default function PromptLibrary() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (id: number, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPrompts = mockPrompts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 pb-6">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-glow mb-1">
            Prompt Library
          </h1>
          <p className="text-sm text-muted-foreground">
            Your personal AI system prompts.
          </p>
        </div>

        <Button className="w-full gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> New Prompt
        </Button>

        <div className="space-y-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">
            Categories
          </h4>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeCategory === cat
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {cat === "All" ? (
                <FolderOpen className="w-4 h-4" />
              ) : (
                <Tag className="w-4 h-4" />
              )}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden glass rounded-3xl border-white/5 shadow-2xl relative">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

        {/* Header / Search */}
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-background/30 backdrop-blur-md relative z-10">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              className="pl-9 bg-background/50 border-white/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
            <MessageSquare className="w-4 h-4" /> {filteredPrompts.length}{" "}
            Prompts
          </div>
        </div>

        {/* Prompt Grid */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredPrompts.map((prompt, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={prompt.id}
                className="bg-background/40 border border-white/10 rounded-2xl p-5 hover:bg-background/60 transition-colors flex flex-col group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {prompt.title}
                    </h3>
                    <span className="text-xs text-primary font-medium px-2 py-0.5 bg-primary/10 rounded-md mt-1 inline-block">
                      {prompt.category}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full opacity-50 group-hover:opacity-100 transition-opacity hover:bg-primary/20 hover:text-primary"
                    onClick={() => handleCopy(prompt.id, prompt.content)}
                  >
                    {copiedId === prompt.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="bg-black/20 p-4 rounded-xl text-sm text-muted-foreground mb-4 flex-1 border border-white/5 font-mono leading-relaxed line-clamp-4">
                  {prompt.content}
                </div>

                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="flex gap-2">
                    {prompt.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-wider text-muted-foreground bg-white/5 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Heart className="w-3.5 h-3.5" /> {prompt.uses}
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredPrompts.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-medium">No prompts found</h3>
                <p className="text-muted-foreground text-sm max-w-sm mt-1">
                  Try adjusting your search or category filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

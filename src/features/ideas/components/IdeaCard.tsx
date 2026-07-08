"use client";

import React from "react";
import { Lightbulb, PlaySquare, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";

interface Idea {
  id: string;
  title: string;
  description?: string;
  status: string;
  platform?: string;
}

interface Props {
  idea: Idea;
}

export function IdeaCard({ idea }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all cursor-pointer group flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
          <Lightbulb className="w-5 h-5" />
        </div>
        <button className="text-zinc-600 hover:text-zinc-300 transition-colors p-1 rounded-md hover:bg-zinc-800">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      
      <h3 className="font-semibold text-zinc-100 mb-2 line-clamp-2 leading-snug">{idea.title}</h3>
      <p className="text-sm text-zinc-400 mb-4 line-clamp-3">
        {idea.description || "No description provided."}
      </p>

      <div className="flex items-center gap-2 mt-auto pt-4 border-t border-zinc-800/50">
        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-zinc-800 text-zinc-300">
          {idea.status}
        </span>
        {idea.platform && (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400 flex items-center gap-1">
            <PlaySquare className="w-3 h-3" />
            {idea.platform}
          </span>
        )}
      </div>
    </motion.div>
  );
}

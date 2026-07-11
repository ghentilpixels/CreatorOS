"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FileText, ChevronRight, Search, Plus, ExternalLink, Download, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockDocs = [
  {
    id: 1,
    title: "Video Editing Guidelines",
    folder: "Post-Production",
    lastUpdated: "2 days ago",
    content: `
      <h2>Video Editing Guidelines & SOP</h2>
      <p>This document outlines the standard operating procedure for editing all main-channel YouTube videos.</p>
      
      <h3>1. Assembly & A-Roll</h3>
      <ul>
        <li>Sync all audio and video tracks using PluralEyes or Premiere's built-in sync.</li>
        <li>Cut out all dead air, mistakes, and excessive 'umms' or 'ahhs'.</li>
        <li>Keep the pacing extremely tight for the first 30 seconds (The Hook).</li>
      </ul>

      <h3>2. B-Roll & Visuals</h3>
      <ul>
        <li>Insert B-Roll every 10-15 seconds to maintain visual interest.</li>
        <li>Use the <strong>Zoom-in</strong> effect (105% scale) on crucial points to emphasize the message.</li>
        <li>Apply the standard color grade LUT (CreatorOS_Primary.cube).</li>
      </ul>

      <h3>3. Audio Mixing</h3>
      <ul>
        <li>Normalize dialogue to -6dB.</li>
        <li>Background music should sit at -25dB during dialogue, and -12dB during montages.</li>
        <li>Apply a mild compressor and EQ to boost vocals.</li>
      </ul>
    `
  },
  { id: 2, title: "Studio Lighting Setup", folder: "Production", lastUpdated: "1 week ago", content: "<p>Content goes here...</p>" },
  { id: 3, title: "Sponsorship Rate Card", folder: "Business", lastUpdated: "2 weeks ago", content: "<p>Content goes here...</p>" },
  { id: 4, title: "SEO Checklist", folder: "Pre-Production", lastUpdated: "1 month ago", content: "<p>Content goes here...</p>" },
];

const folders = ["All Documents", "Pre-Production", "Production", "Post-Production", "Business"];

const FOLDER_COLORS: Record<string, { icon: string; bg: string }> = {
  "All Documents":   { icon: "text-primary",      bg: "bg-primary/10" },
  "Pre-Production":  { icon: "text-yellow-400",   bg: "bg-yellow-500/10" },
  "Production":      { icon: "text-blue-400",     bg: "bg-blue-500/10" },
  "Post-Production": { icon: "text-purple-400",   bg: "bg-purple-500/10" },
  "Business":        { icon: "text-emerald-400",  bg: "bg-emerald-500/10" },
};

export default function KnowledgeBase() {
  const [activeFolder, setActiveFolder] = useState("All Documents");
  const [activeDocId, setActiveDocId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = mockDocs.filter(doc =>
    (activeFolder === "All Documents" || doc.folder === activeFolder) &&
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDoc = mockDocs.find(d => d.id === activeDocId);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 pb-6">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-72 shrink-0 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-glow flex items-center gap-2 mb-1">
            <BookOpen className="w-6 h-6 text-primary" /> Knowledge Base
          </h1>
          <p className="text-sm text-muted-foreground">Standard Operating Procedures.</p>
        </div>

        <Button className="w-full gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> New Document
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search docs..."
            className="pl-9 bg-background/50 border-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Folder list */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {folders.map(folder => {
            const fc = FOLDER_COLORS[folder];
            const folderDocs = mockDocs.filter(d => d.folder === folder);
            if (folder !== "All Documents" && folderDocs.length === 0) return null;

            return (
              <div key={folder}>
                <button
                  onClick={() => setActiveFolder(folder)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeFolder === folder
                      ? `${fc.bg} ${fc.icon}`
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <Folder className="w-4 h-4 shrink-0" />
                  {folder}
                  {folder !== "All Documents" && (
                    <span className="ml-auto text-xs opacity-60">{folderDocs.length}</span>
                  )}
                </button>

                {(activeFolder === folder || activeFolder === "All Documents") && folder !== "All Documents" && (
                  <div className="mt-1 ml-3 pl-3 border-l border-white/8 flex flex-col gap-0.5">
                    {folderDocs.map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => setActiveDocId(doc.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                          activeDocId === doc.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{doc.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 flex flex-col overflow-hidden glass rounded-3xl border-white/5 shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

        <AnimatePresence mode="wait">
          {activeDoc ? (
            <motion.div
              key={activeDoc.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full relative z-10"
            >
              {/* Doc header */}
              <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-background/30 backdrop-blur-md">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">
                    <span>{activeDoc.folder}</span>
                    <ChevronRight className="w-3 h-3" />
                    <span>{activeDoc.title}</span>
                  </div>
                  <h2 className="text-2xl font-bold">{activeDoc.title}</h2>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" className="bg-background/50 border-white/10 hover:bg-white/5 gap-2">
                    <Download className="w-4 h-4" /> PDF
                  </Button>
                  <Button size="sm" className="shadow-lg shadow-primary/20">Edit</Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-gradient-to-b from-transparent to-background/20">
                <div className="max-w-3xl mx-auto prose prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-li:marker:text-primary/50">
                  <div dangerouslySetInnerHTML={{ __html: activeDoc.content }} />

                  <div className="mt-12 pt-6 border-t border-white/10 text-xs text-muted-foreground flex items-center justify-between">
                    <span>Last updated {activeDoc.lastUpdated}</span>
                    <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground gap-1 text-xs">
                      <ExternalLink className="w-3 h-3" /> View History
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground relative z-10">
              <FileText className="w-16 h-16 opacity-10 mb-4" />
              <p>Select a document to view its contents.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

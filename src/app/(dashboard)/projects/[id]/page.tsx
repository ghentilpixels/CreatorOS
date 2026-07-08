"use client";

import { useState } from "react";
import Link from "next/link";
import { use } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Plus, Settings, PlaySquare, Eye, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "@/features/projects/components/KanbanBoard";

const mockProject = {
  id: "1",
  title: "Tech Reviews Channel",
  description: "Main YouTube channel focusing on tech hardware and software reviews.",
  platform: "YouTube",
  category: "Technology",
  targetAudience: "Tech enthusiasts, early adopters, developers",
  status: "active",
  createdAt: "2024-01-15",
  subscribers: "124K",
  totalViews: "12.5M",
  avgWatchTime: "4:20",
};

export default function ProjectWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  // We would normally fetch the project using resolvedParams.id
  
  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/projects" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ChevronLeft className="w-4 h-4" /> Back to Projects
        </Link>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-inner">
              <PlaySquare className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-glow">{mockProject.title}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-md border border-primary/20">
                  {mockProject.platform}
                </span>
                <span className="text-xs text-muted-foreground">{mockProject.category}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="glass">
              <Settings className="w-4 h-4" />
            </Button>
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" /> New Video
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="content" className="w-full">
        <div className="border-b border-border mb-6 overflow-x-auto scrollbar-hide">
          <TabsList className="bg-transparent h-12 p-0 gap-6 w-full justify-start rounded-none">
            {["Overview", "Content", "Research", "Scripts", "Analytics"].map((tab) => (
              <TabsTrigger 
                key={tab}
                value={tab.toLowerCase()} 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 text-muted-foreground data-[state=active]:text-foreground relative"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <section className="glass p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4">Project Details</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {mockProject.description}
                </p>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block mb-1">Target Audience</span>
                    <span className="font-medium">{mockProject.targetAudience}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Created</span>
                    <span className="font-medium">{new Date(mockProject.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </section>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Channel Stats</h3>
              <div className="glass p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <Eye className="w-5 h-5" />
                  </div>
                  <span className="text-muted-foreground text-sm">Total Views</span>
                </div>
                <span className="font-bold text-lg">{mockProject.totalViews}</span>
              </div>
              <div className="glass p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-muted-foreground text-sm">Subscribers</span>
                </div>
                <span className="font-bold text-lg">{mockProject.subscribers}</span>
              </div>
              <div className="glass p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-muted-foreground text-sm">Avg Watch</span>
                </div>
                <span className="font-bold text-lg">{mockProject.avgWatchTime}</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-0 focus-visible:outline-none focus-visible:ring-0 h-[calc(100vh-280px)] min-h-[500px]">
          <KanbanBoard projectId={resolvedParams.id} />
        </TabsContent>

        <TabsContent value="research" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="glass p-12 rounded-2xl text-center border-dashed border-2 border-white/10">
            <h3 className="text-xl font-semibold mb-2">Research Module</h3>
            <p className="text-muted-foreground">Coming soon: Connect AI tools to analyze trending topics in your niche.</p>
          </div>
        </TabsContent>

        <TabsContent value="scripts" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="glass p-12 rounded-2xl text-center border-dashed border-2 border-white/10">
            <h3 className="text-xl font-semibold mb-2">Script Studio</h3>
            <p className="text-muted-foreground">Coming soon: AI-assisted script writing and teleprompter mode.</p>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="glass p-12 rounded-2xl text-center border-dashed border-2 border-white/10">
            <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
            <p className="text-muted-foreground">Coming soon: Deep dive into your video performance metrics.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

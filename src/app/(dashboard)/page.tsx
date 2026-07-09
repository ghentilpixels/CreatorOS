"use client";

import { motion } from "framer-motion";
import {
  Plus,
  Search,
  FileText,
  Image as ImageIcon,
  PlaySquare,
  TrendingUp,
  Clock,
  MoreVertical,
  Sparkles,
} from "lucide-react";
import { UpgradeToPro } from "@/components/upgrade/upgrade-modal";
import { Button } from "@/components/ui/button";

const quickActions = [
  { name: "New Project", icon: Plus, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { name: "Research Topic", icon: Search, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { name: "Generate Script", icon: FileText, color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  { name: "Create Thumbnail", icon: ImageIcon, color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
];

const stats = [
  { label: "Total Projects", value: "24", trend: "+12%", isUp: true },
  { label: "Videos Created", value: "12", trend: "+3", isUp: true },
  { label: "AI Generations", value: "1,284", trend: "+124", isUp: true },
  { label: "Published Videos", value: "8", trend: "0", isUp: true },
];

const recentProjects = [
  { name: "React 19 Complete Guide", status: "In Progress", date: "2 hours ago", type: "Tutorial" },
  { name: "Top 5 AI Tools for Creators", status: "Draft", date: "Yesterday", type: "Listicle" },
  { name: "Building a SaaS with Next.js", status: "Published", date: "3 days ago", type: "Vlog" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 pb-10">
      <section className="relative p-8 rounded-2xl overflow-hidden glass border-primary/20 bg-gradient-to-br from-primary/10 via-background/50 to-background/50">
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight mb-2 text-glow"
          >
            Welcome back, Creator
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-lg"
          >
            Your content operating system is ready. Let's make something amazing today.
          </motion.p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-primary/20 to-transparent blur-3xl pointer-events-none" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl glass hover:bg-white/5 transition-colors cursor-default"
          >
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.isUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <PlaySquare className="w-5 h-5 text-primary" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + (i * 0.05) }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-3 text-center transition-all ${action.color}`}
            >
              <action.icon className="w-6 h-6" />
              <span className="font-medium text-sm">{action.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Projects</h2>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="divide-y divide-border">
              {recentProjects.map((project, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  key={project.name}
                  className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <PlaySquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>{project.type}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{project.date}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium px-2 py-1 bg-white/5 rounded-full border border-white/10">
                      {project.status}
                    </span>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-muted-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <UpgradeToPro>
            <div className="p-5 rounded-2xl glass border-primary/20 bg-gradient-to-br from-primary/10 via-background/50 to-background/50 cursor-pointer group hover:from-primary/15 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <h3 className="font-semibold text-sm">Unlock CreatorOS Pro</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Get unlimited AI generations, all studios, and custom agents.
              </p>
              <Button size="sm" className="w-full group-hover:opacity-90 transition-opacity">
                Upgrade to Pro
              </Button>
            </div>
          </UpgradeToPro>

          <h2 className="text-xl font-bold pt-2">Today's Tasks</h2>
          <div className="glass rounded-2xl p-4">
            <div className="space-y-3">
              {[
                { title: "Review React 19 Script", time: "10:00 AM", done: false },
                { title: "Design Thumbnail", time: "2:00 PM", done: false },
                { title: "SEO Keyword Research", time: "4:30 PM", done: false }
              ].map((task, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  key={task.title}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="mt-0.5 w-4 h-4 rounded-full border border-muted-foreground flex-shrink-0 group-hover:border-primary transition-colors" />
                  <div>
                    <h4 className="text-sm font-medium">{task.title}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {task.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
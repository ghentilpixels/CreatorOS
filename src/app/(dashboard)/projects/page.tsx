"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  MoreVertical,
  Search,
  MonitorPlay as Youtube,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getProjects, createProject } from "@/features/projects/actions";

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createData, setCreateData] = useState({ name: "", platform: "YouTube", category: "" });

  const fetchProjects = async () => {
    setLoading(true);
    const res = await getProjects();
    if (res.success && "projects" in res) {
      setProjects(res.projects.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description || "No description provided.",
        platform: p.platform || "YouTube",
        category: p.category || "",
        status: p.status,
        updatedAt: new Date(p.updatedAt).toLocaleDateString(),
        videosCount: p._count?.videos || 0
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    if (!createData.name) return;
    setIsCreating(true);
    const res = await createProject(createData.name, createData.platform, createData.category);
    setIsCreating(false);
    if (res.success) {
      setIsCreateOpen(false);
      fetchProjects();
      setCreateData({ name: "", platform: "YouTube", category: "" });
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-glow">
            Projects
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your content channels and brands.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" /> New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] glass border-white/10">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Set up a new channel or content brand workspace.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Tech Channel"
                  className="bg-background/50"
                  value={createData.name}
                  onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="platform">Platform</Label>
                <Input
                  id="platform"
                  defaultValue="YouTube"
                  className="bg-background/50"
                  value={createData.platform}
                  onChange={(e) => setCreateData({ ...createData, platform: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g. Technology, Education"
                  className="bg-background/50"
                  value={createData.category}
                  onChange={(e) => setCreateData({ ...createData, category: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isCreating}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isCreating || !createData.name}>
                {isCreating ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9 bg-muted/50 border-transparent focus:border-primary/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center glass rounded-2xl border-dashed border-2 border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Youtube className="w-8 h-8 text-primary opacity-50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            You don't have any projects matching your search. Create a new one
            to get started.
          </p>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Create Project
          </Button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`group glass rounded-2xl p-5 hover:bg-white/5 transition-all cursor-pointer relative overflow-hidden ${
                viewMode === "list"
                  ? "flex items-center gap-6"
                  : "flex flex-col"
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 transition-opacity group-hover:bg-primary/10" />

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-inner">
                  <Youtube className="w-6 h-6 text-primary" />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 -mr-2 rounded-lg hover:bg-white/10 text-muted-foreground transition-colors outline-none focus:ring-2 focus:ring-primary/50">
                    <MoreVertical className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="glass border-white/10"
                  >
                    <DropdownMenuItem>Edit Project</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-500/10">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div
                className={`relative z-10 ${viewMode === "list" ? "flex-1" : "flex-1"}`}
              >
                <Link href={`/projects/${project.id}`} className="block">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {project.description}
                  </p>
                </Link>

                <div className="flex items-center gap-3 mt-auto">
                  <span className="text-xs font-medium px-2 py-1 bg-white/5 rounded-md border border-white/10 flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${project.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`}
                    />
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="font-medium text-foreground">
                      {project.videosCount}
                    </span>{" "}
                    videos
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

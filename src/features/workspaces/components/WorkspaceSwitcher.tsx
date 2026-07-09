"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ChevronDown, Plus, Check } from "lucide-react";
import { getWorkspaces, createWorkspace, switchWorkspace } from "../actions";
import type { PlanId } from "@/lib/subscription/plans";

interface WorkspaceItem {
  id: string;
  name: string;
  slug: string;
  plan: string;
  role: string;
}

export function WorkspaceSwitcher() {
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchWorkspaces = async () => {
    setLoading(true);
    const result = await getWorkspaces();
    if (result.success && "workspaces" in result) {
      const list = result.workspaces as WorkspaceItem[];
      setWorkspaces(list);
      if (!activeId && list.length > 0) setActiveId(list[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const active = workspaces.find((w) => w.id === activeId) ?? workspaces[0];

  const handleSwitch = async (id: string) => {
    setOpen(false);
    const result = await switchWorkspace(id);
    if (result.success) {
      setActiveId(id);
      window.location.reload();
    }
  };

  const handleCreate = async () => {
    const name = window.prompt("Workspace name");
    if (!name) return;
    setCreating(true);
    const result = await createWorkspace(name, "free");
    setCreating(false);
    if (result.success) {
      fetchWorkspaces();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
      >
        <Building2 className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium max-w-[140px] truncate">
          {loading ? "Loading..." : active?.name ?? "Workspace"}
        </span>
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute top-full left-0 mt-2 w-64 z-50 glass rounded-xl border-white/10 p-2 shadow-xl"
            >
              <div className="text-xs font-medium text-muted-foreground px-2 py-1.5 uppercase tracking-wide">
                Workspaces
              </div>
              {workspaces.map((w) => (
                <button
                  key={w.id}
                  onClick={() => handleSwitch(w.id)}
                  className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium">{w.name}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">
                      {w.plan} • {w.role}
                    </p>
                  </div>
                  {w.id === activeId && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
              <div className="border-t border-white/10 my-1" />
              <button
                onClick={handleCreate}
                disabled={creating}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm text-muted-foreground"
              >
                <Plus className="w-4 h-4" />
                {creating ? "Creating..." : "Create workspace"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

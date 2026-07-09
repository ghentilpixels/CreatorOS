"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, Mail, Loader2, AlertCircle, Shield, User, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getCurrentWorkspace,
  inviteMember,
  updateMemberRole,
  removeMember,
} from "../actions";
import type { WorkspaceMemberRow } from "@/lib/types";

const ROLES = [
  { value: "viewer", label: "Viewer", icon: User },
  { value: "editor", label: "Editor", icon: UserCog },
  { value: "admin", label: "Admin", icon: Shield },
];

export function WorkspaceSettings() {
  const [workspace, setWorkspace] = useState<{ id: string; name: string; slug: string; plan: string; role: string } | null>(null);
  const [members, setMembers] = useState<WorkspaceMemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspace = async () => {
    setLoading(true);
    const result = await getCurrentWorkspace();
    if (result.success && "workspace" in result) {
      setWorkspace(result.workspace);
      setMembers(result.members as WorkspaceMemberRow[]);
    } else {
      setError(result.error ?? "Failed to load workspace");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkspace();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setInviting(true);
    setError(null);
    const result = await inviteMember(email, role);
    setInviting(false);
    if (result.success) {
      setEmail("");
      fetchWorkspace();
    } else {
      setError(result.error ?? "Could not invite member");
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    const result = await updateMemberRole(memberId, newRole);
    if (result.success) fetchWorkspace();
    else setError(result.error ?? "Could not update role");
  };

  const handleRemove = async (memberId: string) => {
    if (!window.confirm("Remove this member?")) return;
    const result = await removeMember(memberId);
    if (result.success) fetchWorkspace();
    else setError(result.error ?? "Could not remove member");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading workspace...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <section className="glass rounded-2xl p-5 border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Workspace</h3>
            <p className="text-xs text-muted-foreground">{workspace?.name}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <Label className="text-muted-foreground text-xs">Slug</Label>
            <p className="font-medium">{workspace?.slug}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">Plan</Label>
            <p className="font-medium capitalize">{workspace?.plan}</p>
          </div>
        </div>
      </section>

      <section className="glass rounded-2xl p-5 border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Members</h3>
            <p className="text-xs text-muted-foreground">Manage team access</p>
          </div>
        </div>

        {(workspace?.role === "owner" || workspace?.role === "admin") && (
          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <Button type="submit" disabled={inviting}>
              {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Invite"}
            </Button>
          </form>
        )}

        <div className="space-y-2">
          <AnimatePresence>
            {members.map((member) => {
              const RoleIcon = ROLES.find((r) => r.value === member.role)?.icon ?? User;
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <RoleIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.name ?? member.email ?? "Pending invite"}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.email} • <span className="capitalize">{member.status}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {(workspace?.role === "owner" || workspace?.role === "admin") && member.role !== "owner" && (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                          className="bg-black/30 border border-white/10 rounded-lg px-2 py-1 text-xs"
                        >
                          {ROLES.map((r) => (
                            <option key={r.value} value={r.value}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                        <Button size="xs" variant="destructive" onClick={() => handleRemove(member.id)}>
                          Remove
                        </Button>
                      </>
                    )}
                    {(workspace?.role !== "owner" && workspace?.role !== "admin") || member.role === "owner" ? (
                      <span className="text-xs capitalize px-2 py-1 rounded-md bg-white/5 text-muted-foreground">
                        {member.role}
                      </span>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

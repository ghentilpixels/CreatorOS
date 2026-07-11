"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, Mail, Loader2, AlertCircle, Shield, User, UserCog, Sparkles } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center py-32 text-muted-foreground gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <Loader2 className="w-8 h-8 animate-spin text-primary relative z-10" />
        </div>
        <p className="text-sm font-medium animate-pulse">Loading workspace details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm shadow-lg shadow-red-500/5"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </motion.div>
      )}

      {/* Workspace Overview Card */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 p-1 group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute top-0 right-0 p-32 bg-primary/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        
        <div className="relative bg-background/80 backdrop-blur-xl rounded-[1.35rem] p-8 border border-white/5 h-full">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-primary/40 shadow-[0_0_30px_rgba(var(--primary),0.3)] p-[1px]">
                <div className="w-full h-full bg-background/90 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
                  {workspace?.name}
                  {workspace?.plan === "pro" && <Sparkles className="w-4 h-4 text-primary animate-pulse" />}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    {workspace?.plan} plan
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-xs text-muted-foreground capitalize">{workspace?.role}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/[0.02] p-5 rounded-2xl border border-white/5">
            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1 block">Workspace Slug</Label>
              <p className="font-medium text-sm text-foreground/90 font-mono bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 inline-block">
                {workspace?.slug}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1 block">Data Region</Label>
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                US East (N. Virginia)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 p-1">
        <div className="relative bg-background/60 backdrop-blur-xl rounded-[1.35rem] p-8 border border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white mb-1">Team Members</h3>
              <p className="text-sm text-muted-foreground">Invite colleagues and manage their access levels.</p>
            </div>
          </div>

          {(workspace?.role === "owner" || workspace?.role === "admin") && (
            <div className="group/form relative mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-focus-within/form:opacity-100 transition-all duration-700 pointer-events-none" />
              <form onSubmit={handleInvite} className="relative bg-black/40 border border-white/10 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 backdrop-blur-md">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within/form:text-primary" />
                  <Input
                    type="email"
                    placeholder="Invite via email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 bg-transparent border-none focus-visible:ring-0 shadow-none text-sm"
                    required
                  />
                </div>
                <div className="w-px bg-white/10 hidden sm:block mx-1" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-12 bg-transparent border-none text-sm text-foreground px-4 focus:ring-0 outline-none cursor-pointer appearance-none min-w-[120px]"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value} className="bg-background text-foreground">
                      {r.label}
                    </option>
                  ))}
                </select>
                <Button 
                  type="submit" 
                  disabled={inviting}
                  className="h-12 px-6 rounded-xl bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] font-semibold"
                >
                  {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Invite"}
                </Button>
              </form>
            </div>
          )}

          <div className="space-y-3">
            <AnimatePresence>
              {members.map((member, index) => {
                const RoleIcon = ROLES.find((r) => r.value === member.role)?.icon ?? User;
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-white/10 to-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500">
                        {member.avatarUrl ? (
                          <img src={member.avatarUrl} alt={member.name ?? "Avatar"} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <RoleIcon className="w-4 h-4 text-foreground/70 group-hover:text-primary transition-colors" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground/90 group-hover:text-white transition-colors">
                          {member.name ?? member.email ?? "Pending invite"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                          {member.email} 
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          <span className={`capitalize flex items-center gap-1.5 ${member.status === 'active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse'}`} />
                            {member.status}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {(workspace?.role === "owner" || workspace?.role === "admin") && member.role !== "owner" ? (
                        <>
                          <div className="relative">
                            <select
                              value={member.role}
                              onChange={(e) => handleRoleChange(member.id, e.target.value)}
                              className="appearance-none bg-black/40 border border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-xs text-foreground/80 hover:bg-white/5 hover:text-white transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-primary"
                            >
                              {ROLES.map((r) => (
                                <option key={r.value} value={r.value} className="bg-background">
                                  {r.label}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                          </div>
                          <Button 
                            size="icon-sm" 
                            variant="ghost" 
                            className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            onClick={() => handleRemove(member.id)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs uppercase tracking-wider font-semibold px-3 py-1.5 rounded-lg bg-white/5 text-muted-foreground border border-white/5">
                          {member.role}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}

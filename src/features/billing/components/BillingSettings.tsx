"use client";

import { useEffect, useState } from "react";
import { CreditCard, Loader2, AlertCircle, Calendar, Sparkles, CheckCircle2 } from "lucide-react";
import { getBillingOverview, updatePlan } from "../actions";
import { PlanCard } from "./PlanCard";
import { UsageMeter } from "./UsageMeter";
import { PLANS, type PlanId } from "@/lib/subscription/plans";
import type { UsageSnapshot } from "@/lib/usage/limits";
import { motion } from "framer-motion";

export function BillingSettings() {
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [usage, setUsage] = useState<Record<string, UsageSnapshot> | null>(null);
  const [subscription, setSubscription] = useState<{
    status: string;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBilling = async () => {
    setLoading(true);
    setError(null);
    const result = await getBillingOverview();
    if (result.success && "plans" in result) {
      setCurrentPlan(result.plan);
      setUsage(result.usage as Record<string, UsageSnapshot>);
      setSubscription(result.subscription as typeof subscription);
    } else {
      setError(result.error ?? "Failed to load billing");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const handleSelectPlan = async (planId: PlanId) => {
    setUpdating(true);
    setError(null);
    const result = await updatePlan(planId);
    setUpdating(false);
    if (result.success) {
      fetchBilling();
    } else {
      setError(result.error ?? "Could not update plan");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-muted-foreground gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <Loader2 className="w-8 h-8 animate-spin text-primary relative z-10" />
        </div>
        <p className="text-sm font-medium animate-pulse">Loading billing details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

      {/* Subscription Overview Card */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 p-1 group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        
        <div className="relative bg-background/80 backdrop-blur-xl rounded-[1.35rem] p-8 border border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/80 to-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.3)] p-[1px]">
                <div className="w-full h-full bg-background/90 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <CreditCard className="w-7 h-7 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">Current Subscription</h3>
                <div className="flex items-center gap-3">
                  <p className="text-3xl font-bold tracking-tight text-white capitalize flex items-center gap-2">
                    {currentPlan}
                    {currentPlan === "pro" && <Sparkles className="w-5 h-5 text-yellow-400" />}
                  </p>
                  <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Active</span>
                  </div>
                </div>
              </div>
            </div>
            
            {subscription?.currentPeriodEnd && (
              <div className="flex flex-col md:items-end justify-center bg-white/[0.02] p-4 rounded-xl border border-white/5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Renewal Date
                </p>
                <p className="text-sm font-semibold text-foreground/90">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Plan Selection */}
      <section className="relative">
        <div className="flex flex-col items-center text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Upgrade your potential</h3>
          <p className="text-sm text-muted-foreground max-w-lg">
            Choose a plan that scales with your creative workflow. Unlock premium features and remove all limits.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Object.values(PLANS) as (typeof PLANS)[PlanId][]).map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="h-full"
            >
              <PlanCard
                plan={plan}
                isCurrent={currentPlan === plan.id}
                onSelect={handleSelectPlan}
                loading={updating}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Usage Section */}
      {usage && (
        <section className="relative overflow-hidden rounded-3xl border border-white/10 p-1 group">
          <div className="relative bg-background/60 backdrop-blur-xl rounded-[1.35rem] p-8 border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white mb-1">Usage this period</h3>
                <p className="text-sm text-muted-foreground">Monitor your resource limits across workspaces.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <UsageMeter label="AI Generations" snapshot={usage.aiGenerations} />
              <UsageMeter label="Projects" snapshot={usage.projects} />
              <UsageMeter label="Videos" snapshot={usage.videos} />
              <UsageMeter label="Published Posts" snapshot={usage.publishedPosts} />
              <UsageMeter label="Team Seats" snapshot={usage.teamSeats} />
              <UsageMeter label="Storage (MB)" snapshot={usage.storageMb} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

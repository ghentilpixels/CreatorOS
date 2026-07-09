"use client";

import { useEffect, useState } from "react";
import { CreditCard, Loader2, AlertCircle, Calendar } from "lucide-react";
import { getBillingOverview, updatePlan } from "../actions";
import { PlanCard } from "./PlanCard";
import { UsageMeter } from "./UsageMeter";
import { PLANS, type PlanId } from "@/lib/subscription/plans";
import type { UsageSnapshot } from "@/lib/usage/limits";

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
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading billing...
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
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Subscription</h3>
            <p className="text-xs text-muted-foreground">
              Current plan:{" "}
              <span className="capitalize font-medium text-foreground">{currentPlan}</span>
            </p>
          </div>
        </div>

        {subscription?.currentPeriodEnd && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Current period ends{" "}
            {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
          </p>
        )}
      </section>

      <section>
        <h3 className="text-base font-semibold mb-4">Choose a plan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.values(PLANS) as (typeof PLANS)[PlanId][]).map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={currentPlan === plan.id}
              onSelect={handleSelectPlan}
              loading={updating}
            />
          ))}
        </div>
      </section>

      {usage && (
        <section className="glass rounded-2xl p-5 border-white/5">
          <h3 className="text-base font-semibold mb-4">Usage this period</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <UsageMeter label="AI Generations" snapshot={usage.aiGenerations} />
            <UsageMeter label="Projects" snapshot={usage.projects} />
            <UsageMeter label="Videos" snapshot={usage.videos} />
            <UsageMeter label="Published Posts" snapshot={usage.publishedPosts} />
            <UsageMeter label="Team Seats" snapshot={usage.teamSeats} />
            <UsageMeter label="Storage (MB)" snapshot={usage.storageMb} />
          </div>
        </section>
      )}
    </div>
  );
}

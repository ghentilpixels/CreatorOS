"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlanDefinition, PlanId } from "@/lib/subscription/plans";

interface PlanCardProps {
  plan: PlanDefinition;
  isCurrent: boolean;
  onSelect: (planId: PlanId) => void;
  loading?: boolean;
}

export function PlanCard({ plan, isCurrent, onSelect, loading }: PlanCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-5 ${
        isCurrent
          ? "border-primary bg-primary/10"
          : "border-white/10 bg-white/[0.03] hover:border-white/20"
      }`}
    >
      {isCurrent && (
        <span className="absolute -top-2 right-4 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
          Current Plan
        </span>
      )}
      <h4 className="font-semibold text-base">{plan.name}</h4>
      <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
      <div className="flex items-baseline gap-0.5 mt-3 mb-4">
        <span className="text-3xl font-bold">${plan.priceMonthly}</span>
        <span className="text-xs text-muted-foreground">/mo</span>
      </div>
      <ul className="space-y-2 mb-5 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-xs text-muted-foreground">
            <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        size="sm"
        variant={isCurrent ? "outline" : "default"}
        className="w-full"
        disabled={isCurrent || loading}
        onClick={() => onSelect(plan.id)}
      >
        {loading ? "Updating..." : isCurrent ? "Current Plan" : `Choose ${plan.name}`}
      </Button>
    </div>
  );
}

"use client";

import { Check, Sparkles, Loader2 } from "lucide-react";;
import { Button } from "@/components/ui/button";
import type { PlanDefinition, PlanId } from "@/lib/subscription/plans";

interface PlanCardProps {
  plan: PlanDefinition;
  isCurrent: boolean;
  onSelect: (planId: PlanId) => void;
  loading?: boolean;
}

export function PlanCard({ plan, isCurrent, onSelect, loading }: PlanCardProps) {
  const isPro = plan.id === "pro";

  return (
    <div
      className={`relative flex flex-col h-full rounded-[1.5rem] p-1 transition-all duration-500 group ${
        isCurrent
          ? "hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(var(--primary),0.3)]"
          : "hover:-translate-y-2 hover:shadow-xl"
      }`}
    >
      {/* Background/Border Layer */}
      <div className={`absolute inset-0 rounded-[1.5rem] ${
        isCurrent
          ? "bg-gradient-to-b from-primary via-primary/50 to-primary/10 opacity-100"
          : isPro
          ? "bg-gradient-to-b from-blue-500/50 via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          : "bg-gradient-to-b from-white/10 to-transparent opacity-100"
      }`} />
      
      {/* Core Card */}
      <div className={`relative flex flex-col h-full bg-background/95 backdrop-blur-xl rounded-[1.35rem] p-6 border ${
        isCurrent ? "border-transparent" : "border-white/5 group-hover:border-white/10"
      } transition-colors`}>
        
        {/* Badges */}
        {isCurrent && (
          <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-primary text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)] z-10 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Current Plan
          </div>
        )}
        {isPro && !isCurrent && (
          <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-[10px] font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] z-10">
            Most Popular
          </div>
        )}

        <div className="mb-6">
          <h4 className="font-bold text-xl text-white flex items-center gap-2">
            {plan.name}
            {isPro && <Sparkles className="w-4 h-4 text-purple-400" />}
          </h4>
          <p className="text-sm text-muted-foreground mt-2 min-h-[40px] leading-relaxed">
            {plan.description}
          </p>
        </div>

        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-4xl font-extrabold tracking-tight text-white">${plan.priceMonthly}</span>
          <span className="text-sm font-medium text-muted-foreground">/mo</span>
        </div>

        <ul className="space-y-3 mb-8 flex-1">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-foreground/80 group/feature">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover/feature:bg-emerald-500/20 transition-colors">
                <Check className="w-3 h-3 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
              </div>
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-4">
          <Button
            size="lg"
            variant={isCurrent ? "outline" : isPro ? "default" : "secondary"}
            className={`w-full font-semibold rounded-xl transition-all duration-300 ${
              isCurrent
                ? "bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
                : isPro
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-[1.02]"
                : "bg-white/5 hover:bg-white/10 text-white border border-white/5"
            }`}
            disabled={isCurrent || loading}
            onClick={() => onSelect(plan.id)}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : isCurrent ? "Active Plan" : `Choose ${plan.name}`}
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Check, Crown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    features: ["3 Projects", "Basic AI generations", "Community support"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    features: ["Unlimited projects", "All AI studios", "Priority generations", "Custom agents"],
    highlighted: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/mo",
    features: ["Everything in Pro", "Up to 10 seats", "Shared knowledge base", "Admin controls"],
    highlighted: false,
  },
];

interface UpgradeToProProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function UpgradeToPro({ children, open, onOpenChange }: UpgradeToProProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const setIsOpen = onOpenChange ?? setInternalOpen;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl glass border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            Upgrade your plan
          </DialogTitle>
          <DialogDescription>
            Unlock all AI features and take your content to the next level.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl border p-4 ${
                plan.highlighted ? "border-primary bg-primary/10" : "border-border bg-white/5"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-2 right-3 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                  Popular
                </span>
              )}
              <h4 className="font-semibold text-sm">{plan.name}</h4>
              <div className="flex items-baseline gap-0.5 mt-2 mb-3">
                <span className="text-2xl font-bold">{plan.price}</span>
                <span className="text-xs text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-4 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                size="sm"
                variant={plan.highlighted ? "default" : "outline"}
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                {plan.name === "Free" ? "Current Plan" : `Choose ${plan.name}`}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SUBSCRIPTION_PLANS,
  SubscriptionPlan,
  UsageLimits,
} from "@/lib/workspace/types";

interface UsageMeterProps {
  plan: SubscriptionPlan;
  usage: Partial<UsageLimits>;
  onUpgrade?: () => void;
}

export function UsageMeter({ plan, usage, onUpgrade }: UsageMeterProps) {
  const limits = SUBSCRIPTION_PLANS[plan].limits;
  const planName = SUBSCRIPTION_PLANS[plan].name;

  const metrics = [
    {
      key: "monthlyRequests" as const,
      label: "Monthly Requests",
      unit: "requests",
    },
    {
      key: "storageGB" as const,
      label: "Storage",
      unit: "GB",
    },
    {
      key: "apiCallsPerDay" as const,
      label: "Daily API Calls",
      unit: "calls",
    },
    {
      key: "publishingPerDay" as const,
      label: "Daily Publishing",
      unit: "posts",
    },
  ];

  function getUsagePercentage(key: keyof UsageLimits): number {
    const limit = limits[key];
    const current = usage[key] || 0;

    if (limit === -1) return 0; // unlimited
    return Math.min((current / limit) * 100, 100);
  }

  function isWarning(key: keyof UsageLimits): boolean {
    const percentage = getUsagePercentage(key);
    return percentage > 80;
  }

  function isExceeded(key: keyof UsageLimits): boolean {
    const percentage = getUsagePercentage(key);
    return percentage >= 100;
  }

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-zinc-400 text-sm">Current Plan</p>
            <h3 className="text-2xl font-bold text-white">{planName}</h3>
            {plan !== "enterprise" && (
              <p className="text-zinc-400 text-sm mt-2">
                ${SUBSCRIPTION_PLANS[plan].price}/month
              </p>
            )}
          </div>
          {plan === "free" && onUpgrade && (
            <Button
              onClick={onUpgrade}
              className="bg-gradient-to-r from-blue-600 to-blue-700"
            >
              Upgrade Plan
            </Button>
          )}
        </div>
      </div>

      {/* Usage Metrics */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Usage & Limits</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric) => {
            const limit = limits[metric.key];
            const current = usage[metric.key] || 0;
            const percentage = getUsagePercentage(metric.key);
            const warning = isWarning(metric.key);
            const exceeded = isExceeded(metric.key);
            const unlimited = limit === -1;

            return (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border ${
                  exceeded
                    ? "bg-red-500/10 border-red-500/20"
                    : warning
                      ? "bg-yellow-500/10 border-yellow-500/20"
                      : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-white">
                    {metric.label}
                  </p>
                  {unlimited ? (
                    <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">
                      Unlimited
                    </span>
                  ) : exceeded ? (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  ) : warning ? (
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  )}
                </div>

                <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="text-zinc-400">
                    {current.toLocaleString()} {metric.unit}
                  </span>
                  {!unlimited && (
                    <span className="text-zinc-400">
                      / {limit.toLocaleString()} {metric.unit}
                    </span>
                  )}
                </div>

                {!unlimited && (
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full transition-colors ${
                        exceeded
                          ? "bg-red-500"
                          : warning
                            ? "bg-yellow-500"
                            : "bg-emerald-500"
                      }`}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Warnings */}
      {Object.entries(limits).some(([key, limit]) => {
        const current = usage[key as keyof UsageLimits] || 0;
        const percentage = limit === -1 ? 0 : (current / limit) * 100;
        return percentage > 80;
      }) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-yellow-400"
        >
          <p className="text-sm">
            ⚠️ You're approaching your usage limits. Consider upgrading your
            plan to avoid interruptions.
          </p>
        </motion.div>
      )}
    </div>
  );
}

export function QuotaChecker({
  plan,
  usage,
}: Omit<UsageMeterProps, "onUpgrade">) {
  const limits = SUBSCRIPTION_PLANS[plan].limits;

  function canPerformAction(limit: keyof UsageLimits): boolean {
    const limitValue = limits[limit];
    const current = usage[limit] || 0;

    if (limitValue === -1) return true; // unlimited
    return current < limitValue;
  }

  return {
    canPublish: canPerformAction("publishingPerDay"),
    canMakeApiCall: canPerformAction("apiCallsPerDay"),
    canMakeRequest: canPerformAction("monthlyRequests"),
    canUploadFile: canPerformAction("storageGB"),
  };
}

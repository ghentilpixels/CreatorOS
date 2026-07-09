export type PlanId = "free" | "starter" | "pro" | "team";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  description: string;
  priceMonthly: number;
  features: string[];
  limits: {
    projects: number;
    videos: number;
    aiGenerations: number;
    publishedPosts: number;
    teamSeats: number;
    storageMb: number;
    customAgents: boolean;
    analyticsHistoryDays: number;
  };
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: "free",
    name: "Free",
    description: "For solo creators getting started.",
    priceMonthly: 0,
    features: [
      "3 projects",
      "25 AI generations / mo",
      "Basic analytics",
      "1 social integration",
      "Community support",
    ],
    limits: {
      projects: 3,
      videos: 10,
      aiGenerations: 25,
      publishedPosts: 5,
      teamSeats: 1,
      storageMb: 500,
      customAgents: false,
      analyticsHistoryDays: 30,
    },
  },
  starter: {
    id: "starter",
    name: "Starter",
    description: "For growing creators.",
    priceMonthly: 12,
    features: [
      "Unlimited projects",
      "200 AI generations / mo",
      "Advanced analytics",
      "All social integrations",
      "Priority support",
    ],
    limits: {
      projects: Number.POSITIVE_INFINITY,
      videos: Number.POSITIVE_INFINITY,
      aiGenerations: 200,
      publishedPosts: 50,
      teamSeats: 1,
      storageMb: 5_000,
      customAgents: false,
      analyticsHistoryDays: 90,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "For professional creators.",
    priceMonthly: 29,
    features: [
      "Unlimited everything",
      "1,000 AI generations / mo",
      "AI analytics agent",
      "Publishing workflows",
      "Custom agent instructions",
      "Priority support",
    ],
    limits: {
      projects: Number.POSITIVE_INFINITY,
      videos: Number.POSITIVE_INFINITY,
      aiGenerations: 1000,
      publishedPosts: 200,
      teamSeats: 1,
      storageMb: 25_000,
      customAgents: true,
      analyticsHistoryDays: 365,
    },
  },
  team: {
    id: "team",
    name: "Team",
    description: "For creator teams and agencies.",
    priceMonthly: 79,
    features: [
      "Everything in Pro",
      "Up to 10 seats",
      "Shared workspaces",
      "Admin controls & roles",
      "SSO (coming soon)",
    ],
    limits: {
      projects: Number.POSITIVE_INFINITY,
      videos: Number.POSITIVE_INFINITY,
      aiGenerations: 5_000,
      publishedPosts: 1_000,
      teamSeats: 10,
      storageMb: 100_000,
      customAgents: true,
      analyticsHistoryDays: 730,
    },
  },
};

export function getPlan(planId: string): PlanDefinition {
  return PLANS[(planId as PlanId) ?? "free"] ?? PLANS.free;
}

// Workspace and SaaS types

export type UserRole = "owner" | "admin" | "editor" | "viewer";
export type SubscriptionPlan = "free" | "pro" | "team" | "enterprise";

export interface WorkspaceUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  joinedAt: Date;
  lastActiveAt?: Date;
  status: "active" | "inactive" | "invited";
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  ownerId: string;
  members: WorkspaceUser[];
  subscription: SubscriptionPlan;
  subscriptionEndsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  settings: WorkspaceSettings;
}

export interface WorkspaceSettings {
  defaultLanguage: string;
  timezone: string;
  notificationsEnabled: boolean;
  twoFactorEnabled: boolean;
  allowPublicAccess: boolean;
}

export interface SubscriptionPlanDetails {
  id: SubscriptionPlan;
  name: string;
  description: string;
  price: number;
  billingPeriod: "monthly" | "annual";
  features: SubscriptionFeature[];
  limits: UsageLimits;
  maxUsers: number;
  maxWorkspaces: number;
}

export interface SubscriptionFeature {
  name: string;
  description?: string;
  enabled: boolean;
}

export interface UsageLimits {
  monthlyRequests: number;
  storageGB: number;
  maxProjects: number;
  maxAgents: number;
  maxWorkflows: number;
  publishingPerDay: number;
  apiCallsPerDay: number;
}

export interface Subscription {
  id: string;
  workspaceId: string;
  plan: SubscriptionPlan;
  status: "active" | "cancelled" | "past_due" | "trialing";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  autoRenew: boolean;
  cancelledAt?: Date;
  cancelledReason?: string;
}

export const SUBSCRIPTION_PLANS: Record<
  SubscriptionPlan,
  SubscriptionPlanDetails
> = {
  free: {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    price: 0,
    billingPeriod: "monthly",
    maxUsers: 1,
    maxWorkspaces: 1,
    features: [
      { name: "3 AI Projects", enabled: true },
      { name: "Basic AI Features", enabled: true },
      { name: "Community Support", enabled: true },
      { name: "Published Workflows", enabled: false },
      { name: "API Access", enabled: false },
      { name: "Priority Support", enabled: false },
    ],
    limits: {
      monthlyRequests: 10000,
      storageGB: 5,
      maxProjects: 3,
      maxAgents: 5,
      maxWorkflows: 3,
      publishingPerDay: 1,
      apiCallsPerDay: 100,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "For individual creators",
    price: 19,
    billingPeriod: "monthly",
    maxUsers: 3,
    maxWorkspaces: 5,
    features: [
      { name: "Unlimited Projects", enabled: true },
      { name: "All AI Studios", enabled: true },
      { name: "Priority Generations", enabled: true },
      { name: "Custom Agents", enabled: true },
      { name: "Published Workflows", enabled: true },
      { name: "API Access", enabled: true },
      { name: "Email Support", enabled: true },
    ],
    limits: {
      monthlyRequests: 500000,
      storageGB: 100,
      maxProjects: 50,
      maxAgents: 50,
      maxWorkflows: 50,
      publishingPerDay: 10,
      apiCallsPerDay: 5000,
    },
  },
  team: {
    id: "team",
    name: "Team",
    description: "For collaborative teams",
    price: 49,
    billingPeriod: "monthly",
    maxUsers: 10,
    maxWorkspaces: 20,
    features: [
      { name: "Unlimited Projects", enabled: true },
      { name: "All AI Studios", enabled: true },
      { name: "Advanced AI Models", enabled: true },
      { name: "Team Collaboration", enabled: true },
      { name: "Custom Workflows", enabled: true },
      { name: "API Access", enabled: true },
      { name: "Priority Support", enabled: true },
      { name: "SSO/SAML", enabled: true },
    ],
    limits: {
      monthlyRequests: 2000000,
      storageGB: 500,
      maxProjects: 200,
      maxAgents: 200,
      maxWorkflows: 200,
      publishingPerDay: 50,
      apiCallsPerDay: 20000,
    },
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    description: "For organizations",
    price: 0,
    billingPeriod: "monthly",
    maxUsers: -1,
    maxWorkspaces: -1,
    features: [
      { name: "Unlimited Everything", enabled: true },
      { name: "Dedicated Account Manager", enabled: true },
      { name: "Custom Integration", enabled: true },
      { name: "Advanced Analytics", enabled: true },
      { name: "SLA Guarantee", enabled: true },
      { name: "24/7 Support", enabled: true },
      { name: "Custom Contract", enabled: true },
    ],
    limits: {
      monthlyRequests: -1,
      storageGB: -1,
      maxProjects: -1,
      maxAgents: -1,
      maxWorkflows: -1,
      publishingPerDay: -1,
      apiCallsPerDay: -1,
    },
  },
};

// Role Permissions Matrix
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  owner: [
    "manage_members",
    "manage_settings",
    "delete_workspace",
    "manage_billing",
    "manage_roles",
    "view_analytics",
    "create_content",
    "edit_content",
    "delete_content",
    "publish_content",
  ],
  admin: [
    "manage_members",
    "manage_settings",
    "manage_roles",
    "view_analytics",
    "create_content",
    "edit_content",
    "delete_content",
    "publish_content",
  ],
  editor: [
    "view_analytics",
    "create_content",
    "edit_content",
    "delete_content",
    "publish_content",
  ],
  viewer: ["view_analytics"],
};

export function canPerformAction(role: UserRole, action: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(action) ?? false;
}

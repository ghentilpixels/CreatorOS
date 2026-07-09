import {
  Workspace,
  WorkspaceUser,
  Subscription,
  SubscriptionPlan,
  SUBSCRIPTION_PLANS,
} from "./types";

export class WorkspaceService {
  static async getWorkspaces(userId: string): Promise<Workspace[]> {
    try {
      const response = await fetch(`/api/workspaces?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch workspaces");
      return response.json();
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      return [];
    }
  }

  static async getWorkspace(workspaceId: string): Promise<Workspace | null> {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}`);
      if (!response.ok) return null;
      return response.json();
    } catch (error) {
      console.error("Error fetching workspace:", error);
      return null;
    }
  }

  static async createWorkspace(data: {
    name: string;
    slug: string;
    description?: string;
    ownerId: string;
  }): Promise<Workspace> {
    const response = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to create workspace");
    return response.json();
  }

  static async updateWorkspace(
    workspaceId: string,
    data: Partial<Workspace>,
  ): Promise<Workspace> {
    const response = await fetch(`/api/workspaces/${workspaceId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to update workspace");
    return response.json();
  }

  static async deleteWorkspace(workspaceId: string): Promise<void> {
    const response = await fetch(`/api/workspaces/${workspaceId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete workspace");
  }

  static async inviteUser(
    workspaceId: string,
    email: string,
    role: string,
  ): Promise<WorkspaceUser> {
    const response = await fetch(`/api/workspaces/${workspaceId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });

    if (!response.ok) throw new Error("Failed to invite user");
    return response.json();
  }

  static async updateUserRole(
    workspaceId: string,
    userId: string,
    role: string,
  ): Promise<WorkspaceUser> {
    const response = await fetch(
      `/api/workspaces/${workspaceId}/members/${userId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      },
    );

    if (!response.ok) throw new Error("Failed to update user role");
    return response.json();
  }

  static async removeUser(workspaceId: string, userId: string): Promise<void> {
    const response = await fetch(
      `/api/workspaces/${workspaceId}/members/${userId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) throw new Error("Failed to remove user");
  }

  static async getSubscription(
    workspaceId: string,
  ): Promise<Subscription | null> {
    try {
      const response = await fetch(`/api/subscriptions/${workspaceId}`);
      if (!response.ok) return null;
      return response.json();
    } catch (error) {
      console.error("Error fetching subscription:", error);
      return null;
    }
  }

  static async upgradePlan(
    workspaceId: string,
    plan: SubscriptionPlan,
  ): Promise<Subscription> {
    const response = await fetch(`/api/subscriptions/${workspaceId}/upgrade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    if (!response.ok) throw new Error("Failed to upgrade plan");
    return response.json();
  }

  static async cancelSubscription(workspaceId: string): Promise<void> {
    const response = await fetch(`/api/subscriptions/${workspaceId}/cancel`, {
      method: "POST",
    });

    if (!response.ok) throw new Error("Failed to cancel subscription");
  }

  static async getUsage(workspaceId: string): Promise<Record<string, number>> {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/usage`);
      if (!response.ok) throw new Error("Failed to fetch usage");
      return response.json();
    } catch (error) {
      console.error("Error fetching usage:", error);
      return {};
    }
  }

  static getSubscriptionPlan(plan: SubscriptionPlan) {
    return SUBSCRIPTION_PLANS[plan];
  }

  static isLimitExceeded(
    plan: SubscriptionPlan,
    metric: string,
    current: number,
  ): boolean {
    const limits = SUBSCRIPTION_PLANS[plan].limits;
    const limit = limits[metric as keyof typeof limits];

    if (limit === -1) return false; // unlimited
    return current >= limit;
  }
}

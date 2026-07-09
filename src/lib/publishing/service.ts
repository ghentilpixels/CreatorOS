import {
  PlatformConnection,
  PublishingSchedule,
  PlatformConfig,
  PLATFORM_CONFIGS,
  PublishingPlatform,
} from "./types";

export class PublishingService {
  static async getConnections(userId: string): Promise<PlatformConnection[]> {
    try {
      const response = await fetch(
        `/api/publishing/connections?userId=${userId}`,
      );
      if (!response.ok) throw new Error("Failed to fetch connections");
      return response.json();
    } catch (error) {
      console.error("Error fetching connections:", error);
      return [];
    }
  }

  static async connectPlatform(
    userId: string,
    platform: PublishingPlatform,
    code: string,
  ): Promise<PlatformConnection> {
    const response = await fetch("/api/publishing/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, platform, code }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to connect platform");
    }

    return response.json();
  }

  static async disconnectPlatform(connectionId: string): Promise<void> {
    const response = await fetch("/api/publishing/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ connectionId }),
    });

    if (!response.ok) {
      throw new Error("Failed to disconnect platform");
    }
  }

  static async schedulePublish(
    userId: string,
    schedule: Omit<PublishingSchedule, "id" | "results">,
  ): Promise<PublishingSchedule> {
    const response = await fetch("/api/publishing/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...schedule }),
    });

    if (!response.ok) {
      throw new Error("Failed to schedule publish");
    }

    return response.json();
  }

  static async getSchedules(userId: string): Promise<PublishingSchedule[]> {
    try {
      const response = await fetch(
        `/api/publishing/schedules?userId=${userId}`,
      );
      if (!response.ok) throw new Error("Failed to fetch schedules");
      return response.json();
    } catch (error) {
      console.error("Error fetching schedules:", error);
      return [];
    }
  }

  static async publishNow(
    userId: string,
    contentId: string,
    platforms: PublishingPlatform[],
  ): Promise<PublishingSchedule> {
    const response = await fetch("/api/publishing/publish-now", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, contentId, platforms }),
    });

    if (!response.ok) {
      throw new Error("Failed to publish content");
    }

    return response.json();
  }

  static getPlatformAuthUrl(platform: PublishingPlatform): string {
    const baseUrls: Record<PublishingPlatform, string> = {
      youtube: "https://accounts.google.com/o/oauth2/v2/auth",
      tiktok: "https://www.tiktok.com/oauth",
      instagram: "https://api.instagram.com/oauth",
      linkedin: "https://www.linkedin.com/oauth/v2/authorization",
    };

    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID || "",
      redirect_uri: `${window.location.origin}/api/publishing/callback`,
      response_type: "code",
      scope: this.getScopes(platform),
    });

    return `${baseUrls[platform]}?${params}`;
  }

  private static getScopes(platform: PublishingPlatform): string {
    const scopes: Record<PublishingPlatform, string> = {
      youtube: "https://www.googleapis.com/auth/youtube.upload",
      tiktok: "user.info.basic,video.upload",
      instagram: "instagram_basic,instagram_content_publish",
      linkedin: "w_member_social,r_liteprofile",
    };
    return scopes[platform];
  }

  static canPublishToday(connection: PlatformConnection): boolean {
    if (!connection.isConnected) return false;
    if (connection.expiresAt < new Date()) return false;
    return true;
  }

  static getPublishingLimits(platform: PublishingPlatform): {
    maxDaily: number;
    maxWeekly: number;
    retentionDays: number;
  } {
    const limits: Record<PublishingPlatform, any> = {
      youtube: { maxDaily: 50, maxWeekly: 350, retentionDays: 90 },
      tiktok: { maxDaily: 10, maxWeekly: 70, retentionDays: 30 },
      instagram: { maxDaily: 1, maxWeekly: 7, retentionDays: 60 },
      linkedin: { maxDaily: 5, maxWeekly: 35, retentionDays: 90 },
    };
    return limits[platform];
  }
}

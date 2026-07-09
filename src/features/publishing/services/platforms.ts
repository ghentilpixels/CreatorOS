import type { IntegrationPlatform } from "@/lib/types";

export interface PublishResult {
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
}

export interface PlatformPublisher {
  name: string;
  connect(): Promise<{ success: boolean; authUrl?: string; error?: string }>;
  publish(payload: {
    title: string;
    description?: string;
    mediaUrl?: string;
  }): Promise<PublishResult>;
}

class BasePlatformPublisher implements PlatformPublisher {
  name: string;
  platform: IntegrationPlatform;

  constructor(name: string, platform: IntegrationPlatform) {
    this.name = name;
    this.platform = platform;
  }

  async connect() {
    // In production this initiates OAuth2 with the platform and returns the auth URL.
    return {
      success: true,
      authUrl: `/api/auth/${this.platform.toLowerCase()}`,
    };
  }

  async publish(payload: { title: string; description?: string; mediaUrl?: string }) {
    // Placeholder implementation. Real integrations call YouTube Data API, TikTok API, etc.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      postId: `${this.platform.toLowerCase()}_${Date.now()}`,
      url: `https://${this.platform.toLowerCase().replace("_", "")}.com/post/${Date.now()}`,
    };
  }
}

export const PLATFORM_PUBLISHERS: Record<IntegrationPlatform, PlatformPublisher> = {
  YOUTUBE: new BasePlatformPublisher("YouTube", "YOUTUBE"),
  TIKTOK: new BasePlatformPublisher("TikTok", "TIKTOK"),
  INSTAGRAM: new BasePlatformPublisher("Instagram", "INSTAGRAM"),
  LINKEDIN: new BasePlatformPublisher("LinkedIn", "LINKEDIN"),
};

export const PLATFORM_META: Record<
  IntegrationPlatform,
  { name: string; color: string; icon: string }
> = {
  YOUTUBE: { name: "YouTube", color: "text-red-500", icon: "▶️" },
  TIKTOK: { name: "TikTok", color: "text-cyan-400", icon: "🎵" },
  INSTAGRAM: { name: "Instagram", color: "text-pink-500", icon: "📷" },
  LINKEDIN: { name: "LinkedIn", color: "text-blue-600", icon: "💼" },
};

// Publishing platform integrations

export type PublishingPlatform =
  | "youtube"
  | "tiktok"
  | "instagram"
  | "linkedin";

export interface PlatformConnection {
  id: string;
  platform: PublishingPlatform;
  accountName: string;
  accountId: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  isConnected: boolean;
  permissions: string[];
  connectedAt: Date;
  lastSyncAt?: Date;
}

export interface PublishingSchedule {
  id: string;
  contentId: string;
  platforms: PublishingPlatform[];
  scheduledFor: Date;
  content: {
    title: string;
    description: string;
    tags: string[];
    thumbnail?: string;
    video?: {
      url: string;
      duration: number;
      fileSize: number;
    };
  };
  status: "draft" | "scheduled" | "published" | "failed";
  results?: Record<PublishingPlatform, PublishResult>;
}

export interface PublishResult {
  platform: PublishingPlatform;
  success: boolean;
  externalId?: string;
  url?: string;
  error?: string;
  publishedAt?: Date;
  views?: number;
  engagement?: number;
}

export interface PlatformConfig {
  name: string;
  icon: string;
  color: string;
  maxVideoLength: number;
  maxVideoSize: number;
  supportedFormats: string[];
  requiredFields: string[];
  optionalFields: string[];
}

export const PLATFORM_CONFIGS: Record<PublishingPlatform, PlatformConfig> = {
  youtube: {
    name: "YouTube",
    icon: "▶️",
    color: "from-red-600 to-red-700",
    maxVideoLength: 43200, // 12 hours
    maxVideoSize: 128 * 1024 * 1024 * 1024, // 128GB
    supportedFormats: ["mp4", "mov", "avi", "mkv"],
    requiredFields: ["title", "description"],
    optionalFields: ["tags", "thumbnail", "category", "privacy"],
  },
  tiktok: {
    name: "TikTok",
    icon: "🎵",
    color: "from-black to-gray-900",
    maxVideoLength: 600, // 10 minutes
    maxVideoSize: 287.6 * 1024 * 1024, // ~287MB
    supportedFormats: ["mp4", "mov"],
    requiredFields: ["description"],
    optionalFields: ["cover", "hashtags", "music"],
  },
  instagram: {
    name: "Instagram",
    icon: "📷",
    color: "from-pink-500 to-purple-600",
    maxVideoLength: 3600, // 1 hour for reels
    maxVideoSize: 4 * 1024 * 1024 * 1024, // 4GB
    supportedFormats: ["mp4", "mov"],
    requiredFields: ["description"],
    optionalFields: ["hashtags", "mentions", "location"],
  },
  linkedin: {
    name: "LinkedIn",
    icon: "💼",
    color: "from-blue-600 to-blue-700",
    maxVideoLength: 10800, // 3 hours
    maxVideoSize: 5 * 1024 * 1024 * 1024, // 5GB
    supportedFormats: ["mp4", "mov", "avi"],
    requiredFields: ["title"],
    optionalFields: ["description", "hashtags"],
  },
};

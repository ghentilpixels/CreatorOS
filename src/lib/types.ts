export type DateRange = "7d" | "28d" | "90d" | "12m";

export interface MetricCard {
  id: string;
  label: string;
  value: string;
  trend: string;
  isUp: boolean;
  subtext?: string;
}

export interface AnalyticsPoint {
  date: string;
  views: number;
  subscribers: number;
  watchTime: number;
  revenue: number;
  engagement: number;
  ctr: number;
}

export interface TopContentItem {
  id: string;
  title: string;
  platform?: string | null;
  views: number;
  watchTime: number;
  ctr: number;
  engagement: number;
  revenue: number;
  publishedAt?: Date | null;
}

export interface AnalyticsOverview {
  metrics: {
    views: number;
    subscribers: number;
    ctr: number;
    watchTime: number;
    revenue: number;
    engagement: number;
  };
  previous: {
    views: number;
    subscribers: number;
    ctr: number;
    watchTime: number;
    revenue: number;
    engagement: number;
  };
  growth: AnalyticsPoint[];
  performance: AnalyticsPoint[];
  topContent: TopContentItem[];
}

export type IntegrationPlatform = "YOUTUBE" | "TIKTOK" | "INSTAGRAM" | "LINKEDIN";

export interface PlatformOption {
  id: IntegrationPlatform;
  name: string;
  icon: string;
  color: string;
}

export interface PublishingDraft {
  title: string;
  description?: string;
  mediaUrl?: string;
  platforms: Record<string, boolean>;
  scheduledAt?: Date;
}

export interface WorkspaceMemberRow {
  id: string;
  email?: string | null;
  name?: string | null;
  role: string;
  status: string;
  avatarUrl?: string | null;
}

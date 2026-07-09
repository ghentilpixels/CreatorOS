// Analytics data types
export interface AnalyticsMetric {
  label: string;
  value: number | string;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  unit?: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

export interface PerformanceMetrics {
  views: number;
  subscribers: number;
  ctr: number;
  watchTime: number;
  revenue: number;
  engagement: number;
}

export interface AnalyticsData {
  period: "week" | "month" | "year";
  metrics: PerformanceMetrics;
  growthTrend: TimeSeriesDataPoint[];
  performanceTrend: TimeSeriesDataPoint[];
  topContent: TopContentItem[];
  insights: string[];
}

export interface TopContentItem {
  id: string;
  title: string;
  views: number;
  ctr: number;
  revenue: number;
  publishedAt: string;
}

export interface AnalyticsEvent {
  type: "view" | "click" | "share" | "subscribe" | "purchase";
  timestamp: Date;
  metadata?: Record<string, any>;
}

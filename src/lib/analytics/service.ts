import {
  AnalyticsData,
  PerformanceMetrics,
  TimeSeriesDataPoint,
  TopContentItem,
} from "./types";

// Mock data - replace with real API calls
export class AnalyticsService {
  static async getMetrics(
    period: "week" | "month" | "year" = "month",
  ): Promise<PerformanceMetrics> {
    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      views: 125430,
      subscribers: 8234,
      ctr: 4.2,
      watchTime: 45230,
      revenue: 2450.5,
      engagement: 8.7,
    };
  }

  static async getAnalyticsData(
    period: "week" | "month" | "year" = "month",
  ): Promise<AnalyticsData> {
    const metrics = await this.getMetrics(period);
    const growthTrend = this.generateTrendData(period, "growth");
    const performanceTrend = this.generateTrendData(period, "performance");
    const topContent = this.generateTopContent();

    return {
      period,
      metrics,
      growthTrend,
      performanceTrend,
      topContent,
      insights: [
        "Your tutorials perform 3.2x better than news videos",
        "Peak engagement occurs on Friday 8-10 PM",
        "Average watch time increased 23% from last month",
        "CTR improved by 1.4% week-over-week",
      ],
    };
  }

  private static generateTrendData(
    period: "week" | "month" | "year",
    type: "growth" | "performance",
  ): TimeSeriesDataPoint[] {
    const days = period === "week" ? 7 : period === "month" ? 30 : 365;
    const data: TimeSeriesDataPoint[] = [];
    const baseValue = type === "growth" ? 100000 : 5;

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      const variance = Math.random() * 40 - 20;
      const value = Math.round(baseValue + i * (baseValue * 0.02) + variance);

      data.push({
        date: date.toISOString().split("T")[0],
        value,
      });
    }

    return data;
  }

  private static generateTopContent(): TopContentItem[] {
    return [
      {
        id: "1",
        title: "How to Build a SaaS in 2024",
        views: 45230,
        ctr: 5.8,
        revenue: 420.5,
        publishedAt: "2 weeks ago",
      },
      {
        id: "2",
        title: "React Performance Optimization Guide",
        views: 38920,
        ctr: 4.2,
        revenue: 385.2,
        publishedAt: "1 week ago",
      },
      {
        id: "3",
        title: "AI Agents Explained",
        views: 35450,
        ctr: 3.9,
        revenue: 312.75,
        publishedAt: "3 days ago",
      },
      {
        id: "4",
        title: "Typescript Best Practices",
        views: 28760,
        ctr: 3.1,
        revenue: 258.4,
        publishedAt: "5 days ago",
      },
      {
        id: "5",
        title: "Next.js 14 Features Walkthrough",
        views: 24580,
        ctr: 2.8,
        revenue: 198.65,
        publishedAt: "1 week ago",
      },
    ];
  }

  static async trackEvent(
    userId: string,
    eventType: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    // Send analytics event to backend
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          eventType,
          metadata,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to track analytics event:", error);
    }
  }
}

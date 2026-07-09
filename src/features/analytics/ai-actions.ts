"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { requireUser } from "@/lib/auth/session";
import { getActiveWorkspace } from "@/lib/workspace/session";
import { getAnalyticsOverview } from "@/features/analytics/actions";
import { handleActionError, isLimitError } from "@/lib/errors";
import { incrementUsage } from "@/lib/usage/limits";
import type { DateRange } from "@/lib/types";

interface AnalyzeInput {
  question?: string;
  range?: DateRange;
}

export async function analyzePerformance(input: AnalyzeInput) {
  try {
    const user = await requireUser();
    const workspace = await getActiveWorkspace(user);
    if (!workspace) throw new Error("NO_WORKSPACE");

    // Count AI generation usage
    try {
      await incrementUsage(workspace.id, "aiGenerations");
    } catch (err) {
      if (isLimitError(err as Error)) throw err;
      // Non-blocking: continue even if usage tracking fails in preview
    }

    const overview = await getAnalyticsOverview(input.range ?? "28d");
    if (!overview.success) {
      throw new Error(overview.error ?? "Failed to load analytics data");
    }

    const { metrics, topContent } = overview.data;

    const topContentText = topContent
      .slice(0, 5)
      .map(
        (v, i) =>
          `${i + 1}. "${v.title}" (${v.platform ?? "unknown"}) — ${v.views.toLocaleString()} views, ${v.ctr.toFixed(1)}% CTR, ${v.watchTime}m watch time`,
      )
      .join("\n");

    const prompt = `You are an expert creator analytics coach. Analyze the following channel metrics and top content. Provide 3 concise, actionable insights in plain English. Each insight should be one sentence and feel like a recommendation (e.g. "Your tutorials perform better than news videos." or "Your best posting day is Friday.").

Channel metrics:
- Views: ${metrics.views.toLocaleString()}
- Subscriber delta: ${metrics.subscribers.toLocaleString()}
- Avg CTR: ${metrics.ctr.toFixed(2)}%
- Watch time: ${metrics.watchTime} minutes
- Revenue: $${metrics.revenue.toFixed(2)}
- Engagement: ${metrics.engagement.toFixed(2)}%

Top content:
${topContentText || "No published videos yet."}

${input.question ? `User question: ${input.question}\nTailor one insight to answer this question.` : ""}

Return ONLY a JSON array of strings. Example: ["Insight one.", "Insight two.", "Insight three."]`;

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      temperature: 0.7,
    });

    let insights: string[] = [];
    try {
      const cleaned = result.text.replace(/^```json\s*|\s*```$/g, "").trim();
      insights = JSON.parse(cleaned);
      if (!Array.isArray(insights)) insights = [String(insights)];
    } catch {
      // Fallback: split by newlines and bullets
      insights = result.text
        .split(/\n+/)
        .map((line) => line.replace(/^[-\d.\s]+/, "").trim())
        .filter(Boolean)
        .slice(0, 5);
    }

    return { success: true as const, insights };
  } catch (error) {
    return handleActionError(error);
  }
}

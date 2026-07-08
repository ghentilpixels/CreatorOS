"use server";

import { prisma } from "@/lib/prisma";
import type { AgentConfig } from "@prisma/client";

export interface UpdateAgentInput {
  id: string;
  model?: string;
  temperature?: number;
  instructions?: string;
  status?: string;
}

export interface AgentLogEntry {
  id: string;
  agentType: string;
  status: string;
  tokensUsed: number;
  executionTime: number;
  error?: string;
  createdAt: Date;
}

/**
 * Get all agents for a user
 */
export async function getAgents(userId: string): Promise<AgentConfig[]> {
  try {
    const agents = await prisma.agentConfig.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return agents;
  } catch (error) {
    console.error("Error fetching agents:", error);
    throw new Error("Failed to fetch agents");
  }
}

/**
 * Get a single agent by ID
 */
export async function getAgent(
  id: string,
  userId: string,
): Promise<AgentConfig | null> {
  try {
    const agent = await prisma.agentConfig.findFirst({
      where: { id, userId },
    });
    return agent;
  } catch (error) {
    console.error("Error fetching agent:", error);
    throw new Error("Failed to fetch agent");
  }
}

/**
 * Update agent configuration
 */
export async function updateAgent(
  input: UpdateAgentInput,
  userId: string,
): Promise<AgentConfig> {
  try {
    const agent = await prisma.agentConfig.findFirst({
      where: { id: input.id, userId },
    });

    if (!agent) {
      throw new Error("Agent not found");
    }

    const updated = await prisma.agentConfig.update({
      where: { id: input.id },
      data: {
        model: input.model || agent.model,
        temperature:
          input.temperature !== undefined
            ? input.temperature
            : agent.temperature,
        instructions: input.instructions || agent.instructions,
        status: input.status || agent.status,
        updatedAt: new Date(),
      },
    });

    return updated;
  } catch (error) {
    console.error("Error updating agent:", error);
    throw new Error("Failed to update agent");
  }
}

/**
 * Get agent logs
 */
export async function getAgentLogs(
  configId: string,
  userId: string,
  limit: number = 50,
): Promise<AgentLogEntry[]> {
  try {
    const agent = await prisma.agentConfig.findFirst({
      where: { id: configId, userId },
    });

    if (!agent) {
      throw new Error("Agent not found");
    }

    const logs = await prisma.agentLog.findMany({
      where: { agentConfigId: configId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        agentType: true,
        status: true,
        tokensUsed: true,
        executionTime: true,
        error: true,
        createdAt: true,
      },
    });

    return logs;
  } catch (error) {
    console.error("Error fetching agent logs:", error);
    throw new Error("Failed to fetch agent logs");
  }
}

/**
 * Get agent statistics
 */
export async function getAgentStats(configId: string, userId: string) {
  try {
    const agent = await prisma.agentConfig.findFirst({
      where: { id: configId, userId },
    });

    if (!agent) {
      throw new Error("Agent not found");
    }

    const logs = await prisma.agentLog.findMany({
      where: { agentConfigId: configId },
    });

    const completedLogs = logs.filter((log) => log.status === "completed");
    const failedLogs = logs.filter((log) => log.status === "failed");

    const avgExecutionTime =
      completedLogs.length > 0
        ? completedLogs.reduce((sum, log) => sum + log.executionTime, 0) /
          completedLogs.length
        : 0;

    const totalTokens = logs.reduce((sum, log) => sum + log.tokensUsed, 0);

    return {
      totalRuns: logs.length,
      successfulRuns: completedLogs.length,
      failedRuns: failedLogs.length,
      successRate:
        logs.length > 0 ? (completedLogs.length / logs.length) * 100 : 0,
      avgExecutionTime,
      totalTokens,
      lastRun: agent.lastRun,
    };
  } catch (error) {
    console.error("Error fetching agent stats:", error);
    throw new Error("Failed to fetch agent stats");
  }
}

/**
 * Initialize default agents for a user
 */
export async function initializeAgents(userId: string) {
  try {
    const existingAgents = await prisma.agentConfig.findMany({
      where: { userId },
    });

    if (existingAgents.length > 0) {
      return existingAgents;
    }

    const defaultAgents = [
      {
        name: "Research Agent",
        type: "research",
        description: "Analyzes topics and generates research insights",
        model: "gpt-4o",
        provider: "openai",
        temperature: 0.7,
        instructions:
          "You are an expert researcher. Provide comprehensive, well-researched insights tailored to content creators.",
      },
      {
        name: "Script Agent",
        type: "script",
        description: "Generates engaging video scripts",
        model: "claude-3-5-sonnet-20241022",
        provider: "anthropic",
        temperature: 0.8,
        instructions:
          "You are a professional scriptwriter. Create compelling, engaging scripts with hooks and storytelling.",
      },
      {
        name: "SEO Agent",
        type: "seo",
        description: "Optimizes content for search engines",
        model: "gpt-4o",
        provider: "openai",
        temperature: 0.5,
        instructions:
          "You are an SEO expert. Provide keyword-rich titles, descriptions, tags, and optimization strategies.",
      },
      {
        name: "Thumbnail Agent",
        type: "thumbnail",
        description: "Designs high-performing thumbnails",
        model: "gemini-1.5-pro",
        provider: "google",
        temperature: 0.7,
        instructions:
          "You are a thumbnail design expert. Create designs that maximize CTR with compelling visuals.",
      },
      {
        name: "Trend Agent",
        type: "trend",
        description: "Identifies trending topics and opportunities",
        model: "gpt-4o-mini",
        provider: "openai",
        temperature: 0.6,
        instructions:
          "You are a trend analyst. Identify emerging trends, patterns, and content opportunities.",
      },
      {
        name: "Analytics Agent",
        type: "analytics",
        description: "Analyzes performance metrics",
        model: "claude-3-haiku-20240307",
        provider: "anthropic",
        temperature: 0.4,
        instructions:
          "You are a data analyst. Provide insights from performance data and recommend optimizations.",
      },
    ];

    const created = await Promise.all(
      defaultAgents.map((agent) =>
        prisma.agentConfig.create({
          data: {
            ...agent,
            userId,
            status: "active",
          },
        }),
      ),
    );

    return created;
  } catch (error) {
    console.error("Error initializing agents:", error);
    throw new Error("Failed to initialize agents");
  }
}

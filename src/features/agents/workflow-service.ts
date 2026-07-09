"use server";

import { prisma } from "@/lib/prisma";
import type { WorkflowStep } from "@/features/agents/components/WorkflowBuilder";

export interface WorkflowConfig {
  name: string;
  trigger: string;
  steps: WorkflowStep[];
}

/**
 * Create a new workflow
 */
export async function createWorkflow(
  userId: string,
  config: WorkflowConfig,
): Promise<any> {
  try {
    const workflow = await prisma.workflow.create({
      data: {
        name: config.name,
        trigger: config.trigger,
        description: `Automated workflow with ${config.steps.length} steps`,
        steps: config.steps as any,
        isActive: true,
        userId,
      },
    });

    return workflow;
  } catch (error) {
    console.error("Error creating workflow:", error);
    throw new Error("Failed to create workflow");
  }
}

/**
 * Get all workflows for a user
 */
export async function getWorkflows(userId: string): Promise<any[]> {
  try {
    const workflows = await prisma.workflow.findMany({
      where: { userId },
      include: {
        runs: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return workflows;
  } catch (error) {
    console.error("Error fetching workflows:", error);
    throw new Error("Failed to fetch workflows");
  }
}

/**
 * Execute a workflow
 */
export async function executeWorkflow(
  workflowId: string,
  userId: string,
  input?: any,
): Promise<any> {
  try {
    const workflow = await prisma.workflow.findFirst({
      where: { id: workflowId, userId },
    });

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    // Create workflow run record
    const run = await prisma.workflowRun.create({
      data: {
        workflowId,
        status: "pending",
        input: input || {},
      },
    });

    // Update workflow execution count
    await prisma.workflow.update({
      where: { id: workflowId },
      data: {
        executionCount: { increment: 1 },
        lastExecution: new Date(),
      },
    });

    // Queue the workflow for processing (background job)
    // In production, this would be sent to a job queue like Bull or RabbitMQ
    // For now, we'll return the run ID and status

    return {
      runId: run.id,
      status: "queued",
      message: `Workflow "${workflow.name}" has been queued for execution`,
    };
  } catch (error) {
    console.error("Error executing workflow:", error);
    throw new Error("Failed to execute workflow");
  }
}

/**
 * Get workflow execution history
 */
export async function getWorkflowRuns(
  workflowId: string,
  userId: string,
  limit: number = 50,
): Promise<any[]> {
  try {
    const workflow = await prisma.workflow.findFirst({
      where: { id: workflowId, userId },
    });

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    const runs = await prisma.workflowRun.findMany({
      where: { workflowId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return runs;
  } catch (error) {
    console.error("Error fetching workflow runs:", error);
    throw new Error("Failed to fetch workflow runs");
  }
}

/**
 * Update workflow
 */
export async function updateWorkflow(
  workflowId: string,
  userId: string,
  updates: Partial<WorkflowConfig>,
): Promise<any> {
  try {
    const workflow = await prisma.workflow.findFirst({
      where: { id: workflowId, userId },
    });

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    const updated = await prisma.workflow.update({
      where: { id: workflowId },
      data: {
        name: updates.name || workflow.name,
        trigger: updates.trigger || workflow.trigger,
        steps: (updates.steps as any) || workflow.steps,
      },
    });

    return updated;
  } catch (error) {
    console.error("Error updating workflow:", error);
    throw new Error("Failed to update workflow");
  }
}

/**
 * Delete workflow
 */
export async function deleteWorkflow(
  workflowId: string,
  userId: string,
): Promise<void> {
  try {
    const workflow = await prisma.workflow.findFirst({
      where: { id: workflowId, userId },
    });

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    await prisma.workflow.delete({
      where: { id: workflowId },
    });
  } catch (error) {
    console.error("Error deleting workflow:", error);
    throw new Error("Failed to delete workflow");
  }
}

/**
 * Execute agents in sequence as part of a workflow
 */
export async function executeWorkflowSteps(
  workflowId: string,
  userId: string,
  runId: string,
): Promise<any> {
  try {
    const workflow = await prisma.workflow.findFirst({
      where: { id: workflowId, userId },
    });

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    const run = await prisma.workflowRun.findUnique({
      where: { id: runId },
    });

    if (!run) {
      throw new Error("Workflow run not found");
    }

    // Update run status to running
    await prisma.workflowRun.update({
      where: { id: runId },
      data: { status: "running", startedAt: new Date() },
    });

    const steps = workflow.steps as any[];
    let output: any = run.input;
    const results: any[] = [];

    for (const step of steps) {
      try {
        // In production, this would call the actual agent
        // For now, we'll simulate the execution
        console.log(`Executing agent: ${step.agentType}`);

        const result = {
          agent: step.agentName,
          type: step.agentType,
          status: "completed",
          output: `${step.agentType} output`,
          timestamp: new Date(),
        };

        results.push(result);
        output = result.output;
      } catch (error: any) {
        // If any step fails, mark the run as failed and stop
        await prisma.workflowRun.update({
          where: { id: runId },
          data: {
            status: "failed",
            error: error.message,
            completedAt: new Date(),
            output: { results, error: error.message },
          },
        });

        throw error;
      }
    }

    // All steps completed successfully
    await prisma.workflowRun.update({
      where: { id: runId },
      data: {
        status: "completed",
        output: { results, finalOutput: output },
        completedAt: new Date(),
      },
    });

    return {
      runId,
      status: "completed",
      results,
      finalOutput: output,
    };
  } catch (error) {
    console.error("Error executing workflow steps:", error);
    throw new Error("Failed to execute workflow steps");
  }
}

import { PrismaClient } from "@prisma/client";

export interface AgentContext {
  userId?: string;
  projectId?: string;
  workflowId?: string;
  configId?: string;
  metadata?: Record<string, any>;
}

export interface ExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  tokensUsed?: number;
  executionTime?: number;
  startedAt?: Date;
  completedAt?: Date;
}

export interface AgentInterface {
  name: string;
  type: string;
  description: string;

  /**
   * Validates the input before execution.
   */
  validate(input: any): boolean | Promise<boolean>;

  /**
   * Executes the primary agent logic.
   */
  run(input: any, config?: any): Promise<any>;

  /**
   * Saves the output to the appropriate database model.
   */
  save(output: any, projectId?: string): Promise<any>;

  /**
   * Logs execution details and usage.
   */
  log(details: any): Promise<void>;
}

export abstract class BaseAgent implements AgentInterface {
  name: string;
  type: string;
  description: string;
  private prisma: PrismaClient;

  constructor(name: string, type: string, description: string) {
    this.name = name;
    this.type = type;
    this.description = description;
    this.prisma = new PrismaClient();
  }

  abstract validate(input: any): boolean | Promise<boolean>;

  abstract run(input: any, config?: any): Promise<any>;

  async save(output: any, projectId?: string): Promise<any> {
    console.log(`[${this.name}] save called, override to persist.`);
    return output;
  }

  async log(details: AgentContext & ExecutionResult): Promise<void> {
    try {
      if (details.configId && details.userId) {
        const logEntry = await this.prisma.agentLog.create({
          data: {
            agentConfigId: details.configId,
            agentType: this.type,
            status: details.success ? "completed" : "failed",
            input: details.metadata || {},
            output: details.data || null,
            error: details.error || null,
            tokensUsed: details.tokensUsed || 0,
            executionTime: details.executionTime || 0,
            startedAt: details.startedAt || new Date(),
            completedAt: details.completedAt || new Date(),
          },
        });

        // Update agent config with last run time and usage
        await this.prisma.agentConfig.update({
          where: { id: details.configId },
          data: {
            lastRun: new Date(),
            usage: { increment: details.tokensUsed || 0 },
          },
        });

        return logEntry;
      }
    } catch (error) {
      console.error(`[AGENT LOG ERROR: ${this.name}]`, error);
    }
  }

  /**
   * Execute agent with tracking
   */
  async execute(
    input: any,
    context: AgentContext,
    config?: any,
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const startedAt = new Date();

    try {
      // Validate input
      const isValid = await this.validate(input);
      if (!isValid) {
        throw new Error(`Invalid input for ${this.name}`);
      }

      // Run agent
      const data = await this.run(input, config);
      const executionTime = Date.now() - startTime;

      const result: ExecutionResult = {
        success: true,
        data,
        executionTime,
        startedAt,
        completedAt: new Date(),
      };

      // Log execution
      await this.log({
        ...context,
        ...result,
      });

      return result;
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      const result: ExecutionResult = {
        success: false,
        error: error.message,
        executionTime,
        startedAt,
        completedAt: new Date(),
      };

      // Log error
      await this.log({
        ...context,
        ...result,
      });

      return result;
    }
  }
}

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

  constructor(name: string, type: string, description: string) {
    this.name = name;
    this.type = type;
    this.description = description;
  }

  abstract validate(input: any): boolean | Promise<boolean>;
  
  abstract run(input: any, config?: any): Promise<any>;
  
  async save(output: any, projectId?: string): Promise<any> {
    // Optional default implementation, can be overridden
    console.log(`[${this.name}] save called, override to persist.`);
    return output;
  }
  
  async log(details: any): Promise<void> {
    // Common logging mechanism (could eventually log to a DB table)
    console.log(`[AGENT LOG: ${this.name}]`, details);
  }
}

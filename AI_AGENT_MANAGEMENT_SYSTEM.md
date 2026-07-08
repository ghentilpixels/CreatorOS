# AI Agent Management System - CreatorOS

## Overview

The AI Agent Management System is a comprehensive framework for managing multiple specialized AI agents, building automation workflows, and orchestrating complex content creation pipelines.

## Architecture

### Core Components

#### 1. **BaseAgent Framework** (`src/lib/ai/agents/BaseAgent.ts`)

The foundation for all agents with built-in logging and execution tracking.

```typescript
interface AgentInterface {
  name: string;
  type: string;
  description: string;
  validate(input: any): boolean | Promise<boolean>;
  run(input: any, config?: any): Promise<any>;
  save(output: any, projectId?: string): Promise<any>;
  log(details: any): Promise<void>;
}
```

**Key Features:**

- Standardized execution interface
- Automatic logging to database
- Execution time tracking
- Token usage monitoring
- Error handling and reporting

**Usage:**

```typescript
const agent = new ResearchAgent();
const result = await agent.execute(input, context, config);
```

#### 2. **Agent Management** (`src/features/agents/actions.ts`)

Server-side actions for managing agent configurations and logs.

**Available Functions:**

- `getAgents(userId)` - Fetch all agents for a user
- `updateAgent(input, userId)` - Update agent configuration
- `getAgentLogs(configId, userId, limit)` - Retrieve execution logs
- `getAgentStats(configId, userId)` - Get performance statistics
- `initializeAgents(userId)` - Create default agents for new users

#### 3. **Workflow Orchestration** (`src/features/agents/workflow-service.ts`)

Manage and execute complex automation workflows.

**Available Functions:**

- `createWorkflow(userId, config)` - Create a new workflow
- `executeWorkflow(workflowId, userId, input)` - Queue workflow for execution
- `getWorkflows(userId)` - List all workflows
- `executeWorkflowSteps(workflowId, userId, runId)` - Run workflow steps sequentially

#### 4. **Background Processing** (`src/services/workflow-processor.ts`)

Handle long-running workflow jobs with proper error handling.

**Features:**

- Sequential step execution
- Input/output chaining
- Error recovery
- Job status tracking

## Database Schema

### Core Models

#### AgentConfig

```prisma
model AgentConfig {
  id           String
  name         String
  type         String        // research, script, seo, thumbnail, trend, analytics
  status       String        // active, inactive
  model        String        // GPT-4o, Claude, Gemini, etc.
  provider     String        // openai, anthropic, google
  temperature  Float
  instructions String?
  lastRun      DateTime?
  usage        Int           // total tokens used
  userId       String
  logs         AgentLog[]
}
```

#### AgentLog

```prisma
model AgentLog {
  id              String
  agentConfigId   String
  agentType       String
  status          String        // pending, running, completed, failed
  input           Json?
  output          Json?
  error           String?
  tokensUsed      Int
  executionTime   Int           // milliseconds
  startedAt       DateTime
  completedAt     DateTime?
}
```

#### Workflow

```prisma
model Workflow {
  id              String
  name            String
  description     String?
  trigger         String        // manual, new_topic_added, scheduled, webhook
  steps           Json          // Array of agent type steps
  isActive        Boolean
  executionCount  Int
  lastExecution   DateTime?
  userId          String
  runs            WorkflowRun[]
}
```

#### WorkflowRun

```prisma
model WorkflowRun {
  id          String
  workflowId  String
  status      String        // pending, running, completed, failed
  input       Json?
  output      Json?
  error       String?
  startedAt   DateTime?
  completedAt DateTime?
}
```

#### ContentPackage

```prisma
model ContentPackage {
  id          String
  projectId   String
  workflowId  String?
  status      String        // draft, processing, completed
  researchId  String?
  scriptId    String?
  thumbnailId String?
  seoAssetId  String?
}
```

## Available Agents

### 1. Research Agent

- **Purpose**: Analyzes topics and generates research insights
- **Default Model**: GPT-4o
- **Output**: Topic summary, market opportunity, trending questions, audience pain points, competitor analysis, keywords, video ideas

### 2. Script Agent

- **Purpose**: Generates engaging video scripts
- **Default Model**: Claude 3.5 Sonnet
- **Output**: Hook, full script, style recommendations, estimated duration

### 3. SEO Agent

- **Purpose**: Optimizes content for search engines
- **Default Model**: GPT-4o
- **Output**: Optimized title, description, keywords, tags, hashtags

### 4. Thumbnail Agent

- **Purpose**: Designs high-performing thumbnails
- **Default Model**: Gemini 1.5 Pro
- **Output**: Design prompt, composition guidance, headline text

### 5. Trend Agent

- **Purpose**: Identifies trending topics and opportunities
- **Default Model**: GPT-4o Mini
- **Output**: Trending topics, momentum analysis, relevance score

### 6. Analytics Agent

- **Purpose**: Analyzes performance metrics
- **Default Model**: Claude 3 Haiku
- **Output**: Performance insights, optimization recommendations

## UI Components

### 1. Agent Settings Modal (`src/features/agents/components/AgentSettingsModal.tsx`)

**Features:**

- Configuration tab: Change model, temperature, status, instructions
- Logs tab: View execution history with status, timing, and token usage
- Real-time updates
- Save/Cancel actions

### 2. Workflow Builder (`src/features/agents/components/WorkflowBuilder.tsx`)

**Features:**

- Visual workflow design
- Drag-to-reorder steps
- Multiple trigger types
- Real-time preview
- Agent selection picker

**Trigger Types:**

- `manual` - Manual execution via button
- `new_topic_added` - Trigger on new topic in ideas
- `scheduled` - Execute on schedule
- `webhook` - External webhook trigger

### 3. Agent Dashboard (`src/app/(dashboard)/agents/page.tsx`)

**Features:**

- Grid and list view modes
- Agent status overview
- Real-time stats (active agents, total tokens, workflows)
- New workflow button
- Test run functionality

## Example Workflows

### 1. Content Pipeline (Manual Trigger)

```
New Topic Added
    ↓
Research Agent → Generate research insights
    ↓
Script Agent → Create engaging script
    ↓
SEO Agent → Optimize for search
    ↓
Thumbnail Agent → Design thumbnail
    ↓
Save Content Package
```

### 2. Trend Analysis (Scheduled Daily)

```
Daily Trigger (9 AM)
    ↓
Trend Agent → Identify trending topics
    ↓
Research Agent → Deep dive research
    ↓
Analytics Agent → Analyze opportunities
    ↓
Save Report
```

### 3. Quick Script Generation (Manual Trigger)

```
Topic Input
    ↓
Script Agent → Generate script
    ↓
SEO Agent → Optimize title/description
    ↓
Save Draft
```

## Configuration Management

### Model Options by Provider

**OpenAI:**

- gpt-4o
- gpt-4-turbo
- gpt-4o-mini

**Anthropic:**

- claude-3-5-sonnet-20241022
- claude-3-opus-20240229
- claude-3-haiku-20240307

**Google:**

- gemini-1.5-pro
- gemini-1.5-flash
- gemini-1.0-pro

### Temperature Guidance

- **0.0 - 0.3**: Precise, deterministic (good for SEO, structured output)
- **0.4 - 0.7**: Balanced (good for most general tasks)
- **0.8 - 1.0**: Creative (good for scripts, ideas)
- **1.0 - 2.0**: Very creative (experimental)

## Execution Flow

### Single Agent Execution

```typescript
const context: AgentContext = {
  userId: 'user123',
  configId: 'config456',
  metadata: { topic: 'AI trends' }
};

const result = await agent.execute(input, context, config);

// Result structure:
{
  success: boolean,
  data: any,
  error?: string,
  tokensUsed?: number,
  executionTime?: number,
  startedAt?: Date,
  completedAt?: Date
}
```

### Workflow Execution

1. **Queue Phase**: Workflow is added to execution queue
2. **Fetch Phase**: Retrieve workflow configuration and agents
3. **Execute Phase**: Run each step sequentially
4. **Chain Phase**: Pass output from one step to the next
5. **Save Phase**: Create ContentPackage with all outputs
6. **Log Phase**: Record execution in WorkflowRun

## Monitoring & Analytics

### Agent Metrics

- **Total Runs**: Number of times agent has been executed
- **Successful Runs**: Completed executions
- **Failed Runs**: Error executions
- **Success Rate**: Percentage of successful runs
- **Avg Execution Time**: Average time per execution
- **Total Tokens**: Cumulative tokens used

### Workflow Metrics

- **Execution Count**: Total workflow runs
- **Last Execution**: Most recent run timestamp
- **Status**: Active/Inactive
- **Average Duration**: Typical execution time

## Error Handling

### Agent-Level Errors

- **Validation Error**: Input doesn't match schema
- **Execution Error**: Agent processing fails
- **API Error**: Model provider returns error
- **Timeout Error**: Execution exceeds time limit

### Workflow-Level Errors

- **Step Failure**: Individual agent fails
- **Cascading Failure**: Downstream agent can't process previous output
- **Resource Error**: Insufficient tokens/quota

## Best Practices

### 1. Temperature Configuration

- Keep research/SEO agents at 0.5-0.6 for consistency
- Use 0.7-0.8 for creative content (scripts, ideas)
- Adjust based on output variance

### 2. Workflow Design

- Start with simpler workflows (2-3 steps)
- Test individual agents before workflow
- Use manual trigger for initial testing
- Monitor execution metrics

### 3. Monitoring

- Check execution logs regularly
- Monitor token usage per agent
- Alert on high failure rates (>10%)
- Review agent configuration changes

### 4. Optimization

- Adjust temperature for better results
- Modify instructions for specific use cases
- Combine complementary agents
- Batch similar requests

## Future Enhancements

### Planned Features

- [ ] Conditional step execution
- [ ] Parallel agent execution
- [ ] Custom output formatting
- [ ] Webhook triggers
- [ ] Agent chaining templates
- [ ] Cost optimization alerts
- [ ] Multi-language support
- [ ] Agent performance benchmarks

### Background Processing

- [ ] Dedicated job queue (Bull/RabbitMQ)
- [ ] Worker process scaling
- [ ] Retry with exponential backoff
- [ ] Job priority levels
- [ ] Execution timeout policies

## Troubleshooting

### Agent Not Executing

1. Check agent status (active/inactive)
2. Verify model availability
3. Check API credentials
4. Review error logs

### Slow Execution

1. Monitor agent execution times
2. Check model availability
3. Reduce temperature for faster, deterministic responses
4. Consider using faster models (mini/haiku)

### High Token Usage

1. Review input complexity
2. Adjust model selection
3. Optimize instructions
4. Batch related requests

## API Reference

See `src/features/agents/actions.ts` and `src/features/agents/workflow-service.ts` for complete function signatures and examples.

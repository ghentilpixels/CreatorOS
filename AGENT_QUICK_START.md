# Quick Start Guide - AI Agent Management System

## Installation

### 1. Update Database Schema

```bash
npx prisma migrate dev --name add_agents_and_workflows
```

This creates the new tables:

- `agent_config` - Agent settings and configuration
- `agent_log` - Execution logs and metrics
- `workflow` - Workflow definitions
- `workflow_run` - Execution history
- `content_package` - Final outputs

### 2. Initialize Agents

Users will automatically get 6 default agents on first login:

```typescript
import { initializeAgents } from "@/features/agents/actions";

// Called when user signs up or first visits agents page
await initializeAgents(userId);
```

## Usage

### Managing Agents

#### View All Agents

```typescript
import { getAgents } from "@/features/agents/actions";

const agents = await getAgents(userId);
// Returns: AgentConfig[]
```

#### Update Agent Configuration

```typescript
import { updateAgent } from "@/features/agents/actions";

await updateAgent(
  {
    id: "agent-id",
    model: "gpt-4o",
    temperature: 0.7,
    instructions: "Custom instructions...",
    status: "active",
  },
  userId,
);
```

#### Get Agent Statistics

```typescript
import { getAgentStats } from "@/features/agents/actions";

const stats = await getAgentStats(configId, userId);
// Returns: {
//   totalRuns: number,
//   successfulRuns: number,
//   failedRuns: number,
//   successRate: number,
//   avgExecutionTime: number,
//   totalTokens: number,
//   lastRun: Date
// }
```

#### View Execution Logs

```typescript
import { getAgentLogs } from "@/features/agents/actions";

const logs = await getAgentLogs(configId, userId, 50);
// Returns: AgentLogEntry[] (sorted by date, newest first)
```

### Building Workflows

#### Create a Workflow

```typescript
import { createWorkflow } from "@/features/agents/workflow-service";

const workflow = await createWorkflow(userId, {
  name: "Content Pipeline",
  trigger: "manual",
  steps: [
    { id: "step-1", agentType: "research", agentName: "Research Agent" },
    { id: "step-2", agentType: "script", agentName: "Script Agent" },
    { id: "step-3", agentType: "seo", agentName: "SEO Agent" },
    { id: "step-4", agentType: "thumbnail", agentName: "Thumbnail Agent" },
  ],
});
```

#### Execute a Workflow

```typescript
import { executeWorkflow } from "@/features/agents/workflow-service";

const result = await executeWorkflow(workflowId, userId, {
  topic: "AI Trends 2024",
  platform: "YouTube",
  targetAudience: "Tech professionals",
});

// Returns: {
//   runId: string,
//   status: 'queued' | 'running' | 'completed' | 'failed',
//   message: string
// }
```

#### List All Workflows

```typescript
import { getWorkflows } from "@/features/agents/workflow-service";

const workflows = await getWorkflows(userId);
// Returns: Workflow[] with latest run info
```

### Advanced: Direct Agent Execution

#### Execute Single Agent with Tracking

```typescript
import { ResearchAgent } from "@/lib/ai/agents/ResearchAgent";

const agent = new ResearchAgent();

const result = await agent.execute(
  {
    topic: "AI Trends",
    audience: "Tech creators",
    platform: "YouTube",
    contentType: "Educational",
  },
  {
    userId: "user-123",
    projectId: "project-456",
    configId: "agent-789",
  },
  {
    model: "gpt-4o",
    temperature: 0.7,
  },
);

// Result includes:
// - success: boolean
// - data: Agent output
// - error?: string
// - tokensUsed?: number
// - executionTime?: number
// - Automatically logged to database
```

## Common Patterns

### Pattern 1: Simple One-Step Agent

```typescript
// User clicks "Generate Research" button
import { getAgent } from "@/features/agents/actions";

const agent = await getAgent(agentConfigId, userId);
// Execute agent with current config
```

### Pattern 2: Content Pipeline

```typescript
// User adds new topic
// → Trigger 'new_topic_added' workflow
// → Executes: Research → Script → SEO → Thumbnail
// → Creates ContentPackage with all outputs
```

### Pattern 3: Scheduled Trend Analysis

```typescript
// Daily at 9 AM (via cron)
// → Execute 'Trend Analysis' workflow
// → Runs: Trend → Research → Analytics
// → Saves report to database
```

### Pattern 4: Custom Instructions

```typescript
// Edit agent settings modal
// User can modify:
// - Model selection
// - Temperature (0-2)
// - Custom instructions
// - Agent status
// Changes apply immediately to next execution
```

## Monitoring

### Track Agent Performance

```typescript
const stats = await getAgentStats(configId, userId);

if (stats.successRate < 90) {
  console.warn(`Agent ${name} has success rate of ${stats.successRate}%`);
}

if (stats.avgExecutionTime > 30000) {
  console.warn(`Agent ${name} taking avg ${stats.avgExecutionTime}ms`);
}
```

### View Workflow History

```typescript
import { getWorkflowRuns } from "@/features/agents/workflow-service";

const runs = await getWorkflowRuns(workflowId, userId, 100);
// Latest runs first
// Check status, duration, errors
```

## Configuration

### Agent Models

```
OpenAI:     gpt-4o, gpt-4-turbo, gpt-4o-mini
Anthropic:  claude-3-5-sonnet, claude-3-opus, claude-3-haiku
Google:     gemini-1.5-pro, gemini-1.5-flash, gemini-1.0-pro
```

### Temperature Recommendations

```
SEO Agent:        0.5   (Consistent, structured)
Analytics Agent:  0.4   (Precise analysis)
Research Agent:   0.7   (Balanced, comprehensive)
Thumbnail Agent:  0.7   (Creative designs)
Script Agent:     0.8   (Creative writing)
Trend Agent:      0.6   (Balanced insights)
```

### Trigger Types

```
'manual'           → User clicks button
'new_topic_added'  → When user creates idea
'scheduled'        → Cron-based execution
'webhook'          → External trigger (future)
```

## Error Handling

### Try-Catch Pattern

```typescript
try {
  const result = await executeWorkflow(workflowId, userId, input);
  if (result.status === "queued") {
    // Monitor execution via WorkflowRun table
  }
} catch (error) {
  console.error("Workflow execution failed:", error.message);
  // Show user error toast
}
```

### Check Agent Status

```typescript
const agent = await getAgent(agentId, userId);
if (agent.status === "inactive") {
  // Show warning to user
  alert(`${agent.name} is currently inactive`);
}
```

## Testing

### Test Single Agent

```bash
# Click "Test Run" button on agent card
# OR programmatically:

await agent.execute(testInput, context, config);
// Check logs in modal Execution Logs tab
```

### Test Workflow

```bash
# Use Workflow Builder preview
# Create workflow → Click "Save Workflow"
# Click play button on workflow card
# Monitor via WorkflowRun table and logs
```

## Next Steps

1. **Implement Real Agent Logic**: Update agent classes to call actual models
2. **Set Up Background Jobs**: Configure Bull or RabbitMQ for workflow processing
3. **Add Webhooks**: Implement webhook trigger support
4. **Enable Parallel Execution**: Allow simultaneous agent runs
5. **Build Templates**: Create workflow templates for common use cases
6. **Add Metrics Dashboard**: Visualize agent performance over time

## Support

For detailed architecture and API reference, see `AI_AGENT_MANAGEMENT_SYSTEM.md`

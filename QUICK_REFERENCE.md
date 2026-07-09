# CreatorOS - Quick Reference Guide

## 🚀 Quick Start Commands

```bash
# Setup
npm install
npm run db:push
npm run dev

# Open browser
http://localhost:3000
```

## 📂 Key File Locations

| Feature    | Location                               | Purpose                           |
| ---------- | -------------------------------------- | --------------------------------- |
| Analytics  | `src/lib/analytics/`                   | Types, service, calculations      |
| Publishing | `src/lib/publishing/`                  | Platform integrations, scheduling |
| Workspace  | `src/lib/workspace/`                   | Team management, subscriptions    |
| Components | `src/components/`                      | Reusable UI components            |
| Pages      | `src/app/(dashboard)/`                 | Dashboard pages                   |
| Errors     | `src/lib/errors.ts`                    | Error handling                    |
| Loading    | `src/components/ui/loading-states.tsx` | Loading components                |

## 🔑 Key Types

### Analytics

```typescript
import { AnalyticsData, PerformanceMetrics } from "@/lib/analytics/types";
```

### Publishing

```typescript
import { PublishingSchedule, PlatformConnection } from "@/lib/publishing/types";
```

### Workspace

```typescript
import { Workspace, UserRole, SubscriptionPlan } from "@/lib/workspace/types";
```

## 📡 API Services

### Get Analytics

```typescript
import { AnalyticsService } from "@/lib/analytics/service";

const data = await AnalyticsService.getAnalyticsData("month");
```

### Manage Publishing

```typescript
import { PublishingService } from "@/lib/publishing/service";

const connections = await PublishingService.getConnections(userId);
await PublishingService.schedulePublish(userId, schedule);
```

### Manage Workspace

```typescript
import { WorkspaceService } from "@/lib/workspace/service";

const workspaces = await WorkspaceService.getWorkspaces(userId);
const subscription = await WorkspaceService.getSubscription(workspaceId);
```

## 🎨 Components

### Charts

```typescript
import { LineChart, BarChart, MetricCard } from "@/components/charts/AnalyticsCharts";

<LineChart data={data} title="Views" color="text-blue-400" />
<BarChart data={data} title="Top Content" color="bg-blue-500" />
<MetricCard label="Views" value={125430} change={12} changeType="increase" />
```

### AI Agent

```typescript
import { AIAnalyticsAgent } from "@/components/analytics/AIAnalyticsAgent";

<AIAnalyticsAgent />
```

### Usage Meter

```typescript
import { UsageMeter } from "@/components/workspace/UsageMeter";

<UsageMeter plan="pro" usage={usage} onUpgrade={handleUpgrade} />
```

### Loading States

```typescript
import {
  LoadingSpinner,
  SkeletonCard,
  ErrorState,
  EmptyState
} from "@/components/ui/loading-states";

<LoadingSpinner />
<SkeletonCard />
<ErrorState onRetry={retry} />
<EmptyState action={{ label: "Create", onClick: create }} />
```

## 🔐 Subscription Plans

```typescript
const PLANS = {
  free: { price: 0, maxProjects: 3, maxUsers: 1 },
  pro: { price: 19, maxProjects: 50, maxUsers: 3 },
  team: { price: 49, maxProjects: 200, maxUsers: 10 },
  enterprise: { price: 0, maxProjects: -1, maxUsers: -1 },
};
```

## 👥 User Roles & Permissions

```typescript
// Check if user can perform action
import { canPerformAction } from "@/lib/workspace/types";

if (canPerformAction(userRole, "delete_content")) {
  // Allow deletion
}
```

## ⚠️ Error Handling

```typescript
import { ERROR_CODES, AppError } from "@/lib/errors";

try {
  // operation
} catch (error) {
  if (error instanceof AppError) {
    console.log(error.code, error.message);
  }
}
```

## 📊 Common Patterns

### Fetch Analytics

```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  AnalyticsService.getAnalyticsData("month")
    .then(setData)
    .finally(() => setLoading(false));
}, []);

if (loading) return <LoadingSpinner />;
return <Analytics data={data} />;
```

### Manage Publishing

```typescript
const [platforms, setPlatforms] = useState<PublishingPlatform[]>([]);

async function handlePublish() {
  await PublishingService.schedulePublish(userId, {
    platforms,
    scheduledFor: new Date(date),
    content: { title, description },
  });
}
```

### Workspace Operations

```typescript
// Create workspace
const workspace = await WorkspaceService.createWorkspace({
  name,
  slug,
  ownerId: user.id,
});

// Invite user
await WorkspaceService.inviteUser(workspaceId, email, "editor");

// Check quota
const limits = WorkspaceService.isLimitExceeded("pro", "maxProjects", 45);
```

## 🧪 Testing

```typescript
// Unit test
import { AnalyticsService } from "@/lib/analytics/service";

describe("AnalyticsService", () => {
  it("should fetch metrics", async () => {
    const metrics = await AnalyticsService.getMetrics("month");
    expect(metrics.views).toBeGreaterThan(0);
  });
});
```

## 📱 Responsive Breakpoints

```typescript
// Tailwind classes
sm: 640px   // Mobile
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Wide
2xl: 1536px // Ultra-wide
```

## 🎨 Color Scheme

```
Primary: Blue (#3b82f6)
Success: Emerald (#34d399)
Warning: Yellow (#fbbf24)
Error: Red (#ef4444)
Background: Black (#000000)
Card: Zinc (#18181b) with white/5 border
```

## 📦 Dependencies

Key packages used:

- **Next.js** - React framework
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Prisma** - Database ORM (ready to use)
- **NextAuth** - Authentication (ready to configure)
- **Stripe** - Payments (ready to integrate)

## 🔗 Important URLs

| Page       | URL          | Purpose                           |
| ---------- | ------------ | --------------------------------- |
| Analytics  | `/analytics` | View metrics & insights           |
| Publishing | `/publish`   | Manage platform connections       |
| Settings   | `/settings`  | Workspace & subscription settings |
| Projects   | `/projects`  | Manage content projects           |
| Agents     | `/agents`    | AI agents dashboard               |

## 💡 Tips & Best Practices

1. **Always use types** - TypeScript is enforced
2. **Error handling** - Use AppError for consistent errors
3. **Loading states** - Always show skeleton/spinner
4. **API calls** - Use service classes
5. **Component reuse** - Check components folder first
6. **Environment vars** - Never commit secrets
7. **Performance** - Use React.memo for heavy components

## 📞 Getting Help

- Check `SAAS_DOCUMENTATION.md` for detailed docs
- Review `IMPLEMENTATION_GUIDE.md` for implementation patterns
- Look at existing components for examples
- Check error types in `src/lib/errors.ts`

---

**CreatorOS is ready to use! Start building!** 🚀

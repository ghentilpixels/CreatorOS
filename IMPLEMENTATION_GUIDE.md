# CreatorOS - Implementation Guide

## Quick Start for Developers

This guide covers how to implement CreatorOS as a complete SaaS platform in your codebase.

## 1. Core Setup

### Authentication

```typescript
// src/lib/auth/session.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
```

### Database Schema (Prisma Example)

```prisma
model User {
  id String @id @default(cuid())
  email String @unique
  name String?
  avatar String?
  workspaces WorkspaceUser[]
  subscriptions Subscription[]
  createdAt DateTime @default(now())
}

model Workspace {
  id String @id @default(cuid())
  name String
  slug String @unique
  description String?
  ownerId String
  owner User @relation(fields: [ownerId], references: [id])
  members WorkspaceUser[]
  subscription Subscription?
  settings WorkspaceSettings?
  createdAt DateTime @default(now())
}

model WorkspaceUser {
  id String @id @default(cuid())
  workspaceId String
  userId String
  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role String @default("viewer")
  joinedAt DateTime @default(now())
  @@unique([workspaceId, userId])
}

model Subscription {
  id String @id @default(cuid())
  workspaceId String @unique
  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  plan String @default("free")
  status String @default("active")
  currentPeriodStart DateTime
  currentPeriodEnd DateTime
  autoRenew Boolean @default(true)
  stripeCustomerId String?
  stripeSubscriptionId String?
  cancelledAt DateTime?
  createdAt DateTime @default(now())
}
```

## 2. API Routes Implementation

### Authentication Endpoints

```typescript
// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;

  try {
    // Implement login logic
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Hash password comparison
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
```

### Workspace Endpoints

```typescript
// pages/api/workspaces/index.ts
import { requireAuth } from "@/lib/auth/session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await requireAuth();

  if (req.method === "GET") {
    const workspaces = await prisma.workspaceUser.findMany({
      where: { userId: user.id },
      include: { workspace: true },
    });
    return res.json(workspaces.map((w) => w.workspace));
  }

  if (req.method === "POST") {
    const { name, slug, description } = req.body;

    const workspace = await prisma.workspace.create({
      data: {
        name,
        slug,
        description,
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
            role: "owner",
          },
        },
        subscription: {
          create: {
            plan: "free",
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
    });

    return res.json(workspace);
  }

  res.status(405).end();
}
```

### Analytics Endpoints

```typescript
// pages/api/analytics/index.ts
import { requireAuth } from "@/lib/auth/session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await requireAuth();
  const { workspaceId, period = "month" } = req.query;

  try {
    // Fetch analytics from your data source
    const metrics = await getAnalyticsMetrics(
      workspaceId as string,
      period as string,
    );

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
}
```

### Publishing Endpoints

```typescript
// pages/api/publishing/schedule.ts
import { requireAuth } from "@/lib/auth/session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  const user = await requireAuth();
  const { platforms, scheduledFor, content } = req.body;

  try {
    // Validate subscription allows publishing
    const subscription = await getWorkspaceSubscription(req.body.workspaceId);
    if (!subscription)
      return res.status(402).json({ error: "Subscription required" });

    // Create publishing schedule
    const schedule = await prisma.publishingSchedule.create({
      data: {
        platforms,
        scheduledFor: new Date(scheduledFor),
        content,
        status: "scheduled",
      },
    });

    res.json({ success: true, schedule });
  } catch (error) {
    res.status(500).json({ error: "Failed to schedule publish" });
  }
}
```

## 3. Frontend Implementation

### Using the Services

```typescript
// Component using analytics service
import { AnalyticsService } from "@/lib/analytics/service";
import { LineChart, MetricCard } from "@/components/charts/AnalyticsCharts";

export function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AnalyticsService.getAnalyticsData("month")
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {data?.growthTrend && (
        <LineChart data={data.growthTrend} title="Views Growth" />
      )}
    </div>
  );
}
```

### Workspace Context

```typescript
// Create context for workspace state
import { createContext, useContext } from "react";

interface WorkspaceContextType {
  workspace: Workspace | null;
  loading: boolean;
  switchWorkspace: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used within provider");
  return context;
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load workspace
    setLoading(false);
  }, []);

  return (
    <WorkspaceContext.Provider value={{ workspace, loading, switchWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
```

## 4. Subscription & Billing

### Stripe Integration

```typescript
// pages/api/subscriptions/upgrade.ts
import Stripe from "stripe";
import { requireAuth } from "@/lib/auth/session";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  const user = await requireAuth();
  const { workspaceId, plan } = req.body;

  try {
    // Get or create Stripe customer
    let customerId = await getStripeCustomerId(workspaceId);
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { workspaceId },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: getStripePriceId(plan),
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/billing`,
    });

    res.json({ sessionUrl: session.url });
  } catch (error) {
    res.status(500).json({ error: "Billing error" });
  }
}
```

## 5. Error Handling & Monitoring

### Error Handler Middleware

```typescript
// middleware/errorHandler.ts
export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
    };
  }

  return {
    statusCode: 500,
    body: {
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
      },
    },
  };
}
```

### Monitoring & Logging

```typescript
// lib/monitoring/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${message}`, meta);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${message}`, meta);
  },
};
```

## 6. Testing

### Unit Tests

```typescript
// __tests__/lib/workspace/service.test.ts
describe("WorkspaceService", () => {
  it("should create workspace", async () => {
    const workspace = await WorkspaceService.createWorkspace({
      name: "Test",
      slug: "test",
      ownerId: "user-1",
    });

    expect(workspace).toHaveProperty("id");
    expect(workspace.name).toBe("Test");
  });
});
```

### Integration Tests

```typescript
// __tests__/api/workspaces.test.ts
describe("GET /api/workspaces", () => {
  it("should return user's workspaces", async () => {
    const res = await fetch("/api/workspaces", {
      headers: { Authorization: "Bearer token" },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
```

## 7. Deployment Checklist

- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Configure email service
- [ ] Setup Stripe webhooks
- [ ] Configure OAuth with all platforms
- [ ] Enable HTTPS
- [ ] Setup CDN for static assets
- [ ] Configure rate limiting
- [ ] Setup monitoring and alerts
- [ ] Test payment flow
- [ ] Test OAuth integrations
- [ ] Load test API
- [ ] Security audit

## 8. Next Steps

1. **Implement Database**: Set up PostgreSQL and Prisma migrations
2. **Configure Authentication**: Setup NextAuth with your chosen providers
3. **Integrate Stripe**: Complete billing integration
4. **Connect Platforms**: Implement OAuth for YouTube, TikTok, etc.
5. **Setup Monitoring**: Configure error tracking and analytics
6. **Deploy**: Follow deployment checklist and go live

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [NextAuth Documentation](https://next-auth.js.org)

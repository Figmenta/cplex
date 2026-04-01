# Next.js 16 — AI Coding Guide

> Stack: Next.js 16.2+ · Supabase · Drizzle ORM · Tailwind · shadcn/ui
> Read this before writing any Next.js code.
> AI models were trained on older Next.js — this corrects the outdated patterns they default to.

---

## BEFORE ANYTHING ELSE — THE AGENTS.MD SETUP

This is not optional if you are vibe coding. Do this first, before creating a single file.

Next.js ships version-matched documentation inside the next package. An AGENTS.md file at the root of your project directs agents to these bundled docs instead of their training data. The docs live at `node_modules/next/dist/docs/` and always match your installed version — no network request needed.

Internal Vercel research showed that always-available bundled context achieved a 100% pass rate on Next.js evals, compared to 79% with on-demand retrieval. That 21% difference is the difference between code that works and code that silently uses deprecated APIs.

**Create these two files at project root after `npm install`:**

```
# AGENTS.md
<!-- BEGIN:nextjs-agent-rules -->
# Next.js: ALWAYS read docs before coding
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`.
Your training data is outdated — the docs are the source of truth.
<!-- END:nextjs-agent-rules -->

# Project-specific rules (add yours below this line):
- Stack: Next.js 16, Supabase, Drizzle ORM, Tailwind, shadcn/ui
- cacheComponents: true is enabled — use "use cache" directive, NOT unstable_cache
- proxy.ts replaces middleware.ts — never create middleware.ts
- params and searchParams are always Promises — always await them
```

```
# CLAUDE.md
@AGENTS.md
```

For Next.js 16.1 and earlier, run the codemod to generate these instead:

```bash
npx @next/codemod@latest agents-md
```

---

## 0. THE MENTAL MODEL

Two sentences. If you remember nothing else, remember these:

> **Everything runs at request time by default. You explicitly opt IN to caching with `"use cache"`.**

This is the opposite of Next.js 13/14. That version cached everything by default, causing stale data bugs everywhere. Next.js 15 started reversing this. Next.js 16 completed it. If AI writes code using `fetch({ cache: 'force-cache' })` or `unstable_cache()` — it's using old patterns. The correct pattern in v16 is `"use cache"` directive.

---

## 1. PROJECT SETUP

### next.config.ts

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables "use cache" directive + PPR — required for this guide
  cacheComponents: true,

  // Turbopack filesystem cache — much faster dev restarts on large projects
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

  // Forward browser errors to terminal — critical for AI debugging (16.2+)
  // AI agents can't see the browser console. This makes errors visible.
  logging: {
    browserToTerminal: "error", // 'warn' | true (all) | false (disable)
  },

  // Custom cache profiles — reference by name in cacheLife()
  cacheLife: {
    // Almost never changes: platform config, pricing tiers, static content
    static: {
      stale: 60 * 60 * 24 * 7, // 7 days client-side
      revalidate: 60 * 60 * 24, // recheck once/day
      expire: 60 * 60 * 24 * 30, // max 30 days
    },
    // Profiles, listing pages — updates occasionally
    standard: {
      stale: 60,       // 1 min client
      revalidate: 300, // recheck every 5 min
      expire: 3600,    // max 1 hour
    },
    // Counts, statuses — updates frequently
    live: {
      stale: 10,
      revalidate: 30,
      expire: 60,
    },
  },

  images: {
    minimumCacheTTL: 14400, // 4 hours (v16 default — keep it)
  },
};

export default nextConfig;
```


## 2. proxy.ts — REPLACES MIDDLEWARE.TS

`middleware.ts` is deprecated in Next.js 16. Rename it to `proxy.ts` and rename the export to `proxy`.

**Rule: proxy.ts only checks if a session cookie EXISTS. No DB calls. No JWT verification. Keep it under 20ms.**

```ts
// src/proxy.ts
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/about",
  "/contact",
  // add your public routes here
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets — always allow
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(png|jpg|svg|ico|css|js|woff2?)$/)
  )
    return NextResponse.next();

  // Webhooks — always allow (Stripe, etc. have no session cookie)
  if (pathname.startsWith("/api/webhooks")) return NextResponse.next();

  // Public paths — allow
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (isPublic) return NextResponse.next();

  // Protected — check cookie exists only. Layouts do real auth.
  const session = request.cookies.get("sb-auth-token");
  if (!session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

---

## 3. AUTHENTICATION

### Supabase Server Client

```ts
// src/lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  // cookies() is async in Next.js 16 — always await it
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component — proxy.ts handles redirect
          }
        },
      },
    }
  );
}
```

### getRequiredUser — the only auth function you need

```ts
// src/lib/auth/session.ts
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Extend Role and ROLE_HOMES to match your app's roles
type Role = "USER" | "ADMIN";

const ROLE_HOMES: Record<Role, string> = {
  USER: "/dashboard",
  ADMIN: "/admin",
};

// Use in layouts and pages. Redirects on failure — never returns null.
export async function getRequiredUser(requiredRole?: Role) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (!dbUser) redirect("/login");

  if (requiredRole && dbUser.role !== requiredRole) {
    redirect(ROLE_HOMES[dbUser.role as Role]);
  }

  return dbUser;
}

// For public pages that show different UI for logged-in users
export async function getOptionalUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);
    return dbUser ?? null;
  } catch {
    return null;
  }
}
```

### Route Group Auth Pattern

```tsx
// src/app/(app)/layout.tsx
// One auth check gates the ENTIRE authenticated section
import { getRequiredUser } from "@/lib/auth/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirects if not logged in OR wrong role — never reaches children
  const user = await getRequiredUser();
  return (
    <div className="flex h-screen">
      <Sidebar user={user} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

// src/app/(app)/dashboard/page.tsx
// No separate auth check needed — layout already did it
export default async function Dashboard() {
  const user = await getRequiredUser(); // fast — React deduplicates the call
  const [data1, data2] = await Promise.all([
    getDataA(user.id),
    getDataB(user.id),
  ]);
  return <DashboardView data1={data1} data2={data2} />;
}
```

---

## 4. CACHING — COMPLETE GUIDE

### The rules in one place

```
cacheComponents: true means:
  ✓ Everything is dynamic by default (runs every request)
  ✓ Add "use cache" to opt INTO caching
  ✓ Never cache anything that touches cookies/headers/session
  ✓ Cached functions CANNOT call cookies(), headers(), searchParams directly
  ✓ Pass user-specific values as arguments to cached functions
```

### "use cache" constraints — things AI gets wrong

```ts
// ❌ WRONG — cached functions cannot read cookies/headers directly
async function getUserData() {
  'use cache'
  const cookieStore = await cookies()  // ERROR: not allowed inside cached scope
  const token = cookieStore.get('token')
  ...
}

// ✅ CORRECT — read cookies OUTSIDE, pass result IN as argument
export default async function Page() {
  const user = await getRequiredUser() // reads cookies — NOT cached
  const data = await getUserData(user.id) // pass userId — cached safely
  return <View data={data} />
}

async function getUserData(userId: string) {
  'use cache'
  cacheLife('standard')
  cacheTag(`user-data-${userId}`) // per-user cache key
  return db.select().from(...)...
}

// ❌ WRONG — cannot invoke Server Actions inside cached scope
async function CachedForm({ action }: { action: () => Promise<void> }) {
  'use cache'
  action() // ERROR: cannot invoke Server Actions inside cached scope
  return <form>...</form>
}

// ✅ CORRECT — pass Server Actions through, let Client Components call them
async function CachedForm({ action }: { action: () => Promise<void> }) {
  'use cache'
  // Only pass the action down — don't call it here
  return <ClientFormButton action={action} />
}
```

### Cache profiles reference

| Profile      | Stale  | Revalidate | Expire  | Use for             |
| ------------ | ------ | ---------- | ------- | ------------------- |
| `'seconds'`  | ~0     | ~1s        | ~1min   | Real-time data      |
| `'minutes'`  | ~1min  | ~1min      | ~5min   | Fast-changing       |
| `'hours'`    | ~5min  | ~1hr       | ~1day   | Moderately updated  |
| `'days'`     | ~1hr   | ~1day      | ~1week  | Slowly updated      |
| `'weeks'`    | ~1day  | ~1week     | ~1month | Rarely updated      |
| `'max'`      | ~1day  | ~1week     | ~1year  | Almost static       |
| `'static'`   | 7 days | 1 day      | 30 days | Custom (see config) |
| `'standard'` | 1 min  | 5 min      | 1 hour  | Custom (see config) |
| `'live'`     | 10 sec | 30 sec     | 1 min   | Custom (see config) |

### Caching data functions

```ts
// src/lib/data/[feature].ts
import { cacheLife, cacheTag } from "next/cache";

// Public listing — safe to cache, same for all users
export async function getPublicProfile(entityId: string) {
  "use cache";
  cacheLife("standard");
  cacheTag(`profile-${entityId}`);

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, entityId))
    .limit(1);

  return profile ?? null;
}

// SEO/listing pages — cache aggressively
export async function getItemsByCategory(category: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`items-category-${category}`);

  return db
    .select()
    .from(items)
    .where(eq(items.category, category));
}

// Layout data — cache so layout doesn't hit DB on every navigation
export async function getUserLayoutData(userId: string) {
  "use cache";
  cacheLife("standard");
  cacheTag(`user-layout-${userId}`);

  return db
    .select({
      id: users.id,
      name: users.name,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
}

// NEVER cache these — always dynamic:
export async function getActiveStatus(entityId: string) {
  // No "use cache" — status changes constantly
  return db.select().from(items).where(eq(items.id, entityId)).limit(1);
}

export async function getUnreadCount(userId: string) {
  // No "use cache" — must always be fresh
  return db
    .select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(
      and(eq(notifications.userId, userId), eq(notifications.isRead, false))
    );
}
```

### Mixing cached and dynamic content (PPR)

```tsx
import { Suspense } from "react";

export default async function Dashboard() {
  const user = await getRequiredUser();

  return (
    <div>
      {/* CACHED — loads from static shell instantly, same for everyone */}
      <Suspense fallback={<StaticSectionSkeleton />}>
        <CachedStaticSection />
      </Suspense>

      {/* DYNAMIC — streams in, user-specific */}
      <Suspense fallback={<DataSectionSkeleton />}>
        <UserDataSection userId={user.id} />
      </Suspense>
    </div>
  );
}

async function CachedStaticSection() {
  "use cache";
  cacheLife("max");
  cacheTag("static-section");
  return <StaticUI />; // no DB call — pure static content
}

async function UserDataSection({ userId }: { userId: string }) {
  // No cache — always fresh
  const data = await db
    .select()
    .from(items)
    .where(eq(items.userId, userId));
  return <DataList items={data} />;
}
```

### Cache invalidation after mutations

```ts
// updateTag() — use after Server Actions triggered by users
// User sees their own change immediately (read-your-writes)
export async function updateProfile(userId: string, data: UpdateInput) {
  "use server";
  const user = await getRequiredUser();
  await db.update(profiles).set(data).where(eq(profiles.id, userId));

  updateTag(`profile-${userId}`);
  updateTag(`user-layout-${userId}`);
}

// revalidateTag() — use in background jobs, webhooks, admin actions
// SWR: old content served until revalidation completes
export async function webhookHandler(event: ExternalEvent) {
  const entityId = event.data.object.metadata.entityId;
  revalidateTag(`profile-${entityId}`, "max"); // background — SWR ok
}
```

**Rule: `updateTag` = user-initiated mutations. `revalidateTag` = background jobs, webhooks, admin.**

---

## 5. THE ACTIVITY COMPONENT BUG — READ THIS

This is the most dangerous gotcha in Next.js 16 with `cacheComponents: true`. It has broken many real apps.

**What happens:** When `cacheComponents: true` is enabled, Next.js wraps routes with React's `<Activity>` component. This means when you navigate away from a page, the previous page is NOT unmounted — it's hidden with `display: none`. When you navigate back, it's shown again with its state intact. Components do not remount.

**Why this breaks things:**

```tsx
// ❌ This breaks with cacheComponents: true

// User visits /checkout, pays, sees Success message
// User navigates to /shop
// User comes back to /checkout
// BUG: User sees old Success message because component never unmounted
function CheckoutPage() {
  const [step, setStep] = useState<"form" | "success">("form");

  return step === "success" ? (
    <SuccessMessage /> // Still showing — component was never reset
  ) : (
    <CheckoutForm onSuccess={() => setStep("success")} />
  );
}

// ❌ Forms with the same field names appear twice in DOM simultaneously
// (Playwright strict mode fails because getByLabel("Email") matches 2 elements)
// Login page and Signup page both have Email + Password fields
// Both are in the DOM at the same time when navigating between them
```

**Real bugs confirmed from GitHub issues:**

- Dropdowns stay open after navigation
- Dialogs show stale state on return visit
- Forms with same field names create duplicate DOM elements
- State set from URL params (`?newEntry=true`) persists after the param is gone
- E2E tests fail because hidden routes are still in the DOM

**The fixes:**

```tsx
// Fix 1 — Reset state on pathname change using usePathname
"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function MyPage() {
  const pathname = usePathname();
  const [step, setStep] = useState<"form" | "success">("form");

  // Reset when returning to this route
  useEffect(() => {
    setStep("form");
  }, [pathname]);

  return step === "success" ? <SuccessMessage /> : <MyForm />;
}

// Fix 2 — Use key prop to force full remount
// Parent passes pathname as key, forcing fresh mount every navigation
function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <div key={pathname}>{children}</div>;
}

// Fix 3 — Use URL state instead of local state for important UI state
// URL state survives remounts naturally and is always in sync
"use client";
import { useSearchParams, useRouter } from "next/navigation";

function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const step = searchParams.get("step") ?? "form";

  function handleSuccess() {
    router.replace("/checkout?step=success");
  }

  return step === "success" ? (
    <SuccessMessage />
  ) : (
    <CheckoutForm onSuccess={handleSuccess} />
  );
}
```

**Which fix to use:**

- Forms and checkout flows → Fix 2 (key prop forces full remount)
- Dialog/modal state that depends on URL params → Fix 1 or Fix 3
- Simple UI state (dropdowns, accordions) → Fix 1
- Auth forms (login/signup) → Fix 2, also give fields unique `id` attributes per page

**If the Activity bugs are causing too many problems:** You can disable `cacheComponents` and use `"use cache"` without it, but you lose PPR benefits. The `"use cache"` directive itself works independently.

---

## 6. SERVER COMPONENTS VS CLIENT COMPONENTS

### Decision rule — one question

**"Does it need to run in the browser?"**

- Has `onClick`, `onChange`, event handlers → Client
- Has `useState`, `useReducer`, `useEffect` → Client
- Uses browser APIs (`window`, `localStorage`, `navigator`) → Client
- Subscribes to Supabase Realtime → Client
- Fetches data from DB → Server
- Reads cookies or session → Server
- Has no interactivity — just displays data → Server

### Push `'use client'` as low as possible

```tsx
// ❌ Entire page is client because of one interactive element
"use client";
export default function DataPage() {
  const items = useItems(); // now needs useEffect + fetch instead of direct DB
  const [filter, setFilter] = useState("all");
  return (
    <div>
      <FilterBar filter={filter} onChange={setFilter} /> {/* only this needs client */}
      <ItemList items={items} filter={filter} />
    </div>
  );
}

// ✅ Only the interactive part is client
// page.tsx — Server Component
export default async function DataPage() {
  const user = await getRequiredUser();
  const items = await getItems(user.id); // direct DB call

  return (
    <div>
      <ItemListWithFilter items={items} /> {/* Client Component with filter state */}
    </div>
  );
}

// item-list-with-filter.tsx
"use client";
export function ItemListWithFilter({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState("all");
  const filtered = items.filter((i) => filter === "all" || i.status === filter);

  return (
    <div>
      <FilterBar filter={filter} onChange={setFilter} />
      {filtered.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

---

## 7. SERVER ACTIONS — THE CORRECT PATTERN

### File structure

All Server Actions go in `src/lib/actions/`. The `'use server'` at the top of the file makes every export in that file a Server Action — you don't add it per-function.

### The five rules — always in this order

```ts
// src/lib/actions/[feature].ts
"use server"; // file-level directive

import { z } from "zod";
import { db } from "@/lib/db";
import { getRequiredUser } from "@/lib/auth/session";
import { updateTag } from "next/cache";

const UpdateSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
  note: z.string().optional(),
});

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export async function updateItemStatus(
  itemId: string,
  formData: FormData
): Promise<ActionResult> {
  // Rule 1: Auth first, always
  const user = await getRequiredUser();

  // Rule 2: Validate input with Zod — never trust client data
  const parsed = UpdateSchema.safeParse({
    status: formData.get("status"),
    note: formData.get("note"),
  });
  if (!parsed.success) return { success: false, error: "Invalid input" };

  // Rule 3: Authorization — does this user own this resource?
  const [item] = await db.select().from(items).where(eq(items.id, itemId)).limit(1);
  if (!item) return { success: false, error: "Not found" };
  if (item.userId !== user.id) return { success: false, error: "Not authorized" };

  // Rule 4: Business logic validation — is this transition valid?
  if (parsed.data.status === "INACTIVE" && item.status !== "ACTIVE") {
    return { success: false, error: "Item must be active to deactivate" };
  }

  // Rule 5: DB mutation
  await db
    .update(items)
    .set({ status: parsed.data.status, updatedAt: new Date() })
    .where(eq(items.id, itemId));

  // Rule 6: Invalidate exactly the caches this mutation affects
  updateTag(`item-${itemId}`);
  updateTag(`user-items-${user.id}`);

  return { success: true };
}
```

### Using actions in Client Components

```tsx
"use client";
import { useTransition } from "react";
import { updateItemStatus } from "@/lib/actions/[feature]";
import { toast } from "sonner";

export function ActionButton({ itemId }: { itemId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateItemStatus(itemId, formData);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Updated!");
    });
  }

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="status" value="INACTIVE" />
      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Deactivate"}
      </button>
    </form>
  );
}
```

### redirect() inside Server Actions — the try/catch trap

```ts
// ❌ BROKEN — redirect() throws internally, try/catch swallows it
export async function loginAction(formData: FormData) {
  "use server";
  try {
    await signIn(formData);
    redirect("/dashboard"); // this throw is caught below and silently swallowed
  } catch (error) {
    return { error: "Login failed" }; // redirect never happens
  }
}

// ✅ CORRECT — redirect() must be called OUTSIDE try/catch
export async function loginAction(formData: FormData) {
  "use server";
  let destination: string | null = null;

  try {
    await signIn(formData);
    destination = "/dashboard";
  } catch (error) {
    return { error: "Login failed" };
  }

  if (destination) redirect(destination); // outside try/catch — works correctly
}
```

---

## 8. DATA FETCHING PATTERNS

### Always parallel — never sequential

```tsx
// ❌ Sequential — total time = sum of all three
async function Dashboard({ userId }: { userId: string }) {
  const data1 = await getDataA(userId); // 120ms
  const data2 = await getDataB(userId); // 80ms — waits for data1
  const data3 = await getDataC(userId); // 60ms — waits for data2
  // Total: 260ms
}

// ✅ Parallel — total time = slowest one
async function Dashboard({ userId }: { userId: string }) {
  const [data1, data2, data3] = await Promise.all([
    getDataA(userId),
    getDataB(userId),
    getDataC(userId),
  ]);
  // Total: 120ms
}
```

### Suspense streaming for independent sections

```tsx
export default async function Dashboard() {
  const user = await getRequiredUser();

  return (
    <div>
      {/* This renders immediately — no DB call */}
      <WelcomeHeader name={user.name} />

      {/* These stream in independently — don't block each other */}
      <Suspense fallback={<SectionASkeleton />}>
        <SectionA userId={user.id} />
      </Suspense>

      <Suspense fallback={<SectionBSkeleton />}>
        <SectionB userId={user.id} />
      </Suspense>

      {/* Slow analytics — streams in last, doesn't block faster sections */}
      <Suspense fallback={<AnalyticsSkeleton />}>
        <Analytics userId={user.id} />
      </Suspense>
    </div>
  );
}
```

### When to use Route Handlers (API routes)

Only create `route.ts` files for:

- Stripe/webhook endpoints (external service POSTing to you)
- File downloads/signed URL generation
- SSE (Server-Sent Events) streams
- Any external service that can't call a Server Action

**Never create Route Handlers just to fetch data for your own pages.** Server Components query the DB directly.

---

## 9. ASYNC PARAMS AND SEARCHPARAMS — ALWAYS AWAIT

In Next.js 16, `params` and `searchParams` are always Promises. No exceptions. AI consistently forgets this.

```tsx
// ❌ Will throw in Next.js 16
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params; // TypeError: params is a Promise
}

// ✅ Server Component
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getItem(id);
  return <ItemView item={item} />;
}

// ✅ Client Component — use React.use()
"use client";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // React.use() unwraps the Promise
  return <div>{id}</div>;
}

// ✅ searchParams — same pattern
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "1" } = await searchParams;
  const results = await search(q, parseInt(page));
  return <Results results={results} />;
}
```

---

## 10. ASYNC COOKIES AND HEADERS

```ts
// ❌ Sync — removed in Next.js 16
import { cookies, headers } from "next/headers";
const token = cookies().get("token"); // TypeError
const ua = headers().get("user-agent"); // TypeError

// ✅ Always await
const cookieStore = await cookies();
const token = cookieStore.get("token");

const headersList = await headers();
const ua = headersList.get("user-agent");
```

---

## 11. ENVIRONMENT VARIABLES AT RUNTIME

If you need to read an env var at request time (not at build time), use `connection()` first:

```ts
import { connection } from "next/server";

export default async function Page() {
  // connection() tells Next.js this page is dynamic
  // Without this, process.env reads can be inlined at build time
  await connection();

  const featureFlag = process.env.ENABLE_FEATURE_X;
  return <div>{featureFlag}</div>;
}
```

---

## 12. REAL-TIME WITH SUPABASE

Always client-side. Never attempt Supabase Realtime in a Server Component.

```tsx
// Pattern: Server Component provides initial data, Client Component adds real-time

// Server Component
async function LiveFeed({ entityId }: { entityId: string }) {
  const initialData = await db
    .select()
    .from(updates)
    .where(eq(updates.entityId, entityId))
    .orderBy(asc(updates.createdAt));

  // Pass initial data — avoids loading state on first render
  return <LiveFeedClient entityId={entityId} initialData={initialData} />;
}

// Client Component adds Realtime on top
"use client";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function LiveFeedClient({
  entityId,
  initialData,
}: {
  entityId: string;
  initialData: Update[];
}) {
  const [items, setItems] = useState(initialData); // start with server data

  useEffect(() => {
    const supabase = createClient(); // create inside effect, not at component level

    const channel = supabase
      .channel(`feed-${entityId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "updates",
          filter: `entity_id=eq.${entityId}`,
        },
        (payload) => {
          setItems((prev) => [...prev, payload.new as Update]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }; // always cleanup
  }, [entityId]); // entityId as dep — NOT supabase client

  return <FeedList items={items} />;
}
```

---

## 13. LOADING.TSX AND ERROR.TSX — WHEN TO USE EACH

```
loading.tsx — shows while the page's async Server Component is streaming in
error.tsx   — catches uncaught errors in the segment, shows fallback UI

Use loading.tsx when: the page itself is slow (not sub-components)
Use Suspense when:    individual sections within a page are slow
Use error.tsx:        at route segment level to catch DB errors, not-found, etc.
```

```tsx
// app/(app)/items/loading.tsx
export default function ItemsLoading() {
  return <ItemsPageSkeleton />;
}

// app/(app)/items/error.tsx
"use client"; // error.tsx MUST be a Client Component
export default function ItemsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <p>Failed to load: {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## 14. PERFORMANCE CHECKLIST

Before shipping any page, verify:

**Rendering**

- [ ] Page is a Server Component unless it genuinely needs browser APIs
- [ ] `'use client'` boundary is at the leaf level — not wrapping the whole page
- [ ] Slow data sections are wrapped in `<Suspense>` with skeleton fallbacks
- [ ] Multiple DB calls use `Promise.all()` — no sequential awaits

**Caching**

- [ ] Cacheable functions have `"use cache"` + `cacheLife()` + `cacheTag()`
- [ ] No `cookies()` or `headers()` called inside a cached function
- [ ] User-specific cached data uses userId in the cache tag
- [ ] Frequently-changing data (statuses, counts) is NOT cached
- [ ] Server Actions call `updateTag()` for every tag they affect

**Auth**

- [ ] Route group layout calls `getRequiredUser()` with the right role
- [ ] Page files don't re-implement auth logic
- [ ] Server Actions start with `getRequiredUser()` as line 1
- [ ] Server Actions check resource ownership before mutating

**Activity Component (with cacheComponents: true)**

- [ ] Forms that must reset on navigation use `key={pathname}` or `useEffect` reset
- [ ] Dialog/modal state derived from URL params uses URL state, not local state
- [ ] Auth forms (login/signup) have unique field IDs to avoid DOM duplication
- [ ] Checkout/multi-step flows handle "stale success state" on return navigation

**Async APIs**

- [ ] `params` is typed as `Promise<{...}>` and awaited
- [ ] `searchParams` is typed as `Promise<{...}>` and awaited
- [ ] `cookies()` is awaited before accessing values
- [ ] `headers()` is awaited before accessing values

---

## 15. WHAT AI GETS WRONG — QUICK REFERENCE

These are the specific patterns AI models produce that are wrong in Next.js 16. Correct them immediately when you see them.

| AI writes this                                 | What's wrong                     | Use this instead                                    |
| ---------------------------------------------- | -------------------------------- | --------------------------------------------------- |
| `middleware.ts`                                | Deprecated in v16                | `proxy.ts` with `export function proxy()`           |
| `export default function middleware()`         | Wrong export name                | `export function proxy()`                           |
| `unstable_cache(fn, keys, opts)`               | Old pattern                      | `"use cache"` directive                             |
| `fetch(url, { cache: 'force-cache' })`         | Old caching model                | `"use cache"` directive                             |
| `export const revalidate = 60`                 | Route segment config for caching | `"use cache"` + `cacheLife()`                       |
| `export const dynamic = 'force-dynamic'`       | Old opt-out pattern              | Remove it — everything is dynamic by default in v16 |
| `experimental: { ppr: true }`                 | Removed in v16                   | `cacheComponents: true`                             |
| `params.id` (sync)                             | TypeError in v16                 | `const { id } = await params`                       |
| `cookies().get('token')` (sync)                | TypeError in v16                 | `const c = await cookies(); c.get('token')`         |
| `revalidateTag('tag')` in Server Action        | Deprecated form                  | `updateTag('tag')` in Server Actions                |
| `router.refresh()` inside Server Action        | Can't use router on server       | `updateTag()` or `refresh()` from `next/cache`      |
| `try { redirect('/x') } catch {}`             | Redirect swallowed               | Move `redirect()` outside try/catch                 |
| Creating `api/data/route.ts` to fetch own data | Unnecessary round-trip           | Query DB directly in Server Component               |
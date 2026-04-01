## Sanity → Next.js revalidation webhook setup

This project uses **tag-based cache revalidation** with a **single generic tag**: `content`.  
Sanity webhooks call the Next.js route `/api/revalidate` with `{ "tag": "content" }`, and Next.js calls `revalidateTag("content")` to clear cached data.

Use this guide to configure webhooks in the Sanity dashboard (the screen shown in your screenshot) **and** optionally a dispatcher function that can fan-out revalidation to multiple websites.

---

### 1. Prerequisites (Next.js side)

1. Make sure the route exists in your app:
   - `app/api/revalidate/route.ts` (already implemented in this project).

2. Set this environment variable in your Next.js deployment:

```bash
REVALIDATE_SECRET=your-long-random-string
```

3. Deploy your app so that `https://YOUR_DOMAIN.com/api/revalidate?secret=REVALIDATE_SECRET` is reachable.

---

### 2. Open the webhook screen in Sanity

1. Go to `https://www.sanity.io/manage`.
2. Select your **project**.
3. In the top navigation, click **API**.
4. Click **Webhooks**.
5. Click **Create a new webhook**.  
   This is the screen shown in the attached screenshot.

Because we use a single tag, you usually only need **one webhook** per Sanity project.

---

### 3. Common webhook settings

For *every* webhook you create:

- **Name**: choose something clear, e.g.:
  - `Revalidate Home`
  - `Revalidate Case Studies`
  - `Revalidate Blog`

- **URL**:

```text
https://YOUR_DOMAIN.com/api/revalidate?secret=REVALIDATE_SECRET
```

Replace:

- `YOUR_DOMAIN.com` with your site domain.
- `REVALIDATE_SECRET` with the same value you set in your Next.js env.

- **Dataset**: usually leave as “all datasets” (unless you have a special multi‑dataset setup).
- **Trigger on**:
  - Check at least: **Create**, **Update**.
  - Optional: **Delete** if you want removals to trigger revalidation too.
- **Status**: leave **Enable webhook** checked.
- **HTTP method**: `POST`.
- **Content type / HTTP headers**: set `Content-Type` to `application/json` if there’s an option; otherwise Sanity will include the correct header automatically.
- **API version**: leave the default (e.g. `v2021-03-25`).
- **Drafts**:
  - Leave **“Trigger webhook when drafts are modified”** **unchecked** for production (you only want published content).
- **Versions**:
  - You can usually leave the versions option **unchecked** unless you have a specific reason.
- **Secret** (in the Sanity UI footer):
  - You can leave this **empty**; we already validate the secret via the query parameter.

The important bits are the **URL**, **Filter**, and **Body template** (projection).

---

### 4. Single-webhook setup with the `content` tag

Because all queries in this project include `"content"` in their tag arrays, a single `revalidateTag("content")` is enough to refresh all cached Sanity data.

#### A. One webhook for all relevant content

- **Name**: `Revalidate Content`
- **Filter** (left “Filter” box):

```groq
_type in [
  "homePage",
  "caseStudy",
  "brandingSolution",
  "digitalProductSolution",
  "blogPost",
  "blogCategory",
  "settings",
  "navbar"
]
```

Adjust the list of `_type` values to match your schemas.

- **Projection / Body template** (right “Projection” box):

```groq
{ "tag": "content" }
```

This causes Sanity to send:

```json
{ "tag": "content" }
```

to `/api/revalidate`, which calls `revalidateTag("content")`.

---

### 5. Optional: Dispatcher function for multiple websites

If the **same Sanity project** powers **multiple websites** (for example, different Next.js deployments like `live.figmenta.com`, `studio.figmenta.com`, `production.figmenta.com`, `figmenta.com`) and you want to stay within the free-plan limit of **2 webhooks**, you can put a tiny “dispatcher” in front of your sites:

- Sanity calls **one** dispatcher URL.
- The dispatcher forwards the same `{ "tag": "content" }` to each website’s `/api/revalidate` endpoint.

#### A. Dispatcher route example (Next.js App Router)

Create a new small Next.js project (or reuse an existing infrastructure project) and add:

```ts
// /api/sanity-webhook/route.ts in the dispatcher project
import { NextRequest, NextResponse } from "next/server";

const TARGETS = [
  {
    url: "https://live.figmenta.com/api/revalidate",
    secretEnv: "REVALIDATE_SECRET_LIVE",
  },
  {
    url: "https://studio.figmenta.com/api/revalidate",
    secretEnv: "REVALIDATE_SECRET_STUDIO",
  },
  {
    url: "https://production.figmenta.com/api/revalidate",
    secretEnv: "REVALIDATE_SECRET_PROD",
  },
  {
    url: "https://figmenta.com/api/revalidate",
    secretEnv: "REVALIDATE_SECRET_MAIN",
  },
];

export async function POST(req: NextRequest) {
  try {
    const dispatcherSecret = process.env.SANITY_WEBHOOK_SECRET;
    const incomingSecret = req.nextUrl.searchParams.get("secret");
    if (dispatcherSecret && incomingSecret !== dispatcherSecret) {
      return NextResponse.json({ message: "Invalid dispatcher secret" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body.tag !== "string" || !body.tag.trim()) {
      return NextResponse.json(
        { message: "Missing or invalid `tag` in body" },
        { status: 400 }
      );
    }

    const tag = body.tag.trim();

    await Promise.all(
      TARGETS.map(async (target) => {
        const secret = process.env[target.secretEnv as keyof NodeJS.ProcessEnv];
        if (!secret) return;

        try {
          await fetch(`${target.url}?secret=${encodeURIComponent(secret)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tag }),
          });
        } catch (err) {
          console.error("Error calling target", target.url, err);
        }
      })
    );

    return NextResponse.json({ ok: true, tag }, { status: 200 });
  } catch (error: any) {
    console.error("Error in dispatcher:", error);
    return NextResponse.json(
      { message: "Dispatcher error", error: error.message },
      { status: 500 }
    );
  }
}
```

Environment variables for the dispatcher project:

```bash
SANITY_WEBHOOK_SECRET=DISPATCHER_SECRET_FROM_SANITY

REVALIDATE_SECRET_LIVE=LIVE_SECRET
REVALIDATE_SECRET_STUDIO=STUDIO_SECRET
REVALIDATE_SECRET_PROD=PROD_SECRET
REVALIDATE_SECRET_MAIN=MAIN_SECRET
```

Each individual website must expose `/api/revalidate` and check its own `REVALIDATE_SECRET` as described earlier.

#### B. Configure the Sanity webhook to point at the dispatcher

In the Sanity Webhook screen:

- **URL**:

```text
https://your-dispatcher-domain.com/api/sanity-webhook?secret=DISPATCHER_SECRET_FROM_SANITY
```

- **Filter**: same as in section 4 (all relevant `_type` values).
- **Projection**:

```groq
{ "tag": "content" }
```

Now Sanity sends a single webhook to the dispatcher, which forwards it to all sites.

---

### 6. Testing the webhook

1. After creating a webhook, click **Save** in the Sanity UI.
2. In Sanity Studio, open a document of the type you configured (e.g. a `caseStudy`).
3. Make a small change and click **Publish**.
4. Return to **API → Webhooks** in the Sanity dashboard:
   - Open the webhook.
   - Scroll to the **Recent deliveries** section and verify the last call:
     - Status should be **200**.
     - The request body should look like `{ "tag": "…" }`.
5. On your site(s), open a page that depends on that content:
   - After the first request following revalidation, it should show the new data.

Once these webhooks are in place, Sanity content is fetched once and cached indefinitely in Next.js, and the cache is only cleared when Sanity publishes updates via these webhooks (or via the dispatcher, if you use it).


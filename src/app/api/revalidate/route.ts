import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const secretFromEnv = process.env.REVALIDATE_SECRET;
    const secretFromQuery = req.nextUrl.searchParams.get("secret");

    if (secretFromEnv && secretFromQuery !== secretFromEnv) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body.tag !== "string" || !body.tag.trim()) {
      return NextResponse.json(
        { message: "Missing or invalid `tag` in request body" },
        { status: 400 }
      );
    }

    const tag = body.tag.trim();

    // Profile `sanity` matches next.config.ts `cacheLife.sanity` — long cache between webhooks
    revalidateTag(tag, "sanity");

    return NextResponse.json({ revalidated: true, tag }, { status: 200 });
  } catch (error) {
    console.error("Error handling revalidate webhook:", error);
    return NextResponse.json(
      { message: "Error revalidating", error: (error as Error).message },
      { status: 500 }
    );
  }
}


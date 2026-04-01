import { revalidateTargets } from "@/constant/variabls";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Protect the dispatcher itself
    const dispatcherSecret = process.env.SANITY_WEBHOOK_SECRET;
    const incomingSecret = req.nextUrl.searchParams.get("secret");

    if (dispatcherSecret && incomingSecret !== dispatcherSecret) {
      return NextResponse.json(
        { message: "Invalid dispatcher secret" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body.tag !== "string" || !body.tag.trim()) {
      return NextResponse.json(
        { message: "Missing or invalid `tag` in body" },
        { status: 400 }
      );
    }

    const tag = body.tag.trim();

    // Fan-out the revalidate request to all configured targets
    await Promise.all(
      revalidateTargets.map(
        async (target: { url: string; secretEnv: string }) => {
          const secret =
            process.env[target.secretEnv as keyof NodeJS.ProcessEnv];
          if (!secret) {
            console.warn(
              `[sanity-webhook] Skipping ${target.url} because ${target.secretEnv} is not set`
            );
            return;
          }

          try {
            await fetch(`${target.url}?secret=${encodeURIComponent(secret)}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tag }),
            });
          } catch (err) {
            console.error(
              "[sanity-webhook] Error calling target",
              target.url,
              err
            );
          }
        }
      )
    );

    return NextResponse.json({ ok: true, tag }, { status: 200 });
  } catch (error: any) {
    console.error("[sanity-webhook] Dispatcher error:", error);
    return NextResponse.json(
      { message: "Dispatcher error", error: error.message },
      { status: 500 }
    );
  }
}

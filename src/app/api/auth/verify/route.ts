import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = process.env.DAODEGEN_API_URL || "https://daodegen.com";

export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    if (text.length > 4096) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (typeof body.message !== "string" || typeof body.signature !== "string") {
      return NextResponse.json({ error: "Missing message or signature" }, { status: 400 });
    }

    const res = await fetch(`${UPSTREAM}/api/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: body.message, signature: body.signature }),
      signal: AbortSignal.timeout(10_000),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[auth/verify proxy]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Service unavailable" },
      { status: 502 },
    );
  }
}

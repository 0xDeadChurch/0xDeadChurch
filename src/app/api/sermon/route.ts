import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = process.env.DAODEGEN_API_URL || "https://daodegen.com";

const MAX_BODY_SIZE = 8192; // 8KB max for sermon requests

export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_SIZE) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Validate required fields and types
    if (typeof body.prayer_tx !== "string" || !/^0x[a-fA-F0-9]{64}$/.test(body.prayer_tx)) {
      return NextResponse.json({ error: "Invalid prayer_tx" }, { status: 400 });
    }
    if (typeof body.sender !== "string" || !/^0x[a-fA-F0-9]{40}$/.test(body.sender)) {
      return NextResponse.json({ error: "Invalid sender" }, { status: 400 });
    }
    if (typeof body.message !== "string" || body.message.length > 1024) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }
    if (body.burn_amount !== undefined && (typeof body.burn_amount !== "string" || !/^\d+(\.\d+)?$/.test(body.burn_amount))) {
      return NextResponse.json({ error: "Invalid burn_amount" }, { status: 400 });
    }

    const authHeader = req.headers.get("Authorization") || "";

    const res = await fetch(`${UPSTREAM}/v1/sermon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30_000),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[sermon proxy]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Service unavailable" },
      { status: 502 },
    );
  }
}

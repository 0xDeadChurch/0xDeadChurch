import { NextResponse } from "next/server";

const UPSTREAM = process.env.DAODEGEN_API_URL || "https://daodegen.com";

export async function GET() {
  try {
    const res = await fetch(`${UPSTREAM}/api/auth/nonce`, {
      signal: AbortSignal.timeout(10_000),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[auth/nonce proxy]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Service unavailable" },
      { status: 502 },
    );
  }
}

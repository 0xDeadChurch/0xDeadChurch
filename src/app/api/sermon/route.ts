import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = process.env.DAODEGEN_API_URL || "https://daodegen.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("Authorization") || "";

    const res = await fetch(`${UPSTREAM}/v1/sermon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30_000), // sermons can take a while (LLM)
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Service unavailable" },
      { status: 502 },
    );
  }
}

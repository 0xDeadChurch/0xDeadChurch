import { NextResponse } from "next/server";

const UPSTREAM = process.env.DAODEGEN_API_URL || "https://daodegen.com";

export async function GET() {
  try {
    const res = await fetch(`${UPSTREAM}/v1/congregation/state`, {
      signal: AbortSignal.timeout(10_000),
      next: { revalidate: 30 },
    });
    const data = await res.json();
    return NextResponse.json(data, {
      status: res.status,
      headers: {
        "Cache-Control": "public, max-age=30, s-maxage=30",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Service unavailable" },
      { status: 502 },
    );
  }
}

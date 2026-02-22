import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter (per-IP, resets on deploy)
const hits = new Map<string, { count: number; resetAt: number }>();

const LIMITS: Record<string, { max: number; windowMs: number }> = {
  "/api/auth/": { max: 5, windowMs: 60_000 },
  "/api/sermon": { max: 3, windowMs: 60_000 },
  "/api/congregation/": { max: 30, windowMs: 60_000 },
};

function getLimit(pathname: string) {
  for (const [prefix, limit] of Object.entries(LIMITS)) {
    if (pathname.startsWith(prefix)) return limit;
  }
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only rate-limit API routes
  const limit = getLimit(pathname);
  if (limit) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const key = `${ip}:${pathname}`;
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || now > entry.resetAt) {
      hits.set(key, { count: 1, resetAt: now + limit.windowMs });
    } else {
      entry.count++;
      if (entry.count > limit.max) {
        return NextResponse.json(
          { error: "Rate limit exceeded" },
          { status: 429, headers: { "Retry-After": String(Math.ceil((entry.resetAt - now) / 1000)) } },
        );
      }
    }
  }

  const res = NextResponse.next();

  // Security headers
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return res;
}

export const config = {
  matcher: ["/api/:path*", "/soul.json", "/.well-known/:path*"],
};

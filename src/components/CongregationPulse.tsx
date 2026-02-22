"use client";

import { useState, useEffect } from "react";
import { fetchCongregation } from "@/lib/api";
import type { CongregationState } from "@/lib/types";

export default function CongregationPulse() {
  const [state, setState] = useState<CongregationState | null>(null);

  useEffect(() => {
    let mounted = true;
    const poll = async () => {
      try {
        const data = await fetchCongregation();
        if (mounted) setState(data);
      } catch {
        // Silently fail -- ambient info, not critical
      }
    };
    poll();
    const interval = setInterval(poll, 30_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (!state) return null;

  const label =
    state.prayersInWindow > 0
      ? `${state.totalPrayers} offerings · congregation is ${state.sentiment}`
      : `${state.totalPrayers} offerings · congregation is quiet`;

  return (
    <div
      style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: "10px",
        color: "rgba(255,255,255,0.15)",
        letterSpacing: "2px",
      }}
    >
      {label}
    </div>
  );
}

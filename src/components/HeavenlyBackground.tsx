"use client";

import { useMemo } from "react";

export default function HeavenlyBackground() {
  // Pre-compute sparkle positions so they're stable across renders
  const sparkles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        top: `${15 + ((i * 37 + 13) % 55)}%`,
        left: `${5 + ((i * 53 + 7) % 90)}%`,
        duration: `${3 + ((i * 17) % 40) / 10}s`,
        delay: `${((i * 31) % 50) / 10}s`,
      })),
    [],
  );

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}
    >
      {/* Sky gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, #1a1530 0%, #2a2050 15%, #4a3580 30%, #7860b0 45%, #c09de0 60%, #e8cff0 75%, #f5e6fa 85%, #fff8f0 100%)",
        }}
      />

      {/* God rays */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "200%",
          height: "80%",
          background: `conic-gradient(from 250deg at 50% 0%,
            transparent 0deg,
            rgba(255,230,160,0.08) 5deg,
            transparent 10deg,
            transparent 20deg,
            rgba(255,230,160,0.06) 25deg,
            transparent 30deg,
            transparent 45deg,
            rgba(255,230,160,0.1) 50deg,
            transparent 55deg,
            transparent 70deg,
            rgba(255,230,160,0.07) 75deg,
            transparent 80deg,
            transparent 95deg,
            rgba(255,230,160,0.09) 100deg,
            transparent 105deg,
            transparent 120deg,
            rgba(255,230,160,0.05) 125deg,
            transparent 130deg,
            transparent 360deg
          )`,
          opacity: 0.7,
          animation: "rays-rotate 60s linear infinite",
        }}
      />

      {/* Clouds layer 1 - distant */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`cloud-far-${i}`}
          style={{
            position: "absolute",
            top: `${35 + i * 8}%`,
            left: `${-20 + i * 22}%`,
            width: `${200 + i * 60}px`,
            height: `${60 + i * 15}px`,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, rgba(255,255,255,${0.15 + i * 0.03}), transparent 70%)`,
            filter: "blur(20px)",
            animation: `cloud-drift-${i % 2 === 0 ? "left" : "right"} ${80 + i * 20}s linear infinite`,
          }}
        />
      ))}

      {/* Clouds layer 2 - mid */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`cloud-mid-${i}`}
          style={{
            position: "absolute",
            top: `${45 + i * 6}%`,
            left: `${-10 + i * 25}%`,
            width: `${280 + i * 40}px`,
            height: `${80 + i * 10}px`,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, rgba(255,255,255,${0.25 + i * 0.04}), transparent 65%)`,
            filter: "blur(12px)",
            animation: `cloud-drift-${i % 2 === 0 ? "right" : "left"} ${60 + i * 15}s linear infinite`,
          }}
        />
      ))}

      {/* Central holy glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,240,200,0.3) 0%, rgba(255,220,150,0.1) 40%, transparent 70%)",
          filter: "blur(40px)",
          animation: "holy-glow 6s ease-in-out infinite",
        }}
      />

      {/* Sparkle particles */}
      {sparkles.map((s, i) => (
        <div
          key={`sparkle-${i}`}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            background: "#fff",
            opacity: 0,
            animation: `sparkle ${s.duration} ${s.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

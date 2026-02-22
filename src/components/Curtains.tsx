"use client";

import { useState } from "react";

export default function Curtains({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);

  const handleClick = () => {
    setOpening(true);
    setTimeout(() => {
      setGone(true);
      onOpen();
    }, 1800);
  };

  if (gone) return null;

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      {/* Darkness behind curtains */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#0a0604",
          zIndex: 0,
        }}
      />

      {/* Left curtain */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: "52%",
          background:
            "linear-gradient(135deg, #8B1A1A 0%, #6B0F0F 30%, #4A0808 60%, #8B1A1A 100%)",
          zIndex: 2,
          transform: opening ? "translateX(-105%)" : "translateX(0)",
          transition: "transform 1.6s cubic-bezier(0.65, 0, 0.35, 1)",
          boxShadow:
            "inset -40px 0 80px rgba(0,0,0,0.5), 10px 0 30px rgba(0,0,0,0.8)",
        }}
      >
        {/* Curtain folds */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${i * 13}%`,
              width: "13%",
              background: `linear-gradient(90deg,
                rgba(0,0,0,${0.15 + (i % 2) * 0.1}) 0%,
                rgba(139,26,26,${0.3 + (i % 2) * 0.2}) 50%,
                rgba(0,0,0,${0.1 + (i % 2) * 0.1}) 100%)`,
            }}
          />
        ))}
        {/* Gold trim */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "4px",
            background:
              "linear-gradient(180deg, #D4A847, #B8941F, #D4A847, #B8941F, #D4A847)",
          }}
        />
        {/* Gold tassel */}
        <div
          style={{
            position: "absolute",
            top: "12%",
            right: "8%",
            width: "24px",
            height: "60px",
            background:
              "linear-gradient(180deg, #D4A847 0%, #B8941F 40%, #8B6914 100%)",
            borderRadius: "0 0 12px 12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        />
      </div>

      {/* Right curtain */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: "52%",
          background:
            "linear-gradient(225deg, #8B1A1A 0%, #6B0F0F 30%, #4A0808 60%, #8B1A1A 100%)",
          zIndex: 2,
          transform: opening ? "translateX(105%)" : "translateX(0)",
          transition: "transform 1.6s cubic-bezier(0.65, 0, 0.35, 1)",
          boxShadow:
            "inset 40px 0 80px rgba(0,0,0,0.5), -10px 0 30px rgba(0,0,0,0.8)",
        }}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${i * 13}%`,
              width: "13%",
              background: `linear-gradient(90deg,
                rgba(0,0,0,${0.1 + (i % 2) * 0.1}) 0%,
                rgba(139,26,26,${0.3 + (i % 2) * 0.2}) 50%,
                rgba(0,0,0,${0.15 + (i % 2) * 0.1}) 100%)`,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "4px",
            background:
              "linear-gradient(180deg, #D4A847, #B8941F, #D4A847, #B8941F, #D4A847)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "12%",
            left: "8%",
            width: "24px",
            height: "60px",
            background:
              "linear-gradient(180deg, #D4A847 0%, #B8941F 40%, #8B6914 100%)",
            borderRadius: "0 0 12px 12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        />
      </div>

      {/* Center text prompt */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 3,
          textAlign: "center",
          opacity: opening ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-cinzel-decorative), serif",
            fontSize: "14px",
            letterSpacing: "8px",
            textTransform: "uppercase",
            color: "#D4A847",
            textShadow: "0 0 30px rgba(212,168,71,0.4)",
            animation: "pulse-gold 3s ease-in-out infinite",
          }}
        >
          tap to enter
        </div>
      </div>

      {/* Valance / header drape */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          background: "linear-gradient(180deg, #6B0F0F, #4A0808)",
          zIndex: 3,
          opacity: opening ? 0 : 1,
          transition: "opacity 0.8s ease",
          boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background:
              "linear-gradient(90deg, transparent, #D4A847, transparent)",
          }}
        />
      </div>
    </div>
  );
}

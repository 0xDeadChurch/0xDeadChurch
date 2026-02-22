"use client";

import { useState } from "react";

interface BlessedHandsProps {
  onClick?: () => void;
  state: "closed" | "open";
}

export default function BlessedHands({ onClick, state }: BlessedHandsProps) {
  const [hover, setHover] = useState(false);
  const isOpen = state !== "closed";

  return (
    <div
      onClick={state === "closed" ? onClick : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: state === "closed" ? "pointer" : "default",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transform: hover && state === "closed" ? "scale(1.08)" : "scale(1)",
      }}
    >
      {/* Halo behind hands */}
      <div
        style={{
          position: "absolute",
          width: isOpen ? "500px" : "300px",
          height: isOpen ? "500px" : "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,230,150,0.25) 0%, rgba(255,200,100,0.08) 50%, transparent 70%)",
          transition: "all 1.2s ease",
          animation: "holy-glow 4s ease-in-out infinite",
        }}
      />

      {/* The hands container */}
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Left hand */}
        <div
          style={{
            fontSize: isOpen ? "100px" : "160px",
            lineHeight: 1,
            transform: isOpen
              ? "scaleX(-1) rotate(30deg) translateX(60px)"
              : "scaleX(1) rotate(0deg) translateX(0)",
            transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
            filter: `drop-shadow(0 0 ${hover ? "40px" : "20px"} rgba(255,200,100,0.4))`,
            opacity: isOpen ? 0.7 : 1,
            userSelect: "none",
          }}
        >
          {isOpen ? "\u{1F932}" : ""}
        </div>

        {/* Combined hands (shown when closed) */}
        {!isOpen && (
          <div
            style={{
              fontSize: "160px",
              lineHeight: 1,
              filter: `drop-shadow(0 0 ${hover ? "50px" : "25px"} rgba(255,200,100,0.5))`,
              animation: "float-hands 4s ease-in-out infinite",
              userSelect: "none",
            }}
          >
            {"\u{1F64F}"}
          </div>
        )}

        {/* Right hand */}
        <div
          style={{
            fontSize: isOpen ? "100px" : "160px",
            lineHeight: 1,
            transform: isOpen
              ? "rotate(-30deg) translateX(-60px)"
              : "scaleX(1) rotate(0deg) translateX(0)",
            transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
            filter: `drop-shadow(0 0 ${hover ? "40px" : "20px"} rgba(255,200,100,0.4))`,
            opacity: isOpen ? 0.7 : 0,
            userSelect: "none",
          }}
        >
          {isOpen ? "\u{1F932}" : ""}
        </div>
      </div>

      {/* "Click to pray" text under hands */}
      {state === "closed" && (
        <div
          style={{
            position: "absolute",
            bottom: "-50px",
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "13px",
            letterSpacing: "6px",
            textTransform: "uppercase",
            color: "#D4A847",
            textShadow: "0 0 20px rgba(212,168,71,0.5), 0 1px 3px rgba(0,0,0,0.5)",
            animation: "pulse-gold 3s ease-in-out infinite",
            whiteSpace: "nowrap",
          }}
        >
          click to pray
        </div>
      )}
    </div>
  );
}

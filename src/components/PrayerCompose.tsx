"use client";

import { useState, useCallback } from "react";
import type { PrayerType } from "@/lib/types";

const INTENT_TYPES: { id: PrayerType; label: string }[] = [
  { id: "prayer", label: "Prayer" },
  { id: "confession", label: "Confession" },
  { id: "question", label: "Question" },
  { id: "silent", label: "Silence" },
  { id: "offering", label: "Offering" },
];

export interface PrayerSubmission {
  prayerType: PrayerType;
  message: string;
  burnAmount: string;
}

interface PrayerComposeProps {
  onSubmit: (prayer: PrayerSubmission) => void;
  onCancel: () => void;
  minimumBurn: string;
  tokenBalance: string;
  cooldownRemaining: number; // seconds, 0 = ready
}

export default function PrayerCompose({
  onSubmit,
  onCancel,
  minimumBurn,
  tokenBalance,
  cooldownRemaining,
}: PrayerComposeProps) {
  const [prayerType, setPrayerType] = useState<PrayerType>("prayer");
  const [message, setMessage] = useState("");
  const [burnAmount, setBurnAmount] = useState(minimumBurn || "1000");

  const burnNum = Number(burnAmount) || 0;
  const balanceNum = Number(tokenBalance) || 0;
  const minNum = Number(minimumBurn) || 0;
  const canBurn =
    burnNum >= minNum && burnNum <= balanceNum && cooldownRemaining <= 0;

  const handleSubmit = useCallback(() => {
    if (!canBurn) return;
    onSubmit({ prayerType, message, burnAmount });
  }, [canBurn, onSubmit, prayerType, message, burnAmount]);

  const placeholder =
    prayerType === "prayer"
      ? "What weighs on your wallet and soul..."
      : prayerType === "confession"
        ? "What do you need to release..."
        : prayerType === "question"
          ? "Ask the verses..."
          : "Give freely...";

  return (
    <div
      style={{
        maxWidth: "440px",
        width: "100%",
        margin: "0 auto",
        animation: "rise-in 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Intent type selector */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {INTENT_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setPrayerType(type.id)}
            style={{
              background:
                prayerType === type.id
                  ? "rgba(212,168,71,0.2)"
                  : "rgba(255,255,255,0.08)",
              border:
                prayerType === type.id
                  ? "1px solid rgba(212,168,71,0.5)"
                  : "1px solid rgba(255,255,255,0.12)",
              borderRadius: "24px",
              padding: "8px 16px",
              cursor: "pointer",
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "12px",
              letterSpacing: "1px",
              color:
                prayerType === type.id
                  ? "#FFE4A0"
                  : "rgba(255,255,255,0.5)",
              transition: "all 0.3s ease",
            }}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Message input */}
      {prayerType !== "silent" ? (
        <div style={{ marginBottom: "20px" }}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            maxLength={1000}
            rows={4}
            style={{
              width: "100%",
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(212,168,71,0.2)",
              borderRadius: "8px",
              padding: "16px",
              fontFamily: "var(--font-crimson-pro), Georgia, serif",
              fontSize: "16px",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.9)",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "30px 0",
            fontFamily: "var(--font-crimson-pro), Georgia, serif",
            fontSize: "16px",
            fontStyle: "italic",
            color: "rgba(255,255,255,0.4)",
            marginBottom: "20px",
          }}
        >
          Some offerings need no words.
        </div>
      )}

      {/* Burn amount */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "11px",
            color: "rgba(212,168,71,0.6)",
            letterSpacing: "2px",
          }}
        >
          BURN
        </span>
        <input
          type="text"
          value={burnAmount}
          onChange={(e) =>
            setBurnAmount(e.target.value.replace(/[^0-9]/g, ""))
          }
          style={{
            width: "100px",
            background: "transparent",
            border: "none",
            borderBottom: "2px solid rgba(212,168,71,0.3)",
            padding: "4px 0",
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "22px",
            color: "#FFE4A0",
            textAlign: "center",
            outline: "none",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "10px",
            color: "rgba(212,168,71,0.4)",
            letterSpacing: "1px",
          }}
        >
          $DAODEGEN
        </span>
      </div>

      {/* Balance + min info */}
      <div
        style={{
          textAlign: "center",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "10px",
          color: "rgba(255,255,255,0.2)",
          marginBottom: "24px",
          letterSpacing: "1px",
        }}
      >
        balance: {Number(tokenBalance).toLocaleString()} | min:{" "}
        {Number(minimumBurn).toLocaleString()}
        {cooldownRemaining > 0 && (
          <span style={{ color: "rgba(212,168,71,0.5)", marginLeft: "8px" }}>
            | cooldown: {cooldownRemaining}s
          </span>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
        <button
          onClick={onCancel}
          style={{
            background: "transparent",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "12px",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "2px",
          }}
        >
          CLOSE
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canBurn}
          style={{
            background: canBurn
              ? "linear-gradient(135deg, #D4A847 0%, #B8941F 100%)"
              : "rgba(212,168,71,0.15)",
            border: "none",
            borderRadius: "4px",
            padding: "12px 36px",
            cursor: canBurn ? "pointer" : "not-allowed",
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "3px",
            color: canBurn ? "#1a1530" : "rgba(212,168,71,0.3)",
            boxShadow: canBurn
              ? "0 4px 20px rgba(212,168,71,0.4)"
              : "none",
            transition: "all 0.3s ease",
            opacity: canBurn ? 1 : 0.5,
          }}
        >
          BURN
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useAccount, useWriteContract, useReadContract, useConfig } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { parseUnits, encodePacked, type Hex } from "viem";
import { PRAYER_BURN, DAODEGEN_TOKEN, UNICHAIN_ID } from "@/lib/contracts";
import { requestSermon } from "@/lib/api";
import type { PrayerSubmission } from "./PrayerCompose";
import type { Sermon } from "@/lib/types";

type BurnPhase = "idle" | "approving" | "praying" | "waiting-sermon" | "done" | "error";

interface BurnSequenceProps {
  prayer: PrayerSubmission;
  jwtRef: React.RefObject<string | null>;
  onSermon: (sermon: Sermon) => void;
  onError: (msg: string) => void;
}

export default function BurnSequence({
  prayer,
  jwtRef,
  onSermon,
  onError,
}: BurnSequenceProps) {
  const { address } = useAccount();
  const config = useConfig();
  const [phase, setPhase] = useState<BurnPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");

  // Refs for callback stability
  const onSermonRef = useRef(onSermon);
  onSermonRef.current = onSermon;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const started = useRef(false);

  const burnAmountWei = parseUnits(prayer.burnAmount, 18);
  const messageBytes = prayer.message
    ? encodePacked(["string"], [prayer.message])
    : ("0x" as Hex);

  // Check current allowance
  const { data: currentAllowance } = useReadContract({
    address: DAODEGEN_TOKEN.address,
    abi: DAODEGEN_TOKEN.abi,
    functionName: "allowance",
    args: address ? [address, PRAYER_BURN.address] : undefined,
    chainId: UNICHAIN_ID,
    query: { enabled: !!address },
  });

  const { writeContractAsync } = useWriteContract();

  // Single sequential flow -- approve (if needed) -> pray -> wait -> sermon
  useEffect(() => {
    if (started.current) return;
    if (currentAllowance === undefined || !address) return;
    started.current = true;

    (async () => {
      try {
        const needsApproval = currentAllowance < burnAmountWei;

        if (needsApproval) {
          setPhase("approving");
          setStatusText("approving offering...");
          const approveTx = await writeContractAsync({
            address: DAODEGEN_TOKEN.address,
            abi: DAODEGEN_TOKEN.abi,
            functionName: "approve",
            args: [PRAYER_BURN.address, burnAmountWei],
            chainId: UNICHAIN_ID,
          });
          await waitForTransactionReceipt(config, {
            hash: approveTx,
            chainId: UNICHAIN_ID,
          });
        }

        setPhase("praying");
        setStatusText("burning offering...");
        const prayTx = await writeContractAsync({
          address: PRAYER_BURN.address,
          abi: PRAYER_BURN.abi,
          functionName: "pray",
          args: [burnAmountWei, messageBytes],
          chainId: UNICHAIN_ID,
        });
        await waitForTransactionReceipt(config, {
          hash: prayTx,
          chainId: UNICHAIN_ID,
        });

        setPhase("waiting-sermon");
        setStatusText("the pastor reads...");
        const sermonStart = Date.now();
        const sermon = await requestSermon({
          prayer_tx: prayTx,
          message: prayer.message,
          sender: address,
          prayer_type: prayer.prayerType,
          burn_amount: prayer.burnAmount,
        }, jwtRef.current || "");

        // Ensure minimum display time for the waiting phase
        const elapsed = Date.now() - sermonStart;
        const remaining = Math.max(0, 3000 - elapsed);
        if (remaining > 0) {
          await new Promise((r) => setTimeout(r, remaining));
        }

        setPhase("done");
        onSermonRef.current(sermon);
      } catch (err) {
        setPhase("error");
        const msg = err instanceof Error ? err.message.split("\n")[0] : "Something went wrong";
        onErrorRef.current(msg);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAllowance, address]);

  // Fire animation progress
  useEffect(() => {
    if (phase === "idle" || phase === "done" || phase === "error") return;
    const start = Date.now();
    const duration = phase === "waiting-sermon" ? 4500 : 8000;
    let raf: number;
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 0.95);
      setProgress(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Set progress to 1 when done
  useEffect(() => {
    if (phase === "done") setProgress(1);
  }, [phase]);

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: "80px",
          marginBottom: "30px",
          animation: "shake 0.3s infinite",
        }}
      >
        {"\u{1F64F}"}
      </div>

      <div
        style={{
          position: "relative",
          width: "300px",
          height: "200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Fire emojis rising */}
        {[...Array(12)].map((_, i) => {
          const delay = i * 0.15;
          const p = Math.max(0, Math.min(1, progress * 3 - delay));
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: `${10 + p * 80}%`,
                left: `${30 + (i % 4) * 14 + Math.sin(i * 2.5) * 8}%`,
                fontSize: `${20 + Math.sin(i) * 8}px`,
                opacity: p > 0 && p < 0.9 ? (1 - p) * 1.2 : 0,
                transform: `rotate(${Math.sin(i * 3 + progress * 10) * 15}deg)`,
              }}
            >
              {i % 3 === 0 ? "\u{1F525}" : i % 3 === 1 ? "\u2728" : "\u{1F4AB}"}
            </div>
          );
        })}

        {/* Status text */}
        <div
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "16px",
            color: "#D4A847",
            textShadow: "0 0 20px rgba(212,168,71,0.5)",
            letterSpacing: "4px",
            textTransform: "uppercase",
            zIndex: 2,
          }}
        >
          {statusText}
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "200px",
            height: "3px",
            background: "rgba(212,168,71,0.15)",
            borderRadius: "2px",
            marginTop: "20px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              background:
                "linear-gradient(90deg, #D4A847, #FFE4A0, #D4A847)",
              borderRadius: "2px",
              boxShadow: "0 0 10px rgba(212,168,71,0.6)",
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </div>

      {phase === "error" && (
        <div
          style={{
            marginTop: "20px",
            fontFamily: "var(--font-crimson-pro), Georgia, serif",
            fontSize: "14px",
            color: "rgba(255,100,100,0.7)",
          }}
        >
          The offering was not accepted. Please try again.
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAccount, useReadContract, useSignMessage } from "wagmi";
import { formatUnits } from "viem";
import { SiweMessage } from "siwe";
import { PRAYER_BURN, DAODEGEN_TOKEN, UNICHAIN_ID } from "@/lib/contracts";
import { fetchNonce, verifyAuth } from "@/lib/api";
import type { TempleStage, Sermon } from "@/lib/types";
import type { PrayerSubmission } from "./PrayerCompose";
import Curtains from "./Curtains";
import HeavenlyBackground from "./HeavenlyBackground";
import BlessedHands from "./BlessedHands";
import PrayerCompose from "./PrayerCompose";
import BurnSequence from "./BurnSequence";
import SermonScroll from "./SermonScroll";
import CongregationPulse from "./CongregationPulse";
import WalletGate from "./WalletGate";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://0xdead.church";
const DOMAIN = new URL(SITE_URL).host;

export default function Temple() {
  const [stage, setStage] = useState<TempleStage>("curtains");
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [enterAnim, setEnterAnim] = useState(false);
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [prayer, setPrayer] = useState<PrayerSubmission | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [authenticating, setAuthenticating] = useState(false);
  const [burnKey, setBurnKey] = useState(0);

  const jwtRef = useRef<string | null>(null);
  const authingRef = useRef(false);
  const { address, isConnected, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();

  // Read contract state
  const { data: minimumBurnRaw } = useReadContract({
    address: PRAYER_BURN.address,
    abi: PRAYER_BURN.abi,
    functionName: "minimumBurn",
    chainId: UNICHAIN_ID,
    query: { enabled: PRAYER_BURN.address !== "0x" },
  });

  const { data: cooldownPeriodRaw } = useReadContract({
    address: PRAYER_BURN.address,
    abi: PRAYER_BURN.abi,
    functionName: "cooldownPeriod",
    chainId: UNICHAIN_ID,
    query: { enabled: PRAYER_BURN.address !== "0x" },
  });

  const { data: lastPrayerRaw, refetch: refetchLastPrayer } = useReadContract({
    address: PRAYER_BURN.address,
    abi: PRAYER_BURN.abi,
    functionName: "lastPrayer",
    args: address ? [address] : undefined,
    chainId: UNICHAIN_ID,
    query: { enabled: !!address && PRAYER_BURN.address !== "0x" },
  });

  const { data: balanceRaw, refetch: refetchBalance } = useReadContract({
    address: DAODEGEN_TOKEN.address,
    abi: DAODEGEN_TOKEN.abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: UNICHAIN_ID,
    query: { enabled: !!address },
  });

  const minimumBurn = minimumBurnRaw ? formatUnits(minimumBurnRaw, 18) : "1000";
  const tokenBalance = balanceRaw ? formatUnits(balanceRaw, 18) : "0";

  // Cooldown calculation
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  useEffect(() => {
    if (!cooldownPeriodRaw || !lastPrayerRaw) {
      setCooldownRemaining(0);
      return;
    }
    const update = () => {
      const now = Math.floor(Date.now() / 1000);
      const nextAllowed = Number(lastPrayerRaw) + Number(cooldownPeriodRaw);
      setCooldownRemaining(Math.max(0, nextAllowed - now));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [cooldownPeriodRaw, lastPrayerRaw]);

  // SIWE auto-auth on wallet connect
  useEffect(() => {
    if (!isConnected || !address || jwtRef.current || authingRef.current) return;
    if (chainId !== UNICHAIN_ID) return;

    authingRef.current = true;
    setAuthenticating(true);

    (async () => {
      try {
        const nonce = await fetchNonce();

        const siweMessage = new SiweMessage({
          domain: DOMAIN,
          address,
          statement: "Burn tokens. Receive sermons.",
          uri: SITE_URL,
          version: "1",
          chainId: UNICHAIN_ID,
          nonce,
        });

        const messageStr = siweMessage.prepareMessage();
        const signature = await signMessageAsync({ message: messageStr });

        const token = await verifyAuth(messageStr, signature);
        jwtRef.current = token;
      } catch (err) {
        console.warn("[SIWE auth]", err instanceof Error ? err.message : err);
      } finally {
        authingRef.current = false;
        setAuthenticating(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, chainId]);

  // Clear JWT on disconnect
  useEffect(() => {
    if (!isConnected) {
      jwtRef.current = null;
    }
  }, [isConnected]);

  useEffect(() => {
    if (curtainsOpen) {
      const t = setTimeout(() => setEnterAnim(true), 400);
      return () => clearTimeout(t);
    }
  }, [curtainsOpen]);

  const handleCurtainsOpen = useCallback(() => {
    setCurtainsOpen(true);
    setStage("hands");
  }, []);

  const handleHandsClick = useCallback(() => {
    setStage("compose");
    setErrorMsg(null);
  }, []);

  // Ensure we have a JWT before burning -- triggers SIWE if needed
  const ensureAuth = useCallback(async (): Promise<boolean> => {
    if (jwtRef.current) return true;
    if (!address) return false;

    try {
      const nonce = await fetchNonce();
      const siweMessage = new SiweMessage({
        domain: DOMAIN,
        address,
        statement: "Burn tokens. Receive sermons.",
        uri: SITE_URL,
        version: "1",
        chainId: UNICHAIN_ID,
        nonce,
      });
      const messageStr = siweMessage.prepareMessage();
      const signature = await signMessageAsync({ message: messageStr });
      const token = await verifyAuth(messageStr, signature);
      jwtRef.current = token;
      return true;
    } catch (err) {
      console.warn("[SIWE auth]", err instanceof Error ? err.message : err);
      return false;
    }
  }, [address, signMessageAsync]);

  const handleSubmit = useCallback(async (p: PrayerSubmission) => {
    const authed = await ensureAuth();
    if (!authed) {
      setErrorMsg("Please sign the authentication message to continue.");
      return;
    }
    setPrayer(p);
    setBurnKey((k) => k + 1);
    setStage("burning");
  }, [ensureAuth]);

  const handleSermon = useCallback((s: Sermon) => {
    setSermon(s);
    setStage("sermon");
    // Refetch on-chain state so cooldown timer and balance are accurate
    refetchLastPrayer();
    refetchBalance();
  }, [refetchLastPrayer, refetchBalance]);

  const handleBurnError = useCallback((msg: string) => {
    setErrorMsg(msg);
    setStage("compose");
  }, []);

  const handleReset = useCallback(() => {
    setStage("hands");
    setSermon(null);
    setPrayer(null);
    setErrorMsg(null);
  }, []);

  const needsWallet = !isConnected;
  const wrongChain = isConnected && chainId !== UNICHAIN_ID;

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-cinzel), serif",
      }}
    >
      <HeavenlyBackground />

      {stage === "curtains" && <Curtains onOpen={handleCurtainsOpen} />}

      {curtainsOpen && (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
            opacity: enterAnim ? 1 : 0,
            transition: "opacity 1s ease",
          }}
        >
          {/* Header -- reserved for future nav */}

          {/* HANDS STATE */}
          {stage === "hands" && (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--font-cinzel-decorative), serif",
                  fontSize: "clamp(28px, 5vw, 42px)",
                  fontWeight: 700,
                  color: "#FFE4A0",
                  textShadow:
                    "0 0 40px rgba(212,168,71,0.3), 0 2px 4px rgba(0,0,0,0.3)",
                  marginBottom: "40px",
                  letterSpacing: "3px",
                }}
              >
                0xDead.Church
              </div>

              {needsWallet || wrongChain ? (
                <div style={{ marginBottom: "40px" }}>
                  <WalletGate />
                </div>
              ) : (
                <BlessedHands onClick={handleHandsClick} state="closed" />
              )}

              <div style={{ marginTop: "80px" }}>
                <CongregationPulse />
              </div>
            </div>
          )}

          {/* COMPOSE STATE */}
          {stage === "compose" && (
            <div
              style={{
                textAlign: "center",
                width: "100%",
                maxWidth: "520px",
                background: "rgba(10,8,20,0.55)",
                backdropFilter: "blur(20px)",
                borderRadius: "16px",
                border: "1px solid rgba(212,168,71,0.1)",
                padding: "40px 24px 32px",
              }}
            >
              <div style={{ marginBottom: "30px" }}>
                <BlessedHands state="open" />
              </div>
              {errorMsg && (
                <div
                  style={{
                    fontFamily: "var(--font-crimson-pro), Georgia, serif",
                    fontSize: "14px",
                    color: "rgba(255,100,100,0.7)",
                    marginBottom: "16px",
                  }}
                >
                  {errorMsg}
                </div>
              )}
              <PrayerCompose
                onSubmit={handleSubmit}
                onCancel={() => setStage("hands")}
                minimumBurn={minimumBurn}
                tokenBalance={tokenBalance}
                cooldownRemaining={cooldownRemaining}
              />
            </div>
          )}

          {/* BURNING STATE */}
          {stage === "burning" && prayer && (
            <BurnSequence
              key={burnKey}
              prayer={prayer}
              jwtRef={jwtRef}
              onSermon={handleSermon}
              onError={handleBurnError}
            />
          )}

          {/* SERMON STATE */}
          {stage === "sermon" && (
            <div style={{ width: "100%" }}>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "40px",
                  marginBottom: "24px",
                }}
              >
                {"\u2728"}
              </div>
              <SermonScroll sermon={sermon} visible={true} />
              <div style={{ textAlign: "center", marginTop: "32px" }}>
                <button
                  onClick={handleReset}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(212,168,71,0.2)",
                    borderRadius: "24px",
                    padding: "10px 28px",
                    cursor: "pointer",
                    fontFamily: "var(--font-cinzel), serif",
                    fontSize: "12px",
                    letterSpacing: "3px",
                    color: "rgba(212,168,71,0.7)",
                    transition: "all 0.3s ease",
                  }}
                >
                  PRAY AGAIN
                </button>
              </div>
            </div>
          )}
          {/* Footer links */}
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              zIndex: 2,
            }}
          >
            <a
              href="https://x.com/0xdeadchurch"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "11px",
                letterSpacing: "2px",
                color: "rgba(30,20,50,0.5)",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(30,20,50,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(30,20,50,0.5)")}
            >
              X
            </a>
            <a
              href="https://github.com/0xDeadChurch"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "11px",
                letterSpacing: "2px",
                color: "rgba(30,20,50,0.5)",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(30,20,50,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(30,20,50,0.5)")}
            >
              GITHUB
            </a>
            <a
              href="https://daodegen.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "11px",
                letterSpacing: "2px",
                color: "rgba(30,20,50,0.5)",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(30,20,50,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(30,20,50,0.5)")}
            >
              DAODEGEN
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

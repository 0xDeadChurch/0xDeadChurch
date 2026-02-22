"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletGate() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openChainModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        if (!ready) return null;

        if (!connected) {
          return (
            <button
              onClick={openConnectModal}
              style={{
                background: "linear-gradient(135deg, #D4A847 0%, #B8941F 100%)",
                border: "none",
                borderRadius: "4px",
                padding: "14px 40px",
                cursor: "pointer",
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "4px",
                color: "#1a1530",
                boxShadow: "0 4px 20px rgba(212,168,71,0.4)",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
              }}
            >
              Connect Wallet
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button
              onClick={openChainModal}
              style={{
                background: "rgba(255,100,100,0.15)",
                border: "1px solid rgba(255,100,100,0.3)",
                borderRadius: "4px",
                padding: "12px 32px",
                cursor: "pointer",
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "12px",
                letterSpacing: "3px",
                color: "rgba(255,100,100,0.8)",
                textTransform: "uppercase",
              }}
            >
              Switch to Unichain
            </button>
          );
        }

        return null;
      }}
    </ConnectButton.Custom>
  );
}

"use client";

import { useState, useEffect } from "react";
import type { Sermon } from "@/lib/types";

interface SermonScrollProps {
  sermon: Sermon | null;
  visible: boolean;
}

export default function SermonScroll({ sermon, visible }: SermonScrollProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setShow(true), 300);
      return () => clearTimeout(t);
    }
    setShow(false);
  }, [visible]);

  if (!sermon) return null;

  const isSilence = !sermon.content || sermon.response_type === "silence";

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(30px)",
        transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Scroll container */}
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(255,248,230,0.95) 0%, rgba(245,235,210,0.92) 100%)",
          borderRadius: "4px",
          padding: "36px 32px",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)",
          position: "relative",
          border: "1px solid rgba(212,168,71,0.3)",
        }}
      >
        {/* Decorative top border */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: "16px",
            right: "16px",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #D4A847, transparent)",
            opacity: 0.4,
          }}
        />

        {/* Sermon header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontFamily: "var(--font-cinzel-decorative), serif",
            fontSize: "11px",
            letterSpacing: "6px",
            textTransform: "uppercase",
            color: "#B8941F",
          }}
        >
          {isSilence ? "the pastor listens" : "the pastor speaks"}
        </div>

        {/* Sermon text */}
        <div
          style={{
            fontFamily: "var(--font-crimson-pro), Georgia, serif",
            fontSize: "17px",
            lineHeight: 1.85,
            color: "#2a2218",
            textAlign: isSilence ? "center" : "left",
          }}
        >
          {isSilence ? (
            <p style={{ fontStyle: "italic", color: "#8a7a5a" }}>
              Your silence was received. Not all offerings require words.
            </p>
          ) : (
            sermon.content.split(/\n\n+/).map((para, i) => (
              <p key={i} style={{ marginBottom: i < sermon.content.split(/\n\n+/).length - 1 ? "16px" : 0 }}>
                {para}
              </p>
            ))
          )}
        </div>

        {/* Verse refs */}
        {sermon.verse_refs && sermon.verse_refs.length > 0 && (
          <div
            style={{
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(180,160,130,0.2)",
              textAlign: "center",
            }}
          >
            {sermon.verse_refs.map((v) => (
              <a
                key={v.id}
                href={`https://daodegen.com/verse/${v.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-crimson-pro), Georgia, serif",
                  fontSize: "13px",
                  fontStyle: "italic",
                  color: "#8a7a5a",
                  marginRight: "12px",
                  textDecoration: "none",
                }}
              >
                Verse {v.id}
              </a>
            ))}
          </div>
        )}

        {/* Decorative bottom border */}
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            left: "16px",
            right: "16px",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #D4A847, transparent)",
            opacity: 0.4,
          }}
        />
      </div>
    </div>
  );
}

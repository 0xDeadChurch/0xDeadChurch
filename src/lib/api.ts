import type { Sermon, CongregationState } from "./types";

export async function fetchNonce(): Promise<string> {
  const res = await fetch("/api/auth/nonce");
  if (!res.ok) throw new Error("Failed to fetch nonce");
  const data = await res.json();
  return data.nonce;
}

export async function verifyAuth(
  message: string,
  signature: string,
): Promise<string> {
  const res = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, signature }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Auth verification failed");
  }
  const data = await res.json();
  return data.token;
}

export async function requestSermon(
  payload: {
    prayer_tx: string;
    message: string;
    sender: string;
    prayer_type: string;
    burn_amount: string;
  },
  jwt: string,
): Promise<Sermon> {
  const res = await fetch("/api/sermon", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Sermon request failed");
  }
  const data = await res.json();
  return data.sermon;
}

export async function fetchCongregation(): Promise<CongregationState> {
  const res = await fetch("/api/congregation/state");
  if (!res.ok) throw new Error("Failed to fetch congregation state");
  return res.json();
}

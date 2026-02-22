export type PrayerType = "prayer" | "confession" | "question" | "silent" | "offering";

export type TempleStage = "curtains" | "hands" | "compose" | "burning" | "sermon";

export interface VerseRef {
  id: number;
  fragment: string;
}

export interface Sermon {
  content: string;
  verse_refs: VerseRef[];
  sentiment_tag?: string;
}

export interface CongregationState {
  sentiment: string;
  prayersInWindow: number;
  uniqueSupplicants: number;
  windowHours: number;
  breakdown: Record<string, number>;
  totalPrayers: number;
  totalSermons: number;
}

import type { Exercise } from "@mom/shared";
import type { IconName } from "../lib/icons";

// JS Date.getDay() convention: 0 = Sun, 1 = Mon, ..., 6 = Sat.
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type WeekdaySlug = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export const WEEKDAY_SLUGS: Record<WeekdaySlug, Weekday> = {
  mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 0,
};

export const WEEKDAY_BY_ID: Record<Weekday, WeekdaySlug> = {
  0: "sun", 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat",
};

export interface WeekdayInfo {
  id: Weekday;
  short: string;
  long: string;
}

export type SessionId = "morning" | "day" | "evening";

export interface SessionInfo {
  id: SessionId;
  icon: IconName;
  label: string;
  sub: string;
  duration: string;
  goal: string;
}

export interface WeekProgramPlayable {
  kind: "playable";
  id: string;
  label: string;
  description: string;
  totalDays: number;
  sessions: SessionInfo[];
  weekdays: WeekdayInfo[];
  build: (weekday: Weekday, session: SessionId, day: number) => Exercise[];
}

export interface WeekProgramComingSoon {
  kind: "comingSoon";
  id: string;
  label: string;
  description: string;
}

export type WeekProgram = WeekProgramPlayable | WeekProgramComingSoon;

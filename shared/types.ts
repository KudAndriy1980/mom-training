// Shared between web and api. Keep this file dependency-free.

export type ExerciseKind = "timer" | "reps" | "holdReps";
export type PositionId = "lying" | "sitting" | "standing";

export interface Exercise {
  id: string;
  block: string;
  icon: string;
  position: PositionId;
  title: string;
  desc: string;
  hint?: string;
  kind: ExerciseKind;
  sides?: boolean;
  sideLabels?: [string, string];
  duration?: number;
  repsTarget?: number;
  repsLabel?: string;
  hold?: number;
}

export interface Session {
  id: string;
  weekId: string;
  dayId: string;
  date: string;
  createdAt: string;
  note?: string | null;
}

export interface Entry {
  id: string;
  sessionId: string;
  exerciseId: string;
  side: 0 | 1 | null;
  repsDone: number | null;
  holdSec: number | null;
  note: string | null;
  createdAt: string;
}

export interface SetNote {
  id: string;
  entryId: string;
  setNumber: number;
  note: string;
  createdAt: string;
}

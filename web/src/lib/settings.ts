const START_DATE_KEY = "mom.startDate";

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getStartDate(): string | null {
  return localStorage.getItem(START_DATE_KEY);
}

export function setStartDate(iso: string): void {
  localStorage.setItem(START_DATE_KEY, iso);
}

export function clearStartDate(): void {
  localStorage.removeItem(START_DATE_KEY);
}

export function computeDayNumber(startISO: string, nowISO: string): number {
  const a = new Date(`${startISO}T00:00:00`);
  const b = new Date(`${nowISO}T00:00:00`);
  const days = Math.floor((b.getTime() - a.getTime()) / 86_400_000);
  return days + 1;
}

export function currentDay(startISO: string): number {
  return computeDayNumber(startISO, todayISO());
}

export function weekOfDay(day: number): 1 | 2 | "after" {
  if (day <= 7) return 1;
  if (day <= 14) return 2;
  return "after";
}

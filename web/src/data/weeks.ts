import type { WeekProgram } from "./types";
import { week0102 } from "./week-01-02";

export const WEEKS: WeekProgram[] = [
  week0102,
  {
    kind: "comingSoon",
    id: "w34",
    label: "Тижні 3–4",
    description: "Ходьба довшими дистанціями, вправи стоячи",
  },
  {
    kind: "comingSoon",
    id: "w56",
    label: "Тижні 5–6",
    description: "Зміцнення",
  },
];

export function getWeek(id: string): WeekProgram | undefined {
  return WEEKS.find((w) => w.id === id);
}

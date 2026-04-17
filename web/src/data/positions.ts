import type { PositionId } from "@mom/shared";
import type { IconName } from "../lib/icons";

export interface PositionInfo {
  icon: IconName;
  label: string;
  transitionTitle: string;
  transitionDesc: string;
}

export const POSITIONS: Record<PositionId, PositionInfo> = {
  lying: {
    icon: "bed",
    label: "Лежачи",
    transitionTitle: "Лежачи",
    transitionDesc:
      "Ляжте на спину. Руки вздовж тіла, долонями догори. Під голову — невелика подушка.",
  },
  sitting: {
    icon: "armchair",
    label: "Сидячи",
    transitionTitle: "Сидячи",
    transitionDesc: "Сядьте зручно на стілець біля столу. Спина пряма, стопи на підлозі.",
  },
  standing: {
    icon: "standing",
    label: "Стоячи",
    transitionTitle: "Стоячи",
    transitionDesc: "Встаньте біля опори (стіл / спинка стільця). Тримайтеся, якщо потрібно.",
  },
};

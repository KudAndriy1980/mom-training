import {
  Activity,
  Armchair,
  ArrowLeft,
  ArrowRight,
  Bed,
  ChevronRight,
  ChevronUp,
  Coffee,
  CornerUpRight,
  Dumbbell,
  Flame,
  Footprints,
  Hand,
  Layers,
  Lightbulb,
  Minus,
  Moon,
  MoveHorizontal,
  Newspaper,
  PartyPopper,
  PenTool,
  Pencil,
  PersonStanding,
  Plus,
  RotateCcw,
  RotateCw,
  Sprout,
  StretchVertical,
  Sun,
  Sunrise,
  Target,
  Tornado,
  Utensils,
  Wind,
  Wrench,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

export type IconName =
  | "bed"
  | "armchair"
  | "standing"
  | "sunrise"
  | "sun"
  | "moon"
  | "wind"
  | "hand"
  | "footprints"
  | "stretch"
  | "activity"
  | "tornado"
  | "rotate-cw"
  | "rotate-ccw"
  | "corner-up-right"
  | "dumbbell"
  | "flame"
  | "newspaper"
  | "sprout"
  | "pencil"
  | "layers"
  | "pen-tool"
  | "wrench"
  | "coffee"
  | "utensils"
  | "target"
  | "move-horizontal"
  | "chevron-up"
  | "chevron-right"
  | "arrow-left"
  | "arrow-right"
  | "party"
  | "lightbulb"
  | "plus"
  | "minus";

const ICONS: Record<IconName, LucideIcon> = {
  bed: Bed,
  armchair: Armchair,
  standing: PersonStanding,
  sunrise: Sunrise,
  sun: Sun,
  moon: Moon,
  wind: Wind,
  hand: Hand,
  footprints: Footprints,
  stretch: StretchVertical,
  activity: Activity,
  tornado: Tornado,
  "rotate-cw": RotateCw,
  "rotate-ccw": RotateCcw,
  "corner-up-right": CornerUpRight,
  dumbbell: Dumbbell,
  flame: Flame,
  newspaper: Newspaper,
  sprout: Sprout,
  pencil: Pencil,
  layers: Layers,
  "pen-tool": PenTool,
  wrench: Wrench,
  coffee: Coffee,
  utensils: Utensils,
  target: Target,
  "move-horizontal": MoveHorizontal,
  "chevron-up": ChevronUp,
  "chevron-right": ChevronRight,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  party: PartyPopper,
  lightbulb: Lightbulb,
  plus: Plus,
  minus: Minus,
};

interface IconProps extends Omit<LucideProps, "ref"> {
  name: IconName;
}

export function Icon({ name, size, ...rest }: IconProps) {
  const Component = ICONS[name];
  return <Component size={size ?? 18} strokeWidth={1.75} {...rest} />;
}

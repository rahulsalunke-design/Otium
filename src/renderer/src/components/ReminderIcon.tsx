import {
  Apple,
  Bell,
  BookOpen,
  Brain,
  Coffee,
  Dumbbell,
  Eye,
  Footprints,
  GlassWater,
  Heart,
  Leaf,
  Moon,
  Move,
  Music,
  PersonStanding,
  Pill,
  Smile,
  Sparkles,
  Sun,
  Utensils,
  Wind,
  type LucideIcon
} from 'lucide-react'
import type { IconId } from '@shared/types'

const ICON_COMPONENTS: Record<IconId, LucideIcon> = {
  stand: PersonStanding,
  water: GlassWater,
  eye: Eye,
  stretch: Move,
  walk: Footprints,
  breathe: Wind,
  coffee: Coffee,
  meal: Utensils,
  snack: Apple,
  pill: Pill,
  dumbbell: Dumbbell,
  heart: Heart,
  brain: Brain,
  book: BookOpen,
  music: Music,
  leaf: Leaf,
  sun: Sun,
  moon: Moon,
  smile: Smile,
  sparkles: Sparkles,
  bell: Bell
}

interface Props {
  icon: IconId
  size?: number
}

/** A reminder's icon, drawn in the surrounding text colour. */
export function ReminderIcon({ icon, size = 16 }: Props) {
  const Icon = ICON_COMPONENTS[icon] ?? Bell
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" focusable="false" />
}

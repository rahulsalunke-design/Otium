// Shapes and names shared by the main process (engine) and the panel (UI).

export type TimerStatus = 'running' | 'paused' | 'stopped'
export type TimerAction = 'start' | 'pause' | 'reset' | 'snooze'

/** Otium's own sounds (made by scripts/make-sounds.py), plus silence. */
export const SOUNDS = [
  { id: 'chime', label: 'Chime' },
  { id: 'droplet', label: 'Droplet' },
  { id: 'rise', label: 'Rise' },
  { id: 'bowl', label: 'Bowl' },
  { id: 'none', label: 'None' }
] as const
export type SoundId = (typeof SOUNDS)[number]['id']
export const SOUND_IDS: readonly SoundId[] = SOUNDS.map((s) => s.id)
/** Sound for reminders the user adds. */
export const DEFAULT_SOUND: SoundId = 'chime'

/** One reminder: a built-in one (stand, water, eyes) or one the user added. */
export interface Reminder {
  id: string
  label: string
  /** Interval in minutes. */
  minutes: number
  enabled: boolean
  /** Built-in reminders can be switched off and retimed, but not renamed or deleted. */
  builtIn: boolean
  /** Played when the reminder goes off. */
  sound: SoundId
}

export const BUILT_IN_REMINDERS: Reminder[] = [
  { id: 'stand', label: 'Stand up', minutes: 45, enabled: true, builtIn: true, sound: 'rise' },
  { id: 'water', label: 'Water', minutes: 60, enabled: true, builtIn: true, sound: 'droplet' },
  { id: 'eyes', label: 'Eye break', minutes: 20, enabled: true, builtIn: true, sound: 'bowl' }
]

/** Notification text for the built-in reminders. Custom ones use their name. */
export const BUILT_IN_COPY: Record<string, { title: string; body: string }> = {
  stand: { title: 'Time to stand up', body: 'Stretch, roll your shoulders, take a few steps.' },
  water: { title: 'Time for some water', body: 'Take a few sips. Your body will thank you.' },
  eyes: { title: 'Rest your eyes', body: 'Look at something 20 feet away for 20 seconds.' }
}

export const MIN_MINUTES = 1
export const MAX_MINUTES = 240
export const MAX_REMINDERS = 10
export const MAX_LABEL_LENGTH = 30
export const SNOOZE_MINUTES = 5
/** How long after a reminder the panel keeps offering "Snooze". */
export const SNOOZE_OFFER_MS = 10 * 60 * 1000

export interface TimerSnapshot {
  id: string
  label: string
  builtIn: boolean
  sound: SoundId
  status: TimerStatus
  /** Full reminder length, in ms. */
  durationMs: number
  /** Length of the current countdown (the full length, or 5 min when snoozed). */
  cycleMs: number
  remainingMs: number
  /** When it will go off (epoch ms), only while running. */
  endsAt: number | null
  snoozed: boolean
  /** When it last went off (epoch ms). */
  lastFiredAt: number | null
}

/** Message names between the panel and the engine. */
export const IPC = {
  getTimers: 'timers:get',
  timerAction: 'timers:action',
  timersUpdate: 'timers:update',
  getReminders: 'reminders:get',
  setReminders: 'reminders:set',
  previewSound: 'sound:preview',
  resizePanel: 'panel:resize',
  quit: 'app:quit'
} as const

/** What the panel can call. Exposed as `window.otium` by the preload script. */
export interface OtiumApi {
  getTimers(): Promise<TimerSnapshot[]>
  timerAction(id: string, action: TimerAction): Promise<void>
  onTimers(listener: (timers: TimerSnapshot[]) => void): () => void
  getReminders(): Promise<Reminder[]>
  setReminders(reminders: Reminder[]): Promise<Reminder[]>
  previewSound(sound: SoundId): void
  resizePanel(height: number): void
  quit(): void
}

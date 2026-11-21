// Shapes and names shared by the main process (engine) and the panel (UI).

export const TIMER_IDS = ['stand', 'water', 'eyes'] as const
export type TimerId = (typeof TIMER_IDS)[number]

export type TimerStatus = 'running' | 'paused' | 'stopped'
export type TimerAction = 'start' | 'pause' | 'reset' | 'snooze'

/** Reminder lengths in minutes. */
export type Durations = Record<TimerId, number>

export const DEFAULT_DURATIONS: Durations = { stand: 45, water: 60, eyes: 20 }
export const MIN_DURATION = 1
export const MAX_DURATION = 240
export const SNOOZE_MINUTES = 5
/** How long after a reminder the panel keeps offering "Snooze". */
export const SNOOZE_OFFER_MS = 10 * 60 * 1000

export interface TimerSnapshot {
  id: TimerId
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

export const TIMER_COPY: Record<TimerId, { label: string; title: string; body: string }> = {
  stand: {
    label: 'Stand up',
    title: 'Time to stand up',
    body: 'Stretch, roll your shoulders, take a few steps.'
  },
  water: {
    label: 'Water',
    title: 'Time for some water',
    body: 'Take a few sips. Your body will thank you.'
  },
  eyes: {
    label: 'Eye break',
    title: 'Rest your eyes',
    body: 'Look at something 20 feet away for 20 seconds.'
  }
}

/** Message names between the panel and the engine. */
export const IPC = {
  getTimers: 'timers:get',
  timerAction: 'timers:action',
  timersUpdate: 'timers:update',
  getDurations: 'settings:get',
  setDurations: 'settings:set',
  resizePanel: 'panel:resize',
  quit: 'app:quit'
} as const

/** What the panel can call. Exposed as `window.otium` by the preload script. */
export interface OtiumApi {
  getTimers(): Promise<TimerSnapshot[]>
  timerAction(id: TimerId, action: TimerAction): Promise<void>
  onTimers(listener: (timers: TimerSnapshot[]) => void): () => void
  getDurations(): Promise<Durations>
  setDurations(durations: Durations): Promise<Durations>
  resizePanel(height: number): void
  quit(): void
}

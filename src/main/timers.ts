import { EventEmitter } from 'node:events'
import {
  SNOOZE_MINUTES,
  TIMER_IDS,
  type Durations,
  type TimerId,
  type TimerSnapshot,
  type TimerStatus
} from '@shared/types'

const MINUTE = 60_000
const TICK_MS = 1000

interface TimerState {
  id: TimerId
  status: TimerStatus
  durationMs: number
  cycleMs: number
  /** Time left when paused or stopped. */
  remainingMs: number
  /** Absolute end time while running. Storing the end time (not a counter) keeps it accurate across sleep. */
  endsAt: number | null
  snoozed: boolean
  lastFiredAt: number | null
}

interface TimerEvents {
  /** A countdown reached zero. The timer has already restarted. */
  fired: [id: TimerId, wasSnooze: boolean]
  /** Something changed, or a second passed. */
  change: [timers: TimerSnapshot[]]
}

/**
 * The three reminder clocks. Lives in the main process so it keeps running
 * while the panel is closed.
 *
 * v2 hooks: `pauseAll` / `resumeAll` are for idle detection (powerMonitor),
 * and anything that should happen on a reminder (a full-screen break overlay)
 * can listen to the `fired` event next to the notifier.
 */
export class TimerEngine extends EventEmitter<TimerEvents> {
  private timers = new Map<TimerId, TimerState>()
  private interval: NodeJS.Timeout | null = null
  private pausedByAll = new Set<TimerId>()

  constructor(durations: Durations, private now: () => number = Date.now) {
    super()
    for (const id of TIMER_IDS) {
      const durationMs = durations[id] * MINUTE
      this.timers.set(id, {
        id,
        status: 'stopped',
        durationMs,
        cycleMs: durationMs,
        remainingMs: durationMs,
        endsAt: null,
        snoozed: false,
        lastFiredAt: null
      })
    }
  }

  begin(): void {
    if (this.interval) return
    this.interval = setInterval(() => this.tick(), TICK_MS)
  }

  stop(): void {
    if (this.interval) clearInterval(this.interval)
    this.interval = null
  }

  snapshot(): TimerSnapshot[] {
    const now = this.now()
    return TIMER_IDS.map((id) => {
      const t = this.get(id)
      const remainingMs =
        t.status === 'running' && t.endsAt !== null ? Math.max(0, t.endsAt - now) : t.remainingMs
      return { ...t, remainingMs }
    })
  }

  start(id: TimerId): void {
    const t = this.get(id)
    if (t.status === 'running') return
    t.endsAt = this.now() + t.remainingMs
    t.status = 'running'
    this.changed()
  }

  pause(id: TimerId): void {
    const t = this.get(id)
    if (t.status !== 'running' || t.endsAt === null) return
    t.remainingMs = Math.max(0, t.endsAt - this.now())
    t.endsAt = null
    t.status = 'paused'
    this.changed()
  }

  /** Back to the full length. Keeps counting if it was running; otherwise waits. */
  reset(id: TimerId): void {
    const t = this.get(id)
    const wasRunning = t.status === 'running'
    t.cycleMs = t.durationMs
    t.remainingMs = t.durationMs
    t.snoozed = false
    t.lastFiredAt = null
    if (wasRunning) {
      t.endsAt = this.now() + t.durationMs
    } else {
      t.endsAt = null
      t.status = 'stopped'
    }
    this.changed()
  }

  /** "Remind me again in 5 minutes", then the normal rhythm resumes. */
  snooze(id: TimerId): void {
    const t = this.get(id)
    const ms = SNOOZE_MINUTES * MINUTE
    t.cycleMs = ms
    t.remainingMs = ms
    t.endsAt = this.now() + ms
    t.status = 'running'
    t.snoozed = true
    t.lastFiredAt = null
    this.changed()
  }

  setDurations(durations: Durations): void {
    for (const id of TIMER_IDS) {
      const ms = durations[id] * MINUTE
      const t = this.get(id)
      if (t.durationMs === ms) continue
      t.durationMs = ms
      this.reset(id)
    }
    this.changed()
  }

  /** v2: pause everything that is running (e.g. when the Mac goes idle). */
  pauseAll(): void {
    for (const t of this.timers.values()) {
      if (t.status === 'running') {
        this.pausedByAll.add(t.id)
        this.pause(t.id)
      }
    }
  }

  /** v2: resume only what `pauseAll` paused. */
  resumeAll(): void {
    for (const id of this.pausedByAll) this.start(id)
    this.pausedByAll.clear()
  }

  private tick(): void {
    const now = this.now()
    for (const t of this.timers.values()) {
      if (t.status !== 'running' || t.endsAt === null || now < t.endsAt) continue
      const wasSnooze = t.snoozed
      // Auto-restart with the full length.
      t.cycleMs = t.durationMs
      t.remainingMs = t.durationMs
      t.endsAt = now + t.durationMs
      t.snoozed = false
      t.lastFiredAt = now
      this.emit('fired', t.id, wasSnooze)
    }
    this.changed()
  }

  private changed(): void {
    this.emit('change', this.snapshot())
  }

  private get(id: TimerId): TimerState {
    const t = this.timers.get(id)
    if (!t) throw new Error(`Unknown timer: ${id}`)
    return t
  }
}

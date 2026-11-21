import { EventEmitter } from 'node:events'
import { SNOOZE_MINUTES, type Reminder, type TimerSnapshot, type TimerStatus } from '@shared/types'

const MINUTE = 60_000
const TICK_MS = 1000

interface TimerState {
  id: string
  label: string
  builtIn: boolean
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
  fired: [timer: TimerSnapshot, wasSnooze: boolean]
  /** Something changed, or a second passed. */
  change: [timers: TimerSnapshot[]]
}

/**
 * The reminder clocks, one per switched-on reminder. Lives in the main process
 * so it keeps running while the panel is closed.
 *
 * v2 hooks: `pauseAll` / `resumeAll` are for idle detection (powerMonitor),
 * and anything that should happen on a reminder (a full-screen break overlay)
 * can listen to the `fired` event next to the notifier.
 */
export class TimerEngine extends EventEmitter<TimerEvents> {
  /** Kept in the same order as the reminders list. */
  private timers = new Map<string, TimerState>()
  private interval: NodeJS.Timeout | null = null
  private pausedByAll = new Set<string>()

  constructor(private now: () => number = Date.now) {
    super()
  }

  begin(): void {
    if (this.interval) return
    this.interval = setInterval(() => this.tick(), TICK_MS)
  }

  stop(): void {
    if (this.interval) clearInterval(this.interval)
    this.interval = null
  }

  has(id: string): boolean {
    return this.timers.has(id)
  }

  snapshot(): TimerSnapshot[] {
    return [...this.timers.values()].map((t) => this.snap(t))
  }

  /**
   * Brings the clocks in line with the reminders list: switched-on reminders
   * get a clock (new ones start straight away), switched-off or deleted ones
   * lose theirs, and a changed interval restarts that clock.
   */
  setReminders(reminders: Reminder[]): void {
    const next = new Map<string, TimerState>()
    for (const r of reminders) {
      if (!r.enabled) continue
      const durationMs = r.minutes * MINUTE
      const existing = this.timers.get(r.id)
      if (existing) {
        existing.label = r.label
        if (existing.durationMs !== durationMs) {
          existing.durationMs = durationMs
          this.restart(existing)
        }
        next.set(r.id, existing)
      } else {
        const t: TimerState = {
          id: r.id,
          label: r.label,
          builtIn: r.builtIn,
          status: 'stopped',
          durationMs,
          cycleMs: durationMs,
          remainingMs: durationMs,
          endsAt: null,
          snoozed: false,
          lastFiredAt: null
        }
        this.run(t)
        next.set(r.id, t)
      }
    }
    for (const id of this.pausedByAll) if (!next.has(id)) this.pausedByAll.delete(id)
    this.timers = next
    this.changed()
  }

  start(id: string): void {
    const t = this.get(id)
    if (t.status === 'running') return
    this.run(t)
    this.changed()
  }

  pause(id: string): void {
    const t = this.get(id)
    if (t.status !== 'running' || t.endsAt === null) return
    t.remainingMs = Math.max(0, t.endsAt - this.now())
    t.endsAt = null
    t.status = 'paused'
    this.changed()
  }

  /** Back to the full length. Keeps counting if it was running; otherwise waits. */
  reset(id: string): void {
    this.restart(this.get(id))
    this.changed()
  }

  /** "Remind me again in 5 minutes", then the normal rhythm resumes. */
  snooze(id: string): void {
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
    for (const id of this.pausedByAll) if (this.timers.has(id)) this.start(id)
    this.pausedByAll.clear()
  }

  private run(t: TimerState): void {
    t.endsAt = this.now() + t.remainingMs
    t.status = 'running'
  }

  private restart(t: TimerState): void {
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
      this.emit('fired', this.snap(t), wasSnooze)
    }
    this.changed()
  }

  private snap(t: TimerState): TimerSnapshot {
    const remainingMs =
      t.status === 'running' && t.endsAt !== null ? Math.max(0, t.endsAt - this.now()) : t.remainingMs
    return { ...t, remainingMs }
  }

  private changed(): void {
    this.emit('change', this.snapshot())
  }

  private get(id: string): TimerState {
    const t = this.timers.get(id)
    if (!t) throw new Error(`Unknown timer: ${id}`)
    return t
  }
}

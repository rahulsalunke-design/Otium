import { SNOOZE_OFFER_MS, type TimerSnapshot } from '@shared/types'

/** 23:46 style, for the List view. */
export function formatCountdown(ms: number): string {
  const total = Math.ceil(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/** "24 min" or "1h 5m", for the Glance view: minutes are enough at a glance. */
export function formatMinutes(ms: number): string {
  const m = Math.max(1, Math.ceil(ms / 60_000))
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const rest = m % 60
  return rest ? `${h}h ${rest}m` : `${h}h`
}

/** How much of the current countdown is left, 0 to 1. */
export function progressOf(t: TimerSnapshot): number {
  return t.cycleMs > 0 ? Math.min(1, Math.max(0, t.remainingMs / t.cycleMs)) : 0
}

/** True for a little while after a reminder went off, while Snooze is offered. */
export function recentlyFired(t: TimerSnapshot): boolean {
  return t.lastFiredAt !== null && Date.now() - t.lastFiredAt < SNOOZE_OFFER_MS
}

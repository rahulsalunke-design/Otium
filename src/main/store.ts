import Store from 'electron-store'
import {
  DEFAULT_DURATIONS,
  MAX_DURATION,
  MIN_DURATION,
  TIMER_IDS,
  type Durations
} from '@shared/types'

interface Settings {
  durations: Durations
}

// Saved as JSON in ~/Library/Application Support/Otium/config.json
const store = new Store<Settings>({
  defaults: { durations: DEFAULT_DURATIONS }
})

/** Keeps every duration a whole number of minutes within the allowed range. */
export function cleanDurations(input: Partial<Record<string, unknown>>): Durations {
  const out = { ...DEFAULT_DURATIONS }
  for (const id of TIMER_IDS) {
    const n = Math.round(Number(input[id]))
    if (Number.isFinite(n)) out[id] = Math.min(MAX_DURATION, Math.max(MIN_DURATION, n))
  }
  return out
}

export function getDurations(): Durations {
  return cleanDurations(store.get('durations') ?? {})
}

export function saveDurations(input: Partial<Record<string, unknown>>): Durations {
  const durations = cleanDurations(input)
  store.set('durations', durations)
  return durations
}

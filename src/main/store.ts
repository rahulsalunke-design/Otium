import Store from 'electron-store'
import {
  BUILT_IN_REMINDERS,
  DEFAULT_APPEARANCE,
  THEME_CHOICES,
  type Appearance,
  type ThemeChoice,
  DEFAULT_ICON,
  DEFAULT_SOUND,
  ICON_IDS,
  MAX_LABEL_LENGTH,
  MAX_MINUTES,
  MAX_REMINDERS,
  MIN_MINUTES,
  SOUND_IDS,
  type IconId,
  type Reminder,
  type SoundId
} from '@shared/types'

interface Settings {
  reminders: Reminder[]
  appearance: Appearance
  /** Start Otium when you log in to your Mac (on by default). */
  openAtLogin: boolean
  /** Old format (v1): minutes per built-in reminder. Migrated on first load. */
  durations?: Record<string, number>
}

// Saved as JSON in ~/Library/Application Support/Otium/config.json
const store = new Store<Settings>({
  defaults: { reminders: BUILT_IN_REMINDERS, appearance: DEFAULT_APPEARANCE, openAtLogin: true }
})

const ID_PATTERN = /^[A-Za-z0-9-]{1,64}$/

function cleanMinutes(value: unknown, fallback: number): number {
  const n = Math.round(Number(value))
  return Number.isFinite(n) ? Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, n)) : fallback
}

/** Unknown or missing sounds (e.g. reminders saved before sounds existed) get the default. */
function cleanSound(value: unknown, fallback: SoundId): SoundId {
  return SOUND_IDS.includes(value as SoundId) ? (value as SoundId) : fallback
}

/** Unknown or missing icons (e.g. reminders saved before icons existed) get the default. */
function cleanIcon(value: unknown, fallback: IconId): IconId {
  return ICON_IDS.includes(value as IconId) ? (value as IconId) : fallback
}

/**
 * Turns whatever was sent or saved into a safe list: every built-in reminder
 * present exactly once (with its own name), custom ones with a valid id and
 * name, minutes in range, and no more than MAX_REMINDERS in total.
 */
export function cleanReminders(input: unknown): Reminder[] {
  const items = Array.isArray(input) ? input : []
  const byId = new Map<string, Record<string, unknown>>()
  for (const item of items) {
    if (item && typeof item === 'object' && typeof item.id === 'string' && !byId.has(item.id)) {
      byId.set(item.id, item)
    }
  }

  const builtIns = BUILT_IN_REMINDERS.map((def) => {
    const saved = byId.get(def.id)
    return {
      ...def,
      minutes: cleanMinutes(saved?.minutes, def.minutes),
      enabled: typeof saved?.enabled === 'boolean' ? saved.enabled : def.enabled,
      sound: cleanSound(saved?.sound, def.sound),
      icon: cleanIcon(saved?.icon, def.icon)
    }
  })

  const builtInIds = new Set(BUILT_IN_REMINDERS.map((r) => r.id))
  const custom: Reminder[] = []
  for (const [id, item] of byId) {
    if (builtInIds.has(id) || !ID_PATTERN.test(id)) continue
    const label = typeof item.label === 'string' ? item.label.trim().slice(0, MAX_LABEL_LENGTH).trim() : ''
    if (!label) continue
    custom.push({
      id,
      label,
      minutes: cleanMinutes(item.minutes, 30),
      enabled: item.enabled !== false,
      builtIn: false,
      sound: cleanSound(item.sound, DEFAULT_SOUND),
      icon: cleanIcon(item.icon, DEFAULT_ICON)
    })
  }

  return [...builtIns, ...custom].slice(0, MAX_REMINDERS)
}

/** Carries intervals saved by v1 (`durations`) over to the reminders list. */
function migrate(): void {
  const old = store.get('durations')
  if (!old) return
  const reminders = store.get('reminders').map((r) =>
    r.builtIn && r.id in old ? { ...r, minutes: cleanMinutes(old[r.id], r.minutes) } : r
  )
  store.set('reminders', cleanReminders(reminders))
  store.delete('durations')
}

export function getReminders(): Reminder[] {
  migrate()
  return cleanReminders(store.get('reminders'))
}

export function saveReminders(input: unknown): Reminder[] {
  const reminders = cleanReminders(input)
  store.set('reminders', reminders)
  return reminders
}

/** Keeps the appearance settings to known values. */
export function cleanAppearance(input: unknown): Appearance {
  const a = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>
  return {
    theme: THEME_CHOICES.includes(a.theme as ThemeChoice) ? (a.theme as ThemeChoice) : DEFAULT_APPEARANCE.theme,
    glass: a.glass === true
  }
}

export function getAppearance(): Appearance {
  return cleanAppearance(store.get('appearance'))
}

export function saveAppearance(input: unknown): Appearance {
  const appearance = cleanAppearance(input)
  store.set('appearance', appearance)
  return appearance
}

export function getOpenAtLogin(): boolean {
  return store.get('openAtLogin') !== false
}

export function saveOpenAtLogin(on: boolean): void {
  store.set('openAtLogin', on)
}

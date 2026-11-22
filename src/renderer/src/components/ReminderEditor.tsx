import { useEffect, useRef, useState, type MutableRefObject } from 'react'
import {
  DEFAULT_ICON,
  DEFAULT_SOUND,
  ICONS,
  MAX_LABEL_LENGTH,
  MAX_MINUTES,
  MAX_REMINDERS,
  MIN_MINUTES,
  SOUNDS,
  type Reminder,
  type SoundId
} from '@shared/types'
import { PlayIcon, PlusIcon } from './Icons'
import { ReminderIcon } from './ReminderIcon'

/** What the header's Done button calls. */
export interface EditorApi {
  save: () => Promise<boolean>
}

interface Props {
  apiRef: MutableRefObject<EditorApi | null>
  /** Tells the header whether Done can be pressed (no errors). */
  onValidityChange: (ok: boolean) => void
}

/** A reminder while it's being edited: minutes stay as typed until Done. */
interface Draft extends Omit<Reminder, 'minutes'> {
  minutes: string
}

const STEP = 5
const toDraft = (r: Reminder): Draft => ({ ...r, minutes: String(r.minutes) })

function badMinutes(d: Draft): boolean {
  const n = Number(d.minutes)
  return d.minutes.trim() === '' || !Number.isInteger(n) || n < MIN_MINUTES || n > MAX_MINUTES
}

function badName(d: Draft): boolean {
  return !d.builtIn && d.label.trim() === ''
}

/**
 * Edit reminders: the main list in edit mode. One compact line per reminder;
 * clicking a line opens its details in place. Cancel discards, Done saves.
 */
export function ReminderEditor({ apiRef, onValidityChange }: Props) {
  const [drafts, setDrafts] = useState<Draft[] | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [focusId, setFocusId] = useState<string | null>(null)
  const nameRefs = useRef(new Map<string, HTMLInputElement>())

  useEffect(() => {
    window.otium.getReminders().then((list) => setDrafts(list.map(toDraft)))
  }, [])

  // Put the cursor in the name field of a reminder that was just added.
  useEffect(() => {
    if (!focusId) return
    nameRefs.current.get(focusId)?.focus()
    setFocusId(null)
  }, [focusId])

  const missingName = drafts?.some(badName) ?? false
  const wrongMinutes = drafts?.some(badMinutes) ?? false
  const ok = drafts !== null && !missingName && !wrongMinutes

  useEffect(() => onValidityChange(ok), [ok, onValidityChange])

  apiRef.current = {
    save: async () => {
      if (!drafts || !ok) return false
      await window.otium.setReminders(
        drafts.map((d) => ({ ...d, label: d.label.trim(), minutes: Number(d.minutes) }))
      )
      return true
    }
  }

  if (!drafts) return null

  const update = (id: string, patch: Partial<Draft>) =>
    setDrafts(drafts.map((d) => (d.id === id ? { ...d, ...patch } : d)))

  const step = (d: Draft, delta: number) => {
    const n = Number(d.minutes)
    const base = Number.isFinite(n) ? n : 30
    // Snap to the step grid (e.g. 47 → 50 or 45), within the allowed range.
    const next = delta > 0 ? Math.floor(base / STEP) * STEP + STEP : Math.ceil(base / STEP) * STEP - STEP
    update(d.id, { minutes: String(Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, next))) })
  }

  const add = () => {
    const id = crypto.randomUUID()
    setDrafts([
      ...drafts,
      { id, label: '', minutes: '30', enabled: true, builtIn: false, sound: DEFAULT_SOUND, icon: DEFAULT_ICON }
    ])
    setOpenId(id)
    setFocusId(id)
  }

  const remove = (id: string) => {
    setDrafts(drafts.filter((d) => d.id !== id))
    setOpenId(null)
  }

  const chooseSound = (id: string, sound: SoundId) => {
    update(id, { sound })
    window.otium.previewSound(sound) // hear it as you pick it
  }

  const atLimit = drafts.length >= MAX_REMINDERS

  const row = (d: Draft) => {
    const open = openId === d.id
    const name = d.label.trim() || 'New reminder'
    const invalid = badName(d) || badMinutes(d)
    return (
      <div key={d.id} className={`erow ${d.enabled ? '' : 'is-off'} ${open ? 'is-open' : ''} ${invalid ? 'is-invalid' : ''}`}>
        <div className="erow-line">
          <input
            type="checkbox"
            role="switch"
            className="switch"
            checked={d.enabled}
            onChange={(e) => update(d.id, { enabled: e.target.checked })}
            aria-label={`${name} on or off`}
          />
          <button
            type="button"
            className="erow-toggle"
            onClick={() => setOpenId(open ? null : d.id)}
            aria-expanded={open}
            aria-label={`${open ? 'Close' : 'Edit'} ${name}`}
          >
            <span className="erow-icon">
              <ReminderIcon icon={d.icon} size={15} />
            </span>
            <span className={`erow-name ${d.label.trim() ? '' : 'is-placeholder'}`}>{name}</span>
            <span className={`erow-min ${badMinutes(d) ? 'is-bad' : ''}`}>{d.minutes || '–'} min</span>
            <span className="erow-chev" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 3.5 4.5 4.5L6 12.5" />
              </svg>
            </span>
          </button>
        </div>

        {open && (
          <div className="erow-details">
            {!d.builtIn && (
              <label className="ed-line">
                <span>Name</span>
                <input
                  ref={(el) => {
                    if (el) nameRefs.current.set(d.id, el)
                    else nameRefs.current.delete(d.id)
                  }}
                  type="text"
                  className={`name-input ${badName(d) ? 'is-invalid' : ''}`}
                  value={d.label}
                  maxLength={MAX_LABEL_LENGTH}
                  placeholder="e.g. Stretch"
                  onChange={(e) => update(d.id, { label: e.target.value })}
                  aria-invalid={badName(d)}
                />
              </label>
            )}

            <div className="ed-line">
              <span>Repeat every</span>
              <span className={`stepper ${badMinutes(d) ? 'is-invalid' : ''}`}>
                <button type="button" onClick={() => step(d, -1)} aria-label="Fewer minutes">
                  −
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min={MIN_MINUTES}
                  max={MAX_MINUTES}
                  value={d.minutes}
                  onChange={(e) => update(d.id, { minutes: e.target.value })}
                  aria-label={`${name} interval in minutes`}
                  aria-invalid={badMinutes(d)}
                />
                <span className="stepper-unit">min</span>
                <button type="button" onClick={() => step(d, 1)} aria-label="More minutes">
                  +
                </button>
              </span>
            </div>

            <div className="ed-line">
              <span>Sound</span>
              <span className="ed-sound">
                <select
                  className="sound-select"
                  value={d.sound}
                  onChange={(e) => chooseSound(d.id, e.target.value as SoundId)}
                  aria-label={`${name} sound`}
                >
                  {SOUNDS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="icon-button small play"
                  onClick={() => window.otium.previewSound(d.sound)}
                  disabled={d.sound === 'none'}
                  aria-label={`Play ${name} sound`}
                  title="Play"
                >
                  <PlayIcon />
                </button>
              </span>
            </div>

            <div className="ed-sub">Icon</div>
            <div className="icon-grid" role="radiogroup" aria-label={`Icon for ${name}`}>
              {ICONS.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  role="radio"
                  aria-checked={d.icon === i.id}
                  className={`icon-choice ${d.icon === i.id ? 'is-selected' : ''}`}
                  onClick={() => update(d.id, { icon: i.id })}
                  aria-label={i.label}
                  title={i.label}
                >
                  <ReminderIcon icon={i.id} />
                </button>
              ))}
            </div>

            {d.builtIn ? (
              <p className="ed-note">Built-in reminders can be switched off but not deleted.</p>
            ) : (
              <button type="button" className="ed-delete" onClick={() => remove(d.id)}>
                Delete reminder
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="editor">
      <div className="elist">
        {drafts.map(row)}
        <button type="button" className="add-button" onClick={add} disabled={atLimit}>
          <PlusIcon />
          {atLimit ? `Up to ${MAX_REMINDERS} reminders` : 'Add reminder'}
        </button>
      </div>
      <p className={`hint ${ok ? '' : 'is-error'}`}>
        {missingName
          ? 'Give each new reminder a name.'
          : wrongMinutes
            ? `Use whole minutes between ${MIN_MINUTES} and ${MAX_MINUTES}.`
            : 'Click a reminder to change it. Changing an interval restarts it.'}
      </p>
    </div>
  )
}

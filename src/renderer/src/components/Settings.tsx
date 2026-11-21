import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  DEFAULT_ICON,
  DEFAULT_SOUND,
  ICONS,
  MAX_LABEL_LENGTH,
  MAX_MINUTES,
  MAX_REMINDERS,
  MIN_MINUTES,
  SOUNDS,
  type IconId,
  type Reminder,
  type SoundId
} from '@shared/types'
import { PlayIcon, PlusIcon, SpeakerIcon, TrashIcon } from './Icons'
import { ReminderIcon } from './ReminderIcon'

interface Props {
  onDone: () => void
}

/** A reminder while it's being edited: minutes stay as typed until Save. */
interface Draft extends Omit<Reminder, 'minutes'> {
  minutes: string
}

const toDraft = (r: Reminder): Draft => ({ ...r, minutes: String(r.minutes) })

function badMinutes(d: Draft): boolean {
  const n = Number(d.minutes)
  return d.minutes.trim() === '' || !Number.isInteger(n) || n < MIN_MINUTES || n > MAX_MINUTES
}

function badName(d: Draft): boolean {
  return !d.builtIn && d.label.trim() === ''
}

export function Settings({ onDone }: Props) {
  const [drafts, setDrafts] = useState<Draft[] | null>(null)
  const [saving, setSaving] = useState(false)
  const [focusId, setFocusId] = useState<string | null>(null)
  const [iconPickerFor, setIconPickerFor] = useState<string | null>(null)
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

  if (!drafts) return null

  const update = (id: string, patch: Partial<Draft>) =>
    setDrafts(drafts.map((d) => (d.id === id ? { ...d, ...patch } : d)))

  const add = () => {
    const id = crypto.randomUUID()
    setDrafts([...drafts, { id, label: '', minutes: '30', enabled: true, builtIn: false, sound: DEFAULT_SOUND, icon: DEFAULT_ICON }])
    setFocusId(id)
  }

  const remove = (id: string) => setDrafts(drafts.filter((d) => d.id !== id))

  const builtIns = drafts.filter((d) => d.builtIn)
  const custom = drafts.filter((d) => !d.builtIn)
  const atLimit = drafts.length >= MAX_REMINDERS
  const missingName = drafts.some(badName)
  const wrongMinutes = drafts.some(badMinutes)
  const hasError = missingName || wrongMinutes

  const save = async (e: FormEvent) => {
    e.preventDefault()
    if (hasError) return
    setSaving(true)
    await window.otium.setReminders(
      drafts.map((d) => ({ ...d, label: d.label.trim(), minutes: Number(d.minutes) }))
    )
    setSaving(false)
    onDone()
  }

  const chooseSound = (id: string, sound: SoundId) => {
    update(id, { sound })
    window.otium.previewSound(sound) // hear it as you pick it
  }

  const chooseIcon = (id: string, icon: IconId) => {
    update(id, { icon })
    setIconPickerFor(null)
  }

  const row = (d: Draft) => (
    <li key={d.id} className={`reminder-row ${d.enabled ? '' : 'is-off'}`}>
      <div className="reminder-main">
        <input
          type="checkbox"
          role="switch"
          className="switch"
          checked={d.enabled}
          onChange={(e) => update(d.id, { enabled: e.target.checked })}
          aria-label={`${d.label || 'New reminder'} on or off`}
        />

        <button
          type="button"
          className={`icon-pick ${iconPickerFor === d.id ? 'is-open' : ''}`}
          onClick={() => setIconPickerFor(iconPickerFor === d.id ? null : d.id)}
          aria-label={`Choose icon for ${d.label || 'new reminder'}`}
          aria-expanded={iconPickerFor === d.id}
          title="Choose icon"
        >
          <ReminderIcon icon={d.icon} />
        </button>

        {d.builtIn ? (
          <span className="reminder-name">{d.label}</span>
        ) : (
          <input
            ref={(el) => {
              if (el) nameRefs.current.set(d.id, el)
              else nameRefs.current.delete(d.id)
            }}
            type="text"
            className={`name-input ${badName(d) ? 'is-invalid' : ''}`}
            value={d.label}
            maxLength={MAX_LABEL_LENGTH}
            placeholder="Name, e.g. Stretch"
            onChange={(e) => update(d.id, { label: e.target.value })}
            aria-label="Reminder name"
            aria-invalid={badName(d)}
          />
        )}

        <input
          type="number"
          inputMode="numeric"
          className={`minutes-input ${badMinutes(d) ? 'is-invalid' : ''}`}
          min={MIN_MINUTES}
          max={MAX_MINUTES}
          step={1}
          value={d.minutes}
          onChange={(e) => update(d.id, { minutes: e.target.value })}
          aria-label={`${d.label || 'New reminder'} interval in minutes`}
          aria-invalid={badMinutes(d)}
        />

        {d.builtIn ? (
          <span className="row-action-spacer" />
        ) : (
          <button
            type="button"
            className="icon-button small"
            onClick={() => remove(d.id)}
            aria-label={`Delete ${d.label || 'new reminder'}`}
            title="Delete"
          >
            <TrashIcon />
          </button>
        )}
      </div>

      <div className="sound-line">
        <span className="sound-icon" aria-hidden="true">
          <SpeakerIcon />
        </span>
        <select
          className="sound-select"
          value={d.sound}
          onChange={(e) => chooseSound(d.id, e.target.value as SoundId)}
          aria-label={`${d.label || 'New reminder'} sound`}
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
          aria-label={`Play ${d.label || 'new reminder'} sound`}
          title="Play"
        >
          <PlayIcon />
        </button>
      </div>

      {iconPickerFor === d.id && (
        <div className="icon-grid" role="radiogroup" aria-label={`Icon for ${d.label || 'new reminder'}`}>
          {ICONS.map((i) => (
            <button
              key={i.id}
              type="button"
              role="radio"
              aria-checked={d.icon === i.id}
              className={`icon-choice ${d.icon === i.id ? 'is-selected' : ''}`}
              onClick={() => chooseIcon(d.id, i.id)}
              aria-label={i.label}
              title={i.label}
            >
              <ReminderIcon icon={i.id} />
            </button>
          ))}
        </div>
      )}
    </li>
  )

  return (
    <form className="settings" onSubmit={save}>
      <div className="group-header">
        <h2 className="group-title">Built-in</h2>
        <span className="column-label">Every (min)</span>
      </div>
      <ul className="reminder-list">{builtIns.map(row)}</ul>

      <div className="group-header">
        <h2 className="group-title">Your reminders</h2>
      </div>
      {custom.length > 0 ? (
        <ul className="reminder-list">{custom.map(row)}</ul>
      ) : (
        <p className="group-empty">Add your own, like Stretch or Take a walk.</p>
      )}

      <button type="button" className="add-button" onClick={add} disabled={atLimit}>
        <PlusIcon />
        {atLimit ? `Up to ${MAX_REMINDERS} reminders` : 'Add reminder'}
      </button>

      <p className={`hint ${hasError ? 'is-error' : ''}`}>
        {missingName
          ? 'Give each new reminder a name.'
          : wrongMinutes
            ? `Use whole minutes between ${MIN_MINUTES} and ${MAX_MINUTES}.`
            : 'Changing an interval restarts that reminder.'}
      </p>

      <div className="settings-actions">
        <button type="button" className="button" onClick={onDone}>
          Cancel
        </button>
        <button type="submit" className="button primary" disabled={saving || hasError}>
          Save
        </button>
      </div>
    </form>
  )
}

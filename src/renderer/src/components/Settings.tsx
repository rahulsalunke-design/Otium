import { useEffect, useState, type FormEvent } from 'react'
import { MAX_DURATION, MIN_DURATION, TIMER_COPY, TIMER_IDS, type Durations, type TimerId } from '@shared/types'

interface Props {
  onDone: () => void
}

type Draft = Record<TimerId, string>

export function Settings({ onDone }: Props) {
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    window.otium.getDurations().then((d) => {
      setDraft({ stand: String(d.stand), water: String(d.water), eyes: String(d.eyes) })
    })
  }, [])

  if (!draft) return null

  const invalid = TIMER_IDS.filter((id) => {
    const n = Number(draft[id])
    return !Number.isInteger(n) || n < MIN_DURATION || n > MAX_DURATION
  })

  const save = async (e: FormEvent) => {
    e.preventDefault()
    if (invalid.length) return
    setSaving(true)
    const durations = Object.fromEntries(TIMER_IDS.map((id) => [id, Number(draft[id])])) as Durations
    await window.otium.setDurations(durations)
    setSaving(false)
    onDone()
  }

  return (
    <form className="settings" onSubmit={save}>
      <p className="settings-intro">How often should each reminder come up?</p>

      {TIMER_IDS.map((id) => {
        const bad = invalid.includes(id)
        return (
          <label key={id} className={`field ${bad ? 'has-error' : ''}`}>
            <span className="field-label">{TIMER_COPY[id].label}</span>
            <span className="field-input">
              <input
                type="number"
                inputMode="numeric"
                min={MIN_DURATION}
                max={MAX_DURATION}
                step={1}
                value={draft[id]}
                onChange={(e) => setDraft({ ...draft, [id]: e.target.value })}
                aria-invalid={bad}
              />
              <span className="unit">min</span>
            </span>
          </label>
        )
      })}

      <p className={`hint ${invalid.length ? 'is-error' : ''}`}>
        {invalid.length
          ? `Use whole minutes between ${MIN_DURATION} and ${MAX_DURATION}.`
          : 'Changing an interval restarts that reminder.'}
      </p>

      <div className="settings-actions">
        <button type="button" className="button" onClick={onDone}>
          Cancel
        </button>
        <button type="submit" className="button primary" disabled={saving || invalid.length > 0}>
          Save
        </button>
      </div>
    </form>
  )
}

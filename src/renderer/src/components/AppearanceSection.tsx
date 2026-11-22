import { THEMES, themeForTime, type Appearance, type ThemeChoice } from '@shared/types'

interface Props {
  value: Appearance
  onChange: (next: Appearance) => void
}

const FOLLOW_DAY_SWATCH = 'conic-gradient(from 200deg, #fdf6f5 0 33%, #f7f7f5 0 66%, #221c22 0)'
const label = (id: string) => THEMES.find((t) => t.id === id)?.label ?? id

/** Theme swatches and Glass. Changes preview instantly; Save keeps them. */
export function AppearanceSection({ value, onChange }: Props) {
  const set = (patch: Partial<Appearance>) => onChange({ ...value, ...patch })

  const option = (id: ThemeChoice, name: string, background: string, accent?: string) => (
    <button
      key={id}
      type="button"
      role="radio"
      aria-checked={value.theme === id}
      className={`theme-opt ${value.theme === id ? 'is-selected' : ''}`}
      onClick={() => set({ theme: id })}
    >
      <span className="theme-dot" style={{ background }}>
        {accent && <span className="theme-accent" style={{ background: accent }} />}
      </span>
      <span className="theme-name">{name}</span>
    </button>
  )

  return (
    <div className="appearance">
      <div className="theme-grid" role="radiogroup" aria-label="Theme">
        {THEMES.map((t) =>
          option(
            t.id,
            t.label,
            `linear-gradient(135deg, ${t.swatch.light} 0 50%, ${t.swatch.dark} 50% 100%)`,
            t.swatch.accent
          )
        )}
        {option('follow-day', 'Follow day', FOLLOW_DAY_SWATCH)}
      </div>
      {value.theme === 'follow-day' && (
        <p className="hint">
          Dawn until 11:00, Sage until 17:00, then Dusk. Right now: {label(themeForTime(new Date()))}.
        </p>
      )}

      <label className="setting-line">
        <span>Glass background</span>
        <input
          type="checkbox"
          role="switch"
          className="switch"
          checked={value.glass}
          onChange={(e) => set({ glass: e.target.checked })}
        />
      </label>
    </div>
  )
}

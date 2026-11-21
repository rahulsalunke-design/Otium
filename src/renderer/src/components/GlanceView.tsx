import type { TimerAction, TimerSnapshot } from '@shared/types'
import { formatMinutes, progressOf, recentlyFired } from '../lib/time'
import { PauseIcon, PlayIcon } from './Icons'
import { ReminderIcon } from './ReminderIcon'

// Ring geometry (SVG units; the ring is drawn at 72x72 px).
const SIZE = 72
const STROKE = 5
const RADIUS = (SIZE - STROKE) / 2 - 1
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface Props {
  timers: TimerSnapshot[]
  onAction: (id: string, action: TimerAction) => void
}

/**
 * Glance view: a compact grid where each reminder is a ring around its icon.
 * The ring empties like a clock as the time runs down; the exact seconds live
 * in the List view.
 */
export function GlanceView({ timers, onAction }: Props) {
  return (
    <div className="glance-grid">
      {timers.map((t) => (
        <GlanceTile key={t.id} timer={t} onAction={(action) => onAction(t.id, action)} />
      ))}
    </div>
  )
}

function GlanceTile({ timer: t, onAction }: { timer: TimerSnapshot; onAction: (a: TimerAction) => void }) {
  const running = t.status === 'running'
  const progress = progressOf(t)
  const status = t.status === 'paused' ? 'Paused' : t.status === 'stopped' ? 'Stopped' : formatMinutes(t.remainingMs)
  const fired = recentlyFired(t)

  return (
    <section
      className={`glance-tile ${running ? '' : 'is-idle'}`}
      aria-label={`${t.label}, ${running ? `${formatMinutes(t.remainingMs)} left` : status.toLowerCase()}`}
    >
      <div className="ring-wrap">
        <svg className="ring" viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
          <circle className="ring-track" cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} strokeWidth={STROKE} />
          <circle
            className="ring-fill"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </svg>
        <span className="ring-icon">
          <ReminderIcon icon={t.icon} size={26} />
        </span>
        {/* Shows on hover or keyboard focus, in place of the icon. */}
        <button
          type="button"
          className="ring-action"
          onClick={() => onAction(running ? 'pause' : 'start')}
          aria-label={`${running ? 'Pause' : 'Start'} ${t.label}`}
          title={running ? 'Pause' : 'Start'}
        >
          {running ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      <div className="glance-label" title={t.label}>
        {t.label}
      </div>
      {fired ? (
        <button type="button" className="text-button glance-snooze" onClick={() => onAction('snooze')}>
          Snooze
        </button>
      ) : (
        <div className="glance-time">{status}</div>
      )}
    </section>
  )
}

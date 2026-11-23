import type { TimerAction, TimerSnapshot } from '@shared/types'
import { formatCountdown, progressOf, recentlyFired } from '../lib/time'
import { PauseIcon, PlayIcon, ResetIcon } from './Icons'
import { ReminderIcon } from './ReminderIcon'

// Ring gauge geometry (SVG units; drawn at 30x30 px).
const SIZE = 30
const STROKE = 3
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
/** How long a row glows after its reminder goes off. */
const GLOW_MS = 2500

interface Props {
  timers: TimerSnapshot[]
  onAction: (id: string, action: TimerAction) => void
}

/**
 * List view: one compact row per reminder. A ring gauge with the reminder's
 * icon, its name, the countdown and pause/play. Hovering (or tabbing into) a
 * row opens a second line with how often it repeats and Snooze (it stays open
 * after a reminder goes off). Reset sits beside pause/play on every row.
 */
export function ListView({ timers, onAction }: Props) {
  return (
    <div className="list-wrap">
      <div className="list">
        {timers.map((t) => (
          <ListRow key={t.id} timer={t} onAction={(action) => onAction(t.id, action)} />
        ))}
      </div>
    </div>
  )
}

function detailLine(t: TimerSnapshot): string {
  const minutes = Math.round(t.durationMs / 60_000)
  const prefix = t.status === 'paused' ? 'Paused · ' : t.status === 'stopped' ? 'Stopped · ' : t.snoozed ? 'Snoozed · ' : ''
  return `${prefix}every ${minutes} min`
}

function ListRow({ timer: t, onAction }: { timer: TimerSnapshot; onAction: (a: TimerAction) => void }) {
  const running = t.status === 'running'
  const offered = recentlyFired(t)
  const justFired = t.lastFiredAt !== null && Date.now() - t.lastFiredAt < GLOW_MS

  return (
    <section
      className={`lrow ${running ? '' : 'is-idle'} ${offered ? 'is-offered' : ''} ${justFired ? 'just-fired' : ''}`}
      aria-label={t.label}
    >
      <span className="lring" aria-hidden="true">
        <svg className="lring-gauge" viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
          <circle className="lring-track" cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} strokeWidth={STROKE} />
          <circle
            className="lring-fill"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progressOf(t))}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </svg>
        <span className="lring-icon">
          <ReminderIcon icon={t.icon} size={14} />
        </span>
      </span>

      <span className="lrow-name" title={t.label}>
        {t.label}
      </span>

      <span className="lrow-time" role="timer" aria-live="off">
        {formatCountdown(t.remainingMs)}
      </span>

      <div className="lrow-actions">
        <button
          type="button"
          className="lrow-reset"
          onClick={() => onAction('reset')}
          aria-label={`Reset ${t.label}`}
          title="Reset"
        >
          <ResetIcon />
        </button>
        <button
          type="button"
          className="lrow-toggle"
          onClick={() => onAction(running ? 'pause' : 'start')}
          aria-label={`${running ? 'Pause' : 'Start'} ${t.label}`}
          title={running ? 'Pause' : 'Start'}
        >
          {running ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      <div className="lrow-detail">
        <span>{detailLine(t)}</span>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          className="lrow-snooze"
          onClick={() => onAction('snooze')}
          title="Remind me again in 5 minutes"
          aria-label={`Snooze ${t.label} for 5 minutes`}
        >
          Snooze 5 min
        </button>
      </div>
    </section>
  )
}

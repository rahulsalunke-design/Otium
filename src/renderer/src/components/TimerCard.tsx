import { SNOOZE_MINUTES, type TimerAction, type TimerSnapshot } from '@shared/types'
import { formatCountdown, progressOf, recentlyFired } from '../lib/time'
import { PauseIcon, PlayIcon, ResetIcon } from './Icons'
import { ReminderIcon } from './ReminderIcon'

const clock = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })

function statusLine(t: TimerSnapshot): string {
  if (t.status === 'paused') return 'Paused'
  if (t.status === 'stopped') return 'Not running'
  const at = t.endsAt ? clock.format(t.endsAt) : ''
  return t.snoozed ? `Snoozed · back at ${at}` : `Next at ${at}`
}

interface Props {
  timer: TimerSnapshot
  onAction: (action: TimerAction) => void
}

/** List view: one full card per reminder, with the exact countdown. */
export function TimerCard({ timer: t, onAction }: Props) {
  const running = t.status === 'running'
  const minutes = Math.round(t.durationMs / 60_000)

  return (
    <section className={`card ${running ? '' : 'is-idle'}`} aria-label={t.label}>
      <div className="card-top">
        <div className="card-heading">
          <span className="card-icon">
            <ReminderIcon icon={t.icon} size={15} />
          </span>
          <h2 title={t.label}>{t.label}</h2>
          <span className="every">every {minutes} min</span>
        </div>
        <div className="card-buttons">
          <button
            type="button"
            className="icon-button"
            onClick={() => onAction('reset')}
            aria-label={`Reset ${t.label}`}
            title="Reset"
          >
            <ResetIcon />
          </button>
          <button
            type="button"
            className="icon-button primary"
            onClick={() => onAction(running ? 'pause' : 'start')}
            aria-label={`${running ? 'Pause' : 'Start'} ${t.label}`}
            title={running ? 'Pause' : 'Start'}
          >
            {running ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
      </div>

      <div className="countdown" role="timer" aria-live="off">
        {formatCountdown(t.remainingMs)}
      </div>

      <div className="progress" aria-hidden="true">
        <div className="progress-fill" style={{ transform: `scaleX(${progressOf(t)})` }} />
      </div>

      <div className="card-bottom">
        <span className="status">{statusLine(t)}</span>
        {recentlyFired(t) && (
          <button type="button" className="text-button" onClick={() => onAction('snooze')}>
            Snooze {SNOOZE_MINUTES} min
          </button>
        )}
      </div>
    </section>
  )
}

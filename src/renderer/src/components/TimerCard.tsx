import { SNOOZE_MINUTES, SNOOZE_OFFER_MS, TIMER_COPY, type TimerAction, type TimerSnapshot } from '@shared/types'
import { PauseIcon, PlayIcon, ResetIcon } from './Icons'

function formatCountdown(ms: number): string {
  const total = Math.ceil(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const clock = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })

function statusLine(t: TimerSnapshot): string {
  if (t.status === 'paused') return 'Paused'
  if (t.status === 'stopped') return 'Not running'
  const at = t.endsAt ? clock.format(t.endsAt) : ''
  return t.snoozed ? `Snoozed · back at ${at}` : `Next at ${at}`
}

function recentlyFired(t: TimerSnapshot): boolean {
  return t.lastFiredAt !== null && Date.now() - t.lastFiredAt < SNOOZE_OFFER_MS
}

interface Props {
  timer: TimerSnapshot
  onAction: (action: TimerAction) => void
}

export function TimerCard({ timer: t, onAction }: Props) {
  const copy = TIMER_COPY[t.id]
  const running = t.status === 'running'
  const progress = t.cycleMs > 0 ? Math.min(1, Math.max(0, t.remainingMs / t.cycleMs)) : 0
  const minutes = Math.round(t.durationMs / 60_000)

  return (
    <section className={`card ${running ? '' : 'is-idle'}`} aria-label={copy.label}>
      <div className="card-top">
        <div className="card-heading">
          <h2>{copy.label}</h2>
          <span className="every">every {minutes} min</span>
        </div>
        <div className="card-buttons">
          <button
            type="button"
            className="icon-button"
            onClick={() => onAction('reset')}
            aria-label={`Reset ${copy.label}`}
            title="Reset"
          >
            <ResetIcon />
          </button>
          <button
            type="button"
            className="icon-button primary"
            onClick={() => onAction(running ? 'pause' : 'start')}
            aria-label={`${running ? 'Pause' : 'Start'} ${copy.label}`}
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
        <div className="progress-fill" style={{ transform: `scaleX(${progress})` }} />
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

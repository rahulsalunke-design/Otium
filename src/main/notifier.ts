import { Notification } from 'electron'
import { BUILT_IN_COPY, SNOOZE_MINUTES, type TimerSnapshot } from '@shared/types'

interface NotifierOptions {
  onSnooze: (id: string) => void
  onClick: () => void
}

/** Built-in reminders have their own wording; custom ones use their name. */
function copyFor(timer: TimerSnapshot): { title: string; body: string } {
  const builtIn = timer.builtIn ? BUILT_IN_COPY[timer.id] : undefined
  if (builtIn) return builtIn
  const minutes = Math.round(timer.durationMs / 60_000)
  return { title: timer.label, body: `It's been ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}.` }
}

/** Shows the macOS notification when a reminder goes off. */
export function createNotifier({ onSnooze, onClick }: NotifierOptions) {
  // Hold a reference to each notification, otherwise it can be cleaned up from
  // memory and its buttons stop responding.
  const live = new Map<string, Notification>()

  return function notify(timer: TimerSnapshot): void {
    if (!Notification.isSupported()) return

    const { id } = timer
    live.get(id)?.close()
    const n = new Notification({
      ...copyFor(timer),
      silent: false,
      actions: [{ type: 'button', text: `Snooze ${SNOOZE_MINUTES} min` }]
    })
    n.on('action', () => onSnooze(id))
    n.on('click', onClick)
    n.on('close', () => {
      if (live.get(id) === n) live.delete(id)
    })
    live.set(id, n)
    n.show()
  }
}

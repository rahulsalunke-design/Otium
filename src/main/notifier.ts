import { Notification } from 'electron'
import { SNOOZE_MINUTES, TIMER_COPY, type TimerId } from '@shared/types'

interface NotifierOptions {
  onSnooze: (id: TimerId) => void
  onClick: () => void
}

/** Shows the macOS notification when a reminder goes off. */
export function createNotifier({ onSnooze, onClick }: NotifierOptions) {
  // Hold a reference to each notification, otherwise it can be cleaned up from
  // memory and its buttons stop responding.
  const live = new Map<TimerId, Notification>()

  return function notify(id: TimerId): void {
    if (!Notification.isSupported()) return

    live.get(id)?.close()
    const copy = TIMER_COPY[id]
    const n = new Notification({
      title: copy.title,
      body: copy.body,
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

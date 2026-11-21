import { app } from 'electron'
import { TIMER_IDS } from '@shared/types'
import { TimerEngine } from './timers'
import { createTray } from './tray'
import { createNotifier } from './notifier'
import { registerIpc } from './ipc'
import { getDurations } from './store'

// Only one copy of Otium at a time.
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  // Keep a reference so the menu bar icon isn't cleaned up from memory.
  let tray: ReturnType<typeof createTray> | null = null

  app.whenReady().then(() => {
    app.dock?.hide() // menu bar only

    const engine = new TimerEngine(getDurations())
    tray = createTray()
    const { panel, showPanel } = tray

    const notify = createNotifier({
      onSnooze: (id) => engine.snooze(id),
      onClick: showPanel
    })
    engine.on('fired', (id) => notify(id))
    // v2: a full-screen break overlay would also listen to 'fired' here.

    registerIpc(engine, panel)

    // Reminders start on their own: a break app you have to remember to start isn't much help.
    for (const id of TIMER_IDS) engine.start(id)
    engine.begin()

    app.on('second-instance', showPanel)
    app.on('before-quit', () => engine.stop())
  })

  // Closing the panel never quits the app; only "Quit Otium" does.
  app.on('window-all-closed', () => {})
}

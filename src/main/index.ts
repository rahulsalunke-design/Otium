import { app } from 'electron'
import { TimerEngine } from './timers'
import { createTray, setGlass } from './tray'
import { createNotifier } from './notifier'
import { registerIpc } from './ipc'
import { getAppearance, getReminders } from './store'
import { playSound } from './sounds'
import { applyOpenAtLogin } from './login'

// Only one copy of Otium at a time.
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  // Keep a reference so the menu bar icon isn't cleaned up from memory.
  let tray: ReturnType<typeof createTray> | null = null

  app.whenReady().then(() => {
    app.dock?.hide() // menu bar only
    applyOpenAtLogin()

    const engine = new TimerEngine()
    tray = createTray()
    const { panel, showPanel } = tray

    const notify = createNotifier({
      onSnooze: (id) => {
        if (engine.has(id)) engine.snooze(id)
      },
      onClick: showPanel
    })
    engine.on('fired', (timer) => {
      notify(timer)
      playSound(timer.sound)
    })
    // v2: a full-screen break overlay would also listen to 'fired' here.

    registerIpc(engine, panel)
    setGlass(panel, getAppearance().glass)

    // Switched-on reminders start on their own (a break app you have to remember
    // to start isn't much help), unless set to wait for ▶.
    engine.setReminders(getReminders(), { atLaunch: true })
    engine.begin()

    app.on('second-instance', showPanel)
    app.on('before-quit', () => engine.stop())
  })

  // Closing the panel never quits the app; only "Quit Otium" does.
  app.on('window-all-closed', () => {})
}

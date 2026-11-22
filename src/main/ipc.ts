import { BrowserWindow, app, ipcMain } from 'electron'
import { IPC, SOUND_IDS, type SoundId, type TimerAction } from '@shared/types'
import type { TimerEngine } from './timers'
import { getAppearance, getReminders, saveAppearance, saveReminders } from './store'
import { setGlass } from './tray'
import { playSound } from './sounds'

const ACTIONS: TimerAction[] = ['start', 'pause', 'reset', 'snooze']
const MAX_PANEL_HEIGHT = 640

/** Answers requests from the panel. Everything arriving here is checked first. */
export function registerIpc(engine: TimerEngine, panel: BrowserWindow): void {
  ipcMain.handle(IPC.getTimers, () => engine.snapshot())

  ipcMain.handle(IPC.timerAction, (_e, id: unknown, action: unknown) => {
    if (typeof id !== 'string' || !engine.has(id) || !ACTIONS.includes(action as TimerAction)) return
    engine[action as TimerAction](id)
  })

  ipcMain.handle(IPC.getReminders, () => getReminders())

  ipcMain.handle(IPC.setReminders, (_e, input: unknown) => {
    const reminders = saveReminders(input)
    engine.setReminders(reminders)
    return reminders
  })

  ipcMain.handle(IPC.getAppearance, () => getAppearance())

  ipcMain.handle(IPC.setAppearance, (_e, input: unknown) => {
    const appearance = saveAppearance(input)
    setGlass(panel, appearance.glass)
    return appearance
  })

  ipcMain.on(IPC.previewSound, (_e, sound: unknown) => {
    if (SOUND_IDS.includes(sound as SoundId)) playSound(sound as SoundId)
  })

  ipcMain.on(IPC.resizePanel, (_e, height: unknown) => {
    const h = Math.round(Number(height))
    if (!Number.isFinite(h) || h < 100) return
    const [width] = panel.getContentSize()
    panel.setContentSize(width, Math.min(h, MAX_PANEL_HEIGHT), false)
  })

  ipcMain.on(IPC.quit, () => app.quit())

  // Push live countdowns to the panel, but only while it is open.
  engine.on('change', (timers) => {
    if (panel.isVisible() && !panel.webContents.isDestroyed()) {
      panel.webContents.send(IPC.timersUpdate, timers)
    }
  })
  panel.on('show', () => panel.webContents.send(IPC.timersUpdate, engine.snapshot()))
}

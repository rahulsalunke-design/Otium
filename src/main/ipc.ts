import { BrowserWindow, app, ipcMain } from 'electron'
import { IPC, TIMER_IDS, type TimerAction, type TimerId } from '@shared/types'
import type { TimerEngine } from './timers'
import { getDurations, saveDurations } from './store'

const ACTIONS: TimerAction[] = ['start', 'pause', 'reset', 'snooze']
const MAX_PANEL_HEIGHT = 640

/** Answers requests from the panel. Everything arriving here is checked first. */
export function registerIpc(engine: TimerEngine, panel: BrowserWindow): void {
  ipcMain.handle(IPC.getTimers, () => engine.snapshot())

  ipcMain.handle(IPC.timerAction, (_e, id: unknown, action: unknown) => {
    if (!TIMER_IDS.includes(id as TimerId) || !ACTIONS.includes(action as TimerAction)) return
    engine[action as TimerAction](id as TimerId)
  })

  ipcMain.handle(IPC.getDurations, () => getDurations())

  ipcMain.handle(IPC.setDurations, (_e, input: unknown) => {
    const durations = saveDurations(typeof input === 'object' && input ? input : {})
    engine.setDurations(durations)
    return durations
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

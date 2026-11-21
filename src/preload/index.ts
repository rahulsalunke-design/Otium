import { contextBridge, ipcRenderer } from 'electron'
import { IPC, type OtiumApi, type TimerSnapshot } from '@shared/types'

// The only doorway between the panel and the engine.
const api: OtiumApi = {
  getTimers: () => ipcRenderer.invoke(IPC.getTimers),
  timerAction: (id, action) => ipcRenderer.invoke(IPC.timerAction, id, action),
  onTimers: (listener) => {
    const handler = (_e: unknown, timers: TimerSnapshot[]) => listener(timers)
    ipcRenderer.on(IPC.timersUpdate, handler)
    return () => ipcRenderer.removeListener(IPC.timersUpdate, handler)
  },
  getDurations: () => ipcRenderer.invoke(IPC.getDurations),
  setDurations: (durations) => ipcRenderer.invoke(IPC.setDurations, durations),
  resizePanel: (height) => ipcRenderer.send(IPC.resizePanel, height),
  quit: () => ipcRenderer.send(IPC.quit)
}

contextBridge.exposeInMainWorld('otium', api)

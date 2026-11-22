import { app } from 'electron'
import { getOpenAtLogin, saveOpenAtLogin } from './store'

/**
 * Open at Login: macOS starts Otium when you log in. Only the installed app
 * registers itself; the development build never does.
 */
export function applyOpenAtLogin(): void {
  if (!app.isPackaged) return
  app.setLoginItemSettings({ openAtLogin: getOpenAtLogin() })
}

export function setOpenAtLogin(on: boolean): void {
  saveOpenAtLogin(on)
  applyOpenAtLogin()
}

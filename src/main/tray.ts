import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { BrowserWindow, Menu, Tray, app, nativeImage, nativeTheme, screen, shell } from 'electron'
import trayIcon from '../../resources/trayTemplate.png?asset'
import trayIcon2x from '../../resources/trayTemplate@2x.png?asset'
import { getOpenAtLogin } from './store'
import { setOpenAtLogin } from './login'

const PANEL_WIDTH = 320
const INITIAL_HEIGHT = 460
const GAP = 6

/** The menu bar icon and the little panel that drops down from it. */
export function createTray(): { tray: Tray; panel: BrowserWindow; showPanel: () => void } {
  const panel = new BrowserWindow({
    width: PANEL_WIDTH,
    height: INITIAL_HEIGHT,
    show: false,
    frame: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    hasShadow: true,
    // Match the panel colour so there is no white flash in dark mode.
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#1c1c1e' : '#f7f7f5',
    webPreferences: {
      preload: join(import.meta.dirname, '../preload/index.cjs'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false
    },
    // Keep the Glass blur looking active even when the panel isn't focused.
    visualEffectState: 'active'
  })
  panel.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  // Links open in the browser, never inside the panel.
  panel.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url)
    return { action: 'deny' }
  })
  panel.webContents.on('will-navigate', (e) => e.preventDefault())

  if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) {
    panel.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    panel.loadFile(join(import.meta.dirname, '../renderer/index.html'))
  }

  const icon = nativeImage.createFromPath(trayIcon)
  icon.addRepresentation({ scaleFactor: 2, buffer: readFileSync(trayIcon2x) })
  icon.setTemplateImage(true) // macOS colours it to match the menu bar

  const tray = new Tray(icon)
  tray.setToolTip('Otium')

  // Clicking the icon while the panel is open first blurs (hides) the panel,
  // then fires the click. Remember when we hid so that click doesn't reopen it.
  let hiddenAt = 0
  panel.on('blur', () => {
    if (!panel.webContents.isDevToolsOpened()) {
      panel.hide()
      hiddenAt = Date.now()
    }
  })

  const showPanel = () => {
    const trayBounds = tray.getBounds()
    const { width, height } = panel.getBounds()
    const display = screen.getDisplayNearestPoint({ x: trayBounds.x, y: trayBounds.y })
    const area = display.workArea
    const x = Math.round(
      Math.min(
        Math.max(trayBounds.x + trayBounds.width / 2 - width / 2, area.x + GAP),
        area.x + area.width - width - GAP
      )
    )
    const y = Math.round(
      Math.min(trayBounds.y + trayBounds.height + GAP, area.y + area.height - height - GAP)
    )
    panel.setPosition(x, Math.max(y, area.y + GAP), false)
    panel.show()
    panel.focus()
  }

  const togglePanel = () => {
    if (panel.isVisible()) panel.hide()
    else if (Date.now() - hiddenAt > 250) showPanel()
  }

  // Built each time it opens, so the Open at Login tick is always current.
  const buildMenu = () =>
    Menu.buildFromTemplate([
      { label: 'Open Otium', click: showPanel },
      { type: 'separator' },
      {
        label: 'Open at Login',
        type: 'checkbox',
        checked: getOpenAtLogin(),
        enabled: app.isPackaged, // only the installed app can start at login
        click: (item) => setOpenAtLogin(item.checked)
      },
      { type: 'separator' },
      { label: 'Quit Otium', accelerator: 'Command+Q', click: () => app.quit() }
    ])

  tray.on('click', togglePanel)
  tray.on('right-click', () => tray.popUpContextMenu(buildMenu()))

  return { tray, panel, showPanel }
}

/**
 * Glass: macOS's own frosted blur behind the panel (like Control Center).
 * The page then draws its colours semi-transparently on top.
 */
export function setGlass(panel: BrowserWindow, on: boolean): void {
  if (on) {
    panel.setBackgroundColor('#00000000')
    panel.setVibrancy('popover')
  } else {
    panel.setVibrancy(null)
    panel.setBackgroundColor(nativeTheme.shouldUseDarkColors ? '#1c1c1e' : '#f7f7f5')
  }
}

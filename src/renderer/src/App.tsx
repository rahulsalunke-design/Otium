import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import type { PanelView } from '@shared/types'
import { useTimers } from './hooks/useTimers'
import { ListView } from './components/ListView'
import { GlanceView } from './components/GlanceView'
import { Settings } from './components/Settings'
import { BackIcon, PowerIcon, SettingsIcon } from './components/Icons'

type View = 'timers' | 'settings'

const VIEW_KEY = 'otium.panelView'

/** The last chosen view (List or Glance). A per-Mac convenience, so storage failures are fine. */
function loadPanelView(): PanelView {
  try {
    return localStorage.getItem(VIEW_KEY) === 'glance' ? 'glance' : 'list'
  } catch {
    return 'list'
  }
}

function savePanelView(view: PanelView): void {
  try {
    localStorage.setItem(VIEW_KEY, view)
  } catch {
    // ignore: the view just won't be remembered
  }
}

export function App() {
  const timers = useTimers()
  const [view, setView] = useState<View>('timers')
  const [panelView, setPanelView] = useState<PanelView>(loadPanelView)
  const headerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Fit the window to whatever is showing. Measures the full content height
  // (not the visible part), so the window can grow back after it was capped
  // and started scrolling.
  useLayoutEffect(() => {
    const parts = [headerRef.current, contentRef.current]
    if (parts.some((el) => !el)) return
    const report = () =>
      window.otium.resizePanel(parts.reduce((sum, el) => sum + (el?.offsetHeight ?? 0), 0))
    const observer = new ResizeObserver(report)
    parts.forEach((el) => observer.observe(el!))
    return () => observer.disconnect()
  }, [])

  // When the panel closes, let go of focus. Otherwise macOS hands focus back to
  // the last clicked button on reopen and it shows a keyboard focus ring.
  useEffect(() => {
    const dropFocus = () => (document.activeElement as HTMLElement | null)?.blur()
    window.addEventListener('blur', dropFocus)
    return () => window.removeEventListener('blur', dropFocus)
  }, [])

  const choosePanelView = (next: PanelView) => {
    setPanelView(next)
    savePanelView(next)
  }

  const viewToggle = (
    <div className="view-toggle" role="radiogroup" aria-label="View">
      <button
        type="button"
        role="radio"
        aria-checked={panelView === 'list'}
        className={panelView === 'list' ? 'is-selected' : ''}
        onClick={() => choosePanelView('list')}
        aria-label="List view"
        title="List: full details"
      >
        <List size={14} strokeWidth={1.75} aria-hidden="true" />
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={panelView === 'glance'}
        className={panelView === 'glance' ? 'is-selected' : ''}
        onClick={() => choosePanelView('glance')}
        aria-label="Glance view"
        title="Glance: icons and rings"
      >
        <LayoutGrid size={14} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  )

  const quitButton = (
    <button
      type="button"
      className="icon-button"
      onClick={() => window.otium.quit()}
      aria-label="Quit Otium"
      title="Quit Otium"
    >
      <PowerIcon />
    </button>
  )

  return (
    <div className="panel">
      <header className="header" ref={headerRef}>
        {view === 'timers' ? (
          <>
            <h1 className="wordmark">Otium</h1>
            <div className="header-actions">
              {viewToggle}
              <button
                type="button"
                className="icon-button"
                onClick={() => setView('settings')}
                aria-label="Settings"
                title="Settings"
              >
                <SettingsIcon />
              </button>
              {quitButton}
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              className="icon-button"
              onClick={() => setView('timers')}
              aria-label="Back to timers"
              title="Back"
            >
              <BackIcon />
            </button>
            <h1 className="header-title">Settings</h1>
            {quitButton}
          </>
        )}
      </header>

      <main className="scroll">
        <div className="content" ref={contentRef}>
          {view === 'settings' ? (
            <Settings onDone={() => setView('timers')} />
          ) : timers === null ? null : timers.length === 0 ? (
            <div className="empty">
              <p className="empty-title">All reminders are off</p>
              <p className="empty-body">Switch some on, or add your own, in Settings.</p>
              <button type="button" className="button" onClick={() => setView('settings')}>
                Open Settings
              </button>
            </div>
          ) : panelView === 'glance' ? (
            <GlanceView timers={timers} onAction={(id, action) => window.otium.timerAction(id, action)} />
          ) : (
            <ListView timers={timers} onAction={(id, action) => window.otium.timerAction(id, action)} />
          )}
        </div>
      </main>
    </div>
  )
}

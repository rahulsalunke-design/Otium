import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { LayoutGrid, List, Palette, Pencil } from 'lucide-react'
import { DEFAULT_APPEARANCE, themeForTime, type Appearance, type PanelView } from '@shared/types'
import { useTimers } from './hooks/useTimers'
import { ListView } from './components/ListView'
import { GlanceView } from './components/GlanceView'
import { ReminderEditor } from './components/ReminderEditor'
import { AppearanceSection } from './components/AppearanceSection'
import { BackIcon, PowerIcon } from './components/Icons'

/** timers: the main panel · edit: Edit reminders · appearance: the look. */
type View = 'timers' | 'edit' | 'appearance'

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

/** Puts the appearance on <html> so the theme and Glass styles apply. */
function applyAppearance(a: Appearance, now: Date): void {
  const root = document.documentElement
  root.dataset.theme = a.theme === 'follow-day' ? themeForTime(now) : a.theme
  if (a.glass) root.dataset.glass = ''
  else delete root.dataset.glass
}

const ICON = { size: 15, strokeWidth: 1.75, 'aria-hidden': true } as const

export function App() {
  const timers = useTimers()
  const [view, setView] = useState<View>('timers')
  const [panelView, setPanelView] = useState<PanelView>(loadPanelView)
  const [appearance, setAppearance] = useState<Appearance>(DEFAULT_APPEARANCE)
  const [minute, setMinute] = useState(() => Math.floor(Date.now() / 60_000))
  const headerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.otium.getAppearance().then(setAppearance)
  }, [])

  // "Follow the day" re-checks the time every minute.
  useEffect(() => {
    const id = setInterval(() => setMinute(Math.floor(Date.now() / 60_000)), 15_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    applyAppearance(appearance, new Date())
  }, [appearance, minute])

  // Appearance changes apply and save straight away.
  const changeAppearance = (a: Appearance) => {
    setAppearance(a)
    window.otium.setAppearance(a)
  }

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

  // Edit reminders and Appearance share a simple header: Back, title, Quit.
  // Both save as you go, so there's nothing to confirm on the way out.
  const backHeader = (title: string) => (
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
      <h1 className="header-title">{title}</h1>
      {quitButton}
    </>
  )

  let header
  if (view === 'edit') {
    header = backHeader('Edit reminders')
  } else if (view === 'appearance') {
    header = backHeader('Appearance')
  } else {
    header = (
      <>
        <h1 className="wordmark">Otium</h1>
        <div className="header-actions">
          {viewToggle}
          <button
            type="button"
            className="icon-button"
            onClick={() => setView('edit')}
            aria-label="Edit reminders"
            title="Edit reminders"
          >
            <Pencil {...ICON} size={14} />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={() => setView('appearance')}
            aria-label="Appearance"
            title="Appearance"
          >
            <Palette {...ICON} />
          </button>
          {quitButton}
        </div>
      </>
    )
  }

  return (
    <div className="panel">
      <header className="header" ref={headerRef}>
        {header}
      </header>

      <main className="scroll">
        <div className="content" ref={contentRef}>
          {view === 'edit' ? (
            <ReminderEditor />
          ) : view === 'appearance' ? (
            <div className="appearance-card">
              <AppearanceSection value={appearance} onChange={changeAppearance} />
              <p className="hint">Changes apply straight away.</p>
            </div>
          ) : timers === null ? null : timers.length === 0 ? (
            <div className="empty">
              <p className="empty-title">All reminders are off</p>
              <p className="empty-body">Switch some on, or add your own.</p>
              <button type="button" className="button" onClick={() => setView('edit')}>
                Edit reminders
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

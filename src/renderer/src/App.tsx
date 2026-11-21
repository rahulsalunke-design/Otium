import { useLayoutEffect, useRef, useState } from 'react'
import { useTimers } from './hooks/useTimers'
import { TimerCard } from './components/TimerCard'
import { Settings } from './components/Settings'
import { BackIcon, SettingsIcon } from './components/Icons'

type View = 'timers' | 'settings'

export function App() {
  const timers = useTimers()
  const [view, setView] = useState<View>('timers')
  const rootRef = useRef<HTMLDivElement>(null)

  // Fit the window to whatever is showing.
  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const observer = new ResizeObserver(() => window.pause.resizePanel(el.offsetHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="panel" ref={rootRef}>
      <header className="header">
        {view === 'timers' ? (
          <>
            <h1 className="wordmark">Pause</h1>
            <button
              type="button"
              className="icon-button"
              onClick={() => setView('settings')}
              aria-label="Settings"
              title="Settings"
            >
              <SettingsIcon />
            </button>
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
            <span className="header-spacer" />
          </>
        )}
      </header>

      <main>
        {view === 'timers' ? (
          <div className="cards">
            {timers.map((t) => (
              <TimerCard key={t.id} timer={t} onAction={(action) => window.pause.timerAction(t.id, action)} />
            ))}
          </div>
        ) : (
          <Settings onDone={() => setView('timers')} />
        )}
      </main>

      <footer className="footer">
        <button type="button" className="text-button muted" onClick={() => window.pause.quit()}>
          Quit Pause
        </button>
      </footer>
    </div>
  )
}

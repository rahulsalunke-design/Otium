import { useLayoutEffect, useRef, useState } from 'react'
import { useTimers } from './hooks/useTimers'
import { TimerCard } from './components/TimerCard'
import { Settings } from './components/Settings'
import { BackIcon, SettingsIcon } from './components/Icons'

type View = 'timers' | 'settings'

export function App() {
  const timers = useTimers()
  const [view, setView] = useState<View>('timers')
  const headerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)

  // Fit the window to whatever is showing. Measures the full content height
  // (not the visible part), so the window can grow back after it was capped
  // and started scrolling.
  useLayoutEffect(() => {
    const parts = [headerRef.current, contentRef.current, footerRef.current]
    if (parts.some((el) => !el)) return
    const report = () =>
      window.otium.resizePanel(parts.reduce((sum, el) => sum + (el?.offsetHeight ?? 0), 0))
    const observer = new ResizeObserver(report)
    parts.forEach((el) => observer.observe(el!))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="panel">
      <header className="header" ref={headerRef}>
        {view === 'timers' ? (
          <>
            <h1 className="wordmark">Otium</h1>
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
          ) : (
            <div className="cards">
              {timers.map((t) => (
                <TimerCard key={t.id} timer={t} onAction={(action) => window.otium.timerAction(t.id, action)} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="footer" ref={footerRef}>
        <button type="button" className="text-button muted" onClick={() => window.otium.quit()}>
          Quit Otium
        </button>
      </footer>
    </div>
  )
}

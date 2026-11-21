import { useEffect, useState } from 'react'
import type { TimerSnapshot } from '@shared/types'

/** Live timer data pushed from the engine (about once a second while the panel is open). */
export function useTimers(): TimerSnapshot[] {
  const [timers, setTimers] = useState<TimerSnapshot[]>([])

  useEffect(() => {
    let active = true
    window.otium.getTimers().then((t) => active && setTimers(t))
    const unsubscribe = window.otium.onTimers(setTimers)
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return timers
}

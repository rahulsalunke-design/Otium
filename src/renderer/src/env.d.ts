import type { PauseApi } from '@shared/types'

declare global {
  interface Window {
    /** Provided by the preload script. */
    pause: PauseApi
  }
}

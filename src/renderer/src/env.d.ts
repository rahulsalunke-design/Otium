import type { OtiumApi } from '@shared/types'

declare global {
  interface Window {
    /** Provided by the preload script. */
    otium: OtiumApi
  }
}

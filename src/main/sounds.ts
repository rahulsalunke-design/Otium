import { spawn, type ChildProcess } from 'node:child_process'
import type { SoundId } from '@shared/types'
// `asarUnpack` keeps these as real files inside the packaged app, so afplay can read them.
import chime from '../../resources/sounds/chime.wav?asset&asarUnpack'
import droplet from '../../resources/sounds/droplet.wav?asset&asarUnpack'
import rise from '../../resources/sounds/rise.wav?asset&asarUnpack'
import bowl from '../../resources/sounds/bowl.wav?asset&asarUnpack'

const FILES: Record<Exclude<SoundId, 'none'>, string> = { chime, droplet, rise, bowl }

let current: ChildProcess | null = null

/**
 * Plays one of Otium's sounds with macOS's built-in `afplay`. A new sound
 * stops the previous one, so reminders that go off together don't pile up.
 */
export function playSound(sound: SoundId): void {
  if (sound === 'none') return
  const file = FILES[sound]
  if (!file) return
  current?.kill()
  const player = spawn('/usr/bin/afplay', [file], { stdio: 'ignore' })
  player.on('error', () => {}) // no sound is better than a crash
  player.on('exit', () => {
    if (current === player) current = null
  })
  current = player
}

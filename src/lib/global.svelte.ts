import type { Track } from './schemas/track'

export interface Global {
  nowPlaying: Track | null
  isPaused: boolean
}

export const global = $state<Global>({
  nowPlaying: null,
  isPaused: true,
})

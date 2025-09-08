import type { Track } from './schemas/track'

interface Global {
  nowPlaying: Track | null
  isPaused: boolean
}

export const global: Global = $state({
  nowPlaying: null,
  isPaused: true,
})

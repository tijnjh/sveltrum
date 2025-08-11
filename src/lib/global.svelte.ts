import type { Track } from './schemas/track'

export const global = $state({
  nowPlaying: null as Track | null,
})

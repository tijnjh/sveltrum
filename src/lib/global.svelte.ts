import type { Track } from './types'

export const global = $state({
    nowPlaying: null as Track | null,
})

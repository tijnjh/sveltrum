import type { Track } from './schemas/track'
import { Ref } from './ref.svelte'

export const nowPlaying = new Ref<Track | null>(null)
export const isPaused = new Ref(true)

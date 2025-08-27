import type { Track } from './schemas/track'
import { ref } from './ref.svelte'

export const nowPlaying = ref<Track | null>(null)
export const isPaused = ref(true)

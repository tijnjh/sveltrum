import type { Track } from './schemas/track'

export interface Global {
	nowPlaying: Track | null
	showNowPlayingView: boolean
	isPaused: boolean
	queue: Track[]
}

export const global = $state<Global>({
	nowPlaying: null,
	showNowPlayingView: false,
	isPaused: true,
	queue: [],
})

import type { Track } from './schemas/track'
import { PersistedState } from 'runed'

export interface Global {
	nowPlaying: Track | null
	showNowPlayingView: boolean
	isPaused: boolean
}

export const global = $state<Global>({
	nowPlaying: null,
	showNowPlayingView: false,
	isPaused: true,
})

export const favoriteTrackIds = new PersistedState<number[]>('favorites', [])
export const queue = new PersistedState<Track[]>('queue', [])

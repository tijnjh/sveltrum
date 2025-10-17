import { nowPlaying } from './global.svelte'
import type { Track } from './schemas/track'
import { PersistedState } from 'runed'

class Queue {
	tracks = new PersistedState<Track[]>('queue', [])

	next() {
		nowPlaying.current = this.tracks.current.shift() || null
	}

	add(track: Track) {
		this.tracks.current.push(track)
	}

	clear() {
		this.tracks.current = []
	}
}

export const queue = new Queue()

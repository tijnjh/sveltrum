import type { Track } from './schemas/track'
import { atom } from 'jotai'

export const nowPlayingAtom = atom<Track | undefined>(undefined)
export const showNowPlayingViewAtom = atom(false)
export const isPausedAtom = atom(false)

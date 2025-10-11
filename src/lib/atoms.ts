import { atom } from "jotai";
import type { Track } from "./schemas/track";

export const nowPlayingAtom = atom<Track | undefined>(undefined);
export const showNowPlayingViewAtom = atom(false);
export const isPausedAtom = atom(false);

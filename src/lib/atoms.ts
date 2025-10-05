import { atom } from "jotai";
import type { Track } from "./schemas/track";

export const nowPlayingAtom = atom<Track | null>(null);
export const isPausedAtom = atom(false);

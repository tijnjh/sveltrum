import { global, nowPlaying } from "./global.svelte";
import type { Track } from "./schemas/track";
import { PersistedState } from "runed";

class Queue {
  tracks = new PersistedState<Track[]>("queue", []);

  next() {
    nowPlaying.current = this.tracks.current.shift() || null;
    setTimeout(() => {
      global.isPaused = false;
    }, 100);
  }

  add(track: Track) {
    this.tracks.current.push(track);
  }

  clear() {
    this.tracks.current = [];
  }
}

export const queue = new Queue();

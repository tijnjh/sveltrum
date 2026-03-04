import type { Track } from "./schemas/track";
import { PersistedState } from "runed";

export const nowPlaying = new PersistedState<Track | null>("now-playing", null);

interface Global {
  showNowPlayingView: boolean;
  isPaused: boolean;
}

export const global = $state<Global>({
  showNowPlayingView: false,
  isPaused: true,
});

class Favorites {
  current = $state<number[]>([]);
  isSignedIn = $state(false);
  #syncTimeout: ReturnType<typeof setTimeout> | null = null;

  async load() {
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        this.current = await res.json();
        this.isSignedIn = true;
      }
    } catch {
      // Not signed in or network error
    }
  }

  toggle(id: number) {
    if (this.current.includes(id)) {
      this.current = this.current.filter((i) => i !== id);
    } else {
      this.current = [...this.current, id];
    }
    this.#syncToDrive();
  }

  #syncToDrive() {
    if (this.#syncTimeout) clearTimeout(this.#syncTimeout);
    this.#syncTimeout = setTimeout(async () => {
      await fetch("/api/favorites", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.current),
      });
    }, 1000);
  }
}

export const favorites = new Favorites();

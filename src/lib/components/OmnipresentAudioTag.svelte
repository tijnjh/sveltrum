<script lang="ts">
  import { getTrackSource } from "$lib/api/hls.remote";
  import { global, nowPlaying } from "$lib/global.svelte";
  import type { Track } from "$lib/schemas/track";
  import type Hls_typed from "hls.js";
  // @ts-expect-error they don't have types  for the light version
  import Hls_untyped from "hls.js/light";

  const Hls = Hls_untyped as typeof Hls_typed;

  function applySource(track: Track) {
    return (element: HTMLAudioElement) => {
      getTrackSource(track.id).then((url) => {
        if (!Hls.isSupported()) {
          throw new Error("hls is not supported");
        }

        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(element);
      });
    };
  }
</script>

<audio
  class="h-10"
  bind:paused={global.isPaused}
  controls
  {@attach nowPlaying.current && applySource(nowPlaying.current)}
>
</audio>

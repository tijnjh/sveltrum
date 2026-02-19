<script lang="ts">
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import type { AfterNavigate, BeforeNavigate } from "@sveltejs/kit";
  import { expoInOut } from "svelte/easing";
  import { Tween } from "svelte/motion";

  const progress = new Tween(0, {
    duration: 200,
    easing: expoInOut,
  });

  function hasNavigationUpdated(navigation: BeforeNavigate | AfterNavigate) {
    return navigation.from?.url.href === navigation.to?.url.href;
  }

  beforeNavigate(async (navigation) => {
    if (!hasNavigationUpdated(navigation)) {
      await progress.set(0, { duration: 0 });
      await progress.set(35, { duration: 900, easing: expoInOut });
      await progress.set(75, { duration: 600, easing: expoInOut });
    } else {
      await progress.set(0, { duration: 0 });
    }
  });

  afterNavigate(async (navigation) => {
    if (!hasNavigationUpdated(navigation)) {
      await progress.set(100);
      setTimeout(() => {
        progress.set(0, { duration: 0 });
      }, 500);
    } else {
      await progress.set(0, { duration: 0 });
    }
  });
</script>

<div
  class={[
    "fixed inset-x-1 top-1 z-9999 h-1 overflow-hidden rounded-full transition-opacity",
    progress.current !== 100 ? "opacity-67" : "opacity-0",
  ]}
>
  <div
    class="top-1 h-full animate-pulse bg-mist-300"
    style="width: {progress.current}%;"
  ></div>
</div>

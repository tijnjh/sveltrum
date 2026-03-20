<script lang="ts">
  import { page } from "$app/state";
  import NowPlayingBar from "$lib/components/NowPlayingBar.svelte";
  import NowPlayingView from "$lib/components/NowPlayingView.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { theme } from "$lib/theme.svelte";
  import "../app.css";
  import { ChevronLeft } from "@lucide/svelte";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { watch } from "runed";

  const { children } = $props();

  const queryClient = new QueryClient();

  watch(
    [() => page.route.id, () => theme.themeVariables],
    ([routeId, themeVariables]) => {
      if (routeId !== "/[user]/sets/[playlist]") {
        theme.reset();
      }

      for (const [key, value] of Object.entries(themeVariables)) {
        if (value === undefined) {
          document.documentElement.style.removeProperty(`--${key}`);
          continue;
        }

        if (value) {
          document.documentElement.style.setProperty(`--${key}`, value);
        }
      }
      console.log("Applied theme:", theme);
    },
  );
</script>

<QueryClientProvider client={queryClient}>
  {#if page.route.id !== "/"}
    <div
      class="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-5xl justify-between p-4"
    >
      <Button
        variant="secondary"
        icon={ChevronLeft}
        onclick={() => history.back()}>Back</Button
      >

      <Button variant="secondary" href="/">Home</Button>
    </div>
  {/if}

  <NowPlayingView />
  <NowPlayingBar />

  {@render children()}
</QueryClientProvider>

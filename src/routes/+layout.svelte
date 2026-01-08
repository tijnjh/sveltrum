<script lang="ts">
  import { page } from "$app/state";
  import NowPlaying from "$lib/components/NowPlaying.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import "../app.css";
  import { ChevronLeft } from "@lucide/svelte";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";

  const { children } = $props();

  const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
  <div
    class="grid h-svh grid-cols-[1fr_50%_1fr] grid-rows-[min-content_1fr] gap-6 p-6"
  >
    <div class="col-span-3 flex w-full justify-between">
      <Button
        variant="secondary"
        icon={ChevronLeft}
        disabled={page.route.id === "/"}
        onclick={() => history.back()}>Back</Button
      >

      {#if page.route.id !== "/"}
        <Button variant="secondary" href="/">Home</Button>
      {/if}
    </div>

    {@render children()}

    <div
      class="flex flex-col gap-4 overflow-y-scroll rounded-4xl bg-zinc-900 p-6"
    >
      <NowPlaying />
    </div>
  </div>
</QueryClientProvider>

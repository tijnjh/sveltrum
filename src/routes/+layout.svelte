<script lang="ts">
  import { page } from "$app/state";
  import NavigationProgress from "$lib/components/NavigationProgress.svelte";
  import NowPlayingBar from "$lib/components/NowPlayingBar.svelte";
  import NowPlayingView from "$lib/components/NowPlayingView.svelte";
  import ProfileMenu from "$lib/components/ProfileMenu.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { favorites } from "$lib/global.svelte";
  import "../app.css";
  import { ChevronLeft } from "@lucide/svelte";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { onMount } from "svelte";

  const { children, data } = $props();

  const queryClient = new QueryClient();

  onMount(() => {
    if (data.user) {
      favorites.load();
    }
  });
</script>

<NavigationProgress />

<QueryClientProvider client={queryClient}>
  <div
    class="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-5xl items-center justify-between bg-linear-to-b from-mist-800 to-mist-700/0 p-4"
  >
    {#if page.route.id !== "/"}
      <Button
        variant="secondary"
        icon={ChevronLeft}
        onclick={() => history.back()}>Back</Button
      >

      <Button variant="secondary" href="/">Home</Button>
    {:else}
      <div></div>
    {/if}

    <ProfileMenu user={data.user} />
  </div>

  <NowPlayingView />
  <NowPlayingBar />

  {@render children()}
</QueryClientProvider>

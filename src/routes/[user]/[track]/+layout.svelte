<script lang="ts">
  import HeroSection from "$lib/components/HeroSection.svelte";
  import Main from "$lib/components/Main.svelte";

  const { children, data: track } = $props();
</script>

<Main>
  {#snippet left()}
    <HeroSection
      title={track.title}
      pictureSrc={track.artwork_url}
      user={track.user}
    />
  {/snippet}

  {#snippet right()}
    {@render children()}
  {/snippet}
</Main>

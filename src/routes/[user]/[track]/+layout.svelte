<script lang="ts">
  import HeroSection from "$lib/components/HeroSection.svelte";
  import Shell from "$lib/components/Shell.svelte";

  const { children, data: track } = $props();
</script>

<Shell>
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
</Shell>

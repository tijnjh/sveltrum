<script lang='ts'>
  const { src, alt }: { src: string | null, alt: string } = $props()
</script>

{#if src}
  <img {src} alt={alt} class='rounded size-12 aspect-square'>
{:else}
  <div class='rounded size-12 aspect-square bg-zinc-700'></div>
{/if}

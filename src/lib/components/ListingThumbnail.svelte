<script lang='ts'>
  const { src, alt }: { src: string | null, alt: string } = $props()

  let hasFailed = $state(false)
</script>

{#if src && !hasFailed}
  <img {src} alt={alt} class='rounded size-12 aspect-square' onerror={() => hasFailed = true}>
{:else}
  <div class='rounded size-12 aspect-square bg-zinc-700'></div>
{/if}

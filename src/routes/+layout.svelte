<script lang='ts'>
  import '../app.css'

  const { children } = $props()
</script>

<svelte:boundary>
  {@render children?.()}

  {#snippet pending()}
    loading
  {/snippet}
  {#snippet failed(error)}
    {error}
  {/snippet}
</svelte:boundary>

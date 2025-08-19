<script lang='ts' generics="T, E">
  import type { Err, Ok } from 'dethrow'
  import type { Snippet } from 'svelte'

  const { res, ok, err }: {
    res: Ok<T> | Err<E>
    ok: Snippet<[T]>
    err?: Snippet<[E]>
  } = $props()
</script>

{#if res.isErr()}
  {#if err}
    {@render err(res.err)}
  {:else}
    <div class='bg-red-500/25 text-white'>
      <div>Something went wrong!</div>

      <pre>{JSON.stringify(res.err, null, 2)}</pre>
    </div>
  {/if}
{:else}
  {@render ok(res.val)}
{/if}

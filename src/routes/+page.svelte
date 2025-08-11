<script lang='ts'>
  import { SearchIcon } from '@lucide/svelte'
</script>

<div class='max-w-xl mx-auto p-4 flex flex-col gap-4'>
  <h1 class='mx-auto text-center text-2xl font-medium mt-32'>Sveltrum</h1>
  <form action='/search' class='flex gap-2 w-full p-4'>
    <input
      type='text'
      name='q'
      class='bg-zinc-700 px-4 grow rounded-full'
      placeholder='Search'
    />

    <button type='submit' class='bg-white text-zinc-700 size-10 rounded-full active:scale-90 transition-transform active:opacity-50 flex items-center justify-center'>
      <SearchIcon size={16} strokeWidth={3} />
    </button>

  </form>
  <div class='flex gap-4 justify-center'>

    {@render link('library', 'Liked songs')}
    {@render link('https://tijn.dev/sveltrum', 'Source')}
  </div>

</div>

{#snippet link(href: string, label: string)}
  <a {href} class='bg-white text-zinc-700 h-10 w-fit px-4 rounded-full active:scale-90 transition-transform active:opacity-50 flex items-center justify-center'>
    {label}
  </a>
{/snippet}

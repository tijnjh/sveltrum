<script lang='ts'>
  import Button from '$lib/components/Button.svelte'
  import { SearchIcon } from '@lucide/svelte'
</script>

<div class='max-w-xl mx-auto p-4 flex flex-col gap-4'>
  <h1 class='mx-auto text-center text-2xl font-medium mt-32'>Sveltrum</h1>
  <form action='/search' class='flex gap-2 w-full p-4'>
    <input
      type='text'
      name='q'
      class='bg-zinc-700 px-4 h-10 grow rounded-full'
      placeholder='Search'
    />

    <Button type='submit' size='icon'>
      <SearchIcon size={16} strokeWidth={3} />
    </Button>
  </form>
  <div class='flex gap-4 justify-center'>
    <!-- <Button href='/library'>Liked songs</Button> -->
    <Button href='https://tijn.dev/sveltrum'>View on GitHub</Button>
  </div>

</div>

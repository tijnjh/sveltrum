<script lang='ts'>
  import type { User } from '$lib/schemas/user'
  import UserListing from './listings/UserListing.svelte'

  const { pictureSrc, title, user }: {
    pictureSrc: string | null
    title: string
    user?: User
  } = $props()
</script>

{#if pictureSrc}
  <img src={pictureSrc.replace('large', 't500x500')} class='w-full aspect-square sm:mx-auto sm:rounded-xl sm:my-4 sm:max-w-md' alt="">
{/if}

<div class='flex flex-col z-40 gap-4 w-full sticky top-0 inset-x-0 bg-zinc-700/75 backdrop-blur-lg'>
  <div class='mx-auto p-4 max-w-xl w-full'>
    <h1 class='font-medium text-2xl'>{title}</h1>
  </div>
</div>

{#if user}
  <div class='max-w-xl mx-auto'>
    <UserListing {user} class='m-4 bg-zinc-700/75 p-2 rounded-xl ' />
  </div>
{/if}

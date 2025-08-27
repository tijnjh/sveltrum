<script lang='ts'>
  import type { User } from '$lib/schemas/user'
  import { cn } from 'cnfn'
  import UserListing from './listings/UserListing.svelte'

  const { pictureSrc, title, user, roundedPicture = false }: {
    pictureSrc: string | null
    title: string
    user?: User
    roundedPicture?: boolean
  } = $props()
</script>

{#if pictureSrc}
  <img
    src={pictureSrc.replace('large', 't500x500')}
    class={cn('w-full aspect-square', roundedPicture ? 'rounded-full' : 'rounded-xl')}
    alt=""
  />
{/if}

<h1 class='font-medium text-2xl'>{title}</h1>
{#if user}
  <UserListing user={user} class='mt-4' />
{/if}
<!--
<div class='flex flex-col z-40 gap-4 w-full sticky top-0 inset-x-0 bg-zinc-700/75 backdrop-blur-lg'>
  <div class='mx-auto p-4 max-w-xl w-full'>
    <h1 class='font-medium text-2xl'>{title}</h1>
  </div>
</div>

{#if user}
  <div class='max-w-xl mx-auto'>
    <UserListing {user} class='m-4 bg-zinc-700/75 p-2 rounded-xl ' />
  </div>
{/if} -->

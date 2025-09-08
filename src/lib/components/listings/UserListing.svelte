<script module lang='ts'>
  import type { User } from '$lib/schemas/user'
  import type { ClassValue } from 'cnfn'

  export interface UserListingProps {
    user: User
    class?: ClassValue
  }
</script>

<script lang='ts'>
  import { cn } from 'cnfn'
  import ListingThumbnail from '../ListingThumbnail.svelte'

  const { user, ...props }: UserListingProps = $props()
</script>

<a
  href='/user/{user.id}'
  class={cn('items-center gap-4 grid grid-cols-[auto_1fr] active:opacity-50 text-left active:scale-95 transition-transform', props.class)}
>
  <ListingThumbnail src={user.avatar_url} alt='Profile picture of {user.username}' class='rounded-full' />
  <div class='flex flex-col w-full min-w-0'>
    <h3 class='truncate'>{user.username}</h3>
    {#if user.full_name !== user.username}
      <p class='opacity-50 truncate'>{user.full_name}</p>
    {/if}
  </div>
</a>

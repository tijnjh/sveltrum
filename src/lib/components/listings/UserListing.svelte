<script lang='ts'>
  import type { User } from '$lib/schemas/user'
  import ListingThumbnail from '../ListingThumbnail.svelte'

  const { user }: { user: User } = $props()
</script>

<a
  href='/user/{user.id}'
  class='items-center text-left gap-4 grid grid-cols-[auto_1fr] active:scale-95 transition-transform active:opacity-50'
>
  <ListingThumbnail src={user.avatar_url} alt='Profile picture of {user.username}' />
  <div class='flex flex-col w-full min-w-0'>
    <h3 class='truncate'>{user.username}</h3>
    <p class='truncate opacity-50'>{user.followers_count?.toLocaleString()} followers</p>
  </div>
</a>

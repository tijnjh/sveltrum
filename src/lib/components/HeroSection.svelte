<script module lang='ts'>
  import type { User } from '$lib/schemas/user'

  export interface HeroSectionProps {
    pictureSrc?: string | null
    title: string
    user?: User
    roundedPicture?: boolean
  }
</script>

<script lang='ts'>
  import { cn } from 'cnfn'
  import UserListing from './listings/UserListing.svelte'

  const { pictureSrc, title, user, roundedPicture = false }: HeroSectionProps = $props()
</script>

{#if pictureSrc}
  <img
    src={pictureSrc.replace('large', 't500x500')}
    class={cn('mx-auto my-4 w-full max-w-xs aspect-square', roundedPicture ? 'rounded-full' : 'rounded-xl')}
    alt=""
  />
{/if}

<h1 class='font-medium text-2xl'>{title}</h1>
{#if user}
  <UserListing user={user} class='mt-4' />
{/if}

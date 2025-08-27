# .gitignore

```
node_modules

# Output
.output
.vercel
.netlify
.wrangler
/.svelte-kit
/build

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.*
!.env.example
!.env.test

# Vite
vite.config.js.timestamp-*
vite.config.ts.timestamp-*

```

# eslint.config.js

```js
import antfu from '@antfu/eslint-config'

export default antfu({
  svelte: true,
  rules: {
    'antfu/no-top-level-await': 'off',
  },
})

```

# package.json

```json
{
  "type": "module",
  "private": true,
  "license": "AGPL-3.0",
  "scripts": {
    "build": "vite build",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
    "dev": "vite dev",
    "prepare": "svelte-kit sync || echo ''",
    "preview": "vite preview",
    "start": "node ./build"
  },
  "dependencies": {
    "cnfn": "^0.0.2",
    "hls.js": "^1.6.9",
    "ios-haptics": "^0.1.0",
    "neverthrow": "^8.2.0",
    "nuqs-svelte": "^1.2.1",
    "ofetch": "^1.4.1",
    "svelte-sonner": "^1.0.5",
    "zod": "^4.0.17"
  },
  "devDependencies": {
    "@antfu/eslint-config": "^5.2.1",
    "@lucide/svelte": "^0.539.0",
    "@sveltejs/adapter-node": "^5.2.14",
    "@sveltejs/kit": "^2.28.0",
    "@sveltejs/vite-plugin-svelte": "^6.1.1",
    "@tailwindcss/vite": "^4.1.11",
    "eslint": "^9.33.0",
    "eslint-plugin-svelte": "^3.11.0",
    "svelte": "^5.38.1",
    "svelte-check": "^4.3.1",
    "svelte-eslint-parser": "^1.3.1",
    "tailwindcss": "^4.1.11",
    "typescript": "^5.9.2",
    "vite": "^7.1.2"
  }
}

```

# README.md

```md
soundcloud client

```

# src/app.css

```css
@import "tailwindcss";

* {
    @apply touch-manipulation;
}

body,
html {
    color-scheme: dark;
    @apply bg-zinc-800;
}

button,
input {
    @apply focus:outline-0 focus-visible:ring-2 focus-visible:ring-blue-500;
}

```

# src/app.html

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        %sveltekit.head%
    </head>
    <body data-sveltekit-preload-data="hover">
        <div style="display: contents">%sveltekit.body%</div>
    </body>
</html>

```

# src/lib/api/discovery.remote.ts

```ts
import type { Ok } from 'neverthrow'
import { query } from '$app/server'
import { playlist } from '$lib/schemas/playlist'
import { err, ok } from 'neverthrow'
import { z } from 'zod'
import { $api } from './utils'

export const getSelections = query(async () => {
  const res = await $api({
    path: '/mixed-selections',
    schema: z.object({
      collection: z.object({
        items: z.object({
          collection: playlist.array(),
        }),
      }).array(),
    }),
  })

  if (res.isErr()) {
    return err(res.error)
  }

  return ok(res.value.collection)
})

export const getRelatedTracks = query(z.number(), async (id) => {
  const res = await $api({
    path: `/tracks/${id}/related`,
  })

  if (res.isErr()) {
    return err(res.error)
  }

  return ok(res.value)
})

```

# src/lib/api/get-by-id.remote.ts

```ts
import { query } from '$app/server'
import { playlist } from '$lib/schemas/playlist'
import { track } from '$lib/schemas/track'
import { user } from '$lib/schemas/user'
import { err, ok } from 'neverthrow'
import { z } from 'zod'
import { $api, chunked } from './utils'

export const getTrackById = query(z.number(), id => $api({
  path: `/tracks/${id}`,
  schema: track,
}))

export const getPlaylistById = query(z.number(), id => $api({
  path: `/playlists/${id}`,
  schema: playlist,
}))

export const getUserById = query(z.number(), id => $api({
  path: `/users/${id}`,
  schema: user,
}))

export const getTracksByIds = query(
  z.object({
    ids: z.number().array(),
    size: z.number().optional(),
    index: z.number().optional(),
  }),
  async ({ ids, size = 32, index = 0 }) => {
    const chunkedIds = chunked(ids, { size, index })

    if (!chunkedIds.length) {
      return ok({ tracks: [], hasMore: false })
    }

    const tracks = await $api({
      path: `/tracks`,
      params: { ids: chunkedIds.join(',') },
      schema: track.array(),
    })

    if (tracks.isErr()) {
      return err(tracks.error)
    }

    return ok({
      tracks: tracks.value,
      hasMore: (index + 1) * size < ids.length,
    })
  },
)

```

# src/lib/api/hsl.remote.ts

```ts
import type { Result } from 'neverthrow'
import { query } from '$app/server'
import { err, ok } from 'neverthrow'
import { ofetch } from 'ofetch/node'
import { z } from 'zod'
import { getTrackById } from './get-by-id.remote'
import { getClientId } from './utils'

export const getTrackSource = query(z.number(), async (trackId): Promise<Result<string, Error>> => {
  const track = await getTrackById(trackId)
  const clientId = await getClientId()

  if (track.isErr()) {
    return err(track.error)
  }

  if (!track.value) {
    return err(new Error('failed to find track'))
  }

  const hlsTranscodings = track.value.media.transcodings.filter(({ format }) => format.protocol === 'hls')

  const transcoding = hlsTranscodings.find(({ preset }) => preset === 'aac_160k')
    ?? hlsTranscodings.find(({ format }) => format.mime_type === 'audio/mpeg')

  if (!transcoding) {
    return err(new Error('failed to find hls transcoding'))
  }

  const { url } = await ofetch(transcoding.url, {
    params: {
      track_authorization: track.value.track_authorization,
      client_id: clientId,
    },
  })

  return ok((Array.isArray(url) ? url[0] : url) as string)
})

```

# src/lib/api/search.remote.ts

```ts
import { query } from '$app/server'
import { playlist } from '$lib/schemas/playlist'
import { track } from '$lib/schemas/track'
import { user } from '$lib/schemas/user'
import { err, ok } from 'neverthrow'
import { z } from 'zod'
import { $api, withPagination } from './utils'

const searchSchema = z.object({
  query: z.string(),
  limit: z.number().optional(),
  index: z.number().optional(),
})

function baseSearch<T extends z.ZodType>(kind: string, schema: T) {
  return query(searchSchema, withPagination(async ({ limit, offset, query }) => {
    const res = await $api({
      path: `/search/${kind}`,
      params: { q: query, limit, offset },
      schema: z.object({
        collection: z.array(schema),
      }),
    })

    if (res.isErr()) {
      return err(res.error)
    }

    return ok(res.value.collection)
  }))
}

export const searchTracks = baseSearch('tracks', track)
export const searchPlaylists = baseSearch('playlists', playlist)
export const searchUsers = baseSearch('users', user)

```

# src/lib/api/user.remote.ts

```ts
import { query } from '$app/server'
import { playlist } from '$lib/schemas/playlist'
import { track } from '$lib/schemas/track'
import { err, ok } from 'neverthrow'
import { z } from 'zod'
import { $api, withPagination } from './utils'

const getUserSchema = z.object({
  id: z.number(),
  size: z.number().optional(),
  index: z.number().optional(),
})

function baseGetUser<T extends z.ZodType>(kind: string, schema: T) {
  return query(getUserSchema, withPagination(async ({ id, limit, offset }) => {
    const res = await $api({
      path: `/users/${id}/${kind}`,
      params: { limit, offset },
      schema: z.object({
        collection: z.array(schema),
      }),
    })

    if (res.isErr()) {
      return err(res.error)
    }

    return ok(res.value.collection)
  }))
}

export const getUserTracks = baseGetUser('tracks', track)
export const getUserPlaylists = baseGetUser('playlists', playlist)

```

# src/lib/api/utils.ts

```ts
import type { Result } from 'neverthrow'
import { err, fromPromise, ok } from 'neverthrow'
import { ofetch } from 'ofetch/node'
import { z } from 'zod'

export async function $api<S extends z.ZodTypeAny | undefined, T = S extends z.ZodTypeAny ? z.infer<S> : any>({ path, params, schema }: { path: string, params?: Record<string, any>, schema?: S }): Promise<Result<T, Error>> {
  const clientId = await getClientId()

  if (clientId.isErr()) {
    return err(clientId.error)
  }

  const response = await fromPromise(
    ofetch(`https://api-v2.soundcloud.com${path}`, {
      params: {
        ...params,
        client_id: clientId.value,
      },
    }),
    error => new Error(`failed to fetch: ${error}`),
  )

  if (response.isErr()) {
    return err(response.error)
  }

  if (!schema) {
    return ok(response.value)
  }

  const { success, error, data } = schema.safeParse(response.value)

  if (!success) {
    console.error(z.prettifyError(error))
    return err(new Error('failed to pass validation'))
  }

  if (!data) {
    return err(new Error('response is nullish'))
  }

  return ok(data as T)
}

let clientId: string
let clientIdExpiry: number

export async function getClientId(): Promise<Result<string, Error>> {
  if (clientId && Date.now() < clientIdExpiry) {
    return ok(clientId)
  }

  const html = await fromPromise(
    fetch('https://soundcloud.com').then(r => r.text()),
    error => new Error(`failed to fetch soundcloak.com: ${error}`),
  )

  if (html.isErr()) {
    return err(html.error)
  }

  const scriptUrl = html.value.match(/<script crossorigin src="(https:\/\/a-v2\.sndcdn\.com\/assets\/0-[^"]+\.js)"><\/script>/)?.[1]

  if (!scriptUrl) {
    return err(new Error('script not found'))
  }

  const script = await fromPromise(
    fetch(scriptUrl).then(r => r.text()),
    error => new Error(`failed to fetch ${scriptUrl}: ${error}`),
  )

  if (script.isErr()) {
    return err(script.error)
  }

  const id = script.value.match(/client_id:"([A-Za-z0-9]{32})"/)?.[1]

  if (!id) {
    return err(new Error('client id not found'))
  }

  clientId = id
  clientIdExpiry = Date.now() + 30 * 60 * 1000

  return ok(clientId)
}

export function chunked<T>(arr: T[], { size = 32, index = 0 }: { size?: number, index?: number }) {
  const start = index * size
  const end = start + size
  return arr.slice(start, end)
}

export function withPagination<TArgs extends Record<string, any>, T>(
  fetcher: (opts: TArgs & { limit: number, offset: number }) => Promise<Result<T[], Error>>,
) {
  return async ({
    limit = 32,
    index = 0,
    ...rest
  }: TArgs & { limit?: number, index?: number }) => {
    const offset = index * limit
    const results = await fetcher({ ...(rest as TArgs), limit, offset })

    if (results.isErr()) {
      return err(results.error)
    }

    return ok({
      results: results.value,
      hasMore: results.value.length === limit,
    })
  }
}

```

# src/lib/components/BottomNav.svelte

```svelte
  <script lang='ts'>
  import { page } from '$app/state'
  import { nowPlaying } from '$lib/global.svelte'
  import { PauseIcon, PlayIcon } from '@lucide/svelte'
  import { haptic } from 'ios-haptics'
  import Button from './Button.svelte'

  let { show = $bindable(), isPaused = $bindable() }: { show: boolean, isPaused: boolean } = $props()

  const StatusIcon = $derived(isPaused ? PlayIcon : PauseIcon)
</script>

<div class='bottom-0 fixed inset-x-0 bg-zinc-700/75 backdrop-blur-lg'>
  {#if nowPlaying.current}
    <div class='p-4 border-zinc-100/10'>
      <div class='items-center gap-4 grid grid-cols-[1fr_auto]'>

        <button onclick={() => show = true} class='flex text-left gap-4 truncate'>
          <img src={nowPlaying.current.artwork_url} alt="" class='rounded size-12 aspect-square'>

          <div class='flex flex-col w-full min-w-0'>
            <h3 class='truncate'>{nowPlaying.current.title}</h3>
            <p class='opacity-50 truncate'>{nowPlaying.current.user.username}</p>
          </div>
        </button>

        <Button
          size='icon'
          variant='secondary'
          onclick={() => {
            haptic()
            isPaused = !isPaused
          }}
        >
          <StatusIcon fill='currentColor' class='opacity-50' size={16} />
        </Button>
      </div>
    </div>
  {/if}

  <nav class='flex justify-center items-center gap-2 p-4'>
    {#each [['/', 'Home'], ['/search', 'Search']] as const as [href, label]}
      {@const isCurrent = page.url.pathname === `/${href.replace('/', '')}`}
      <Button {href} variant={isCurrent ? 'primary' : 'secondary'}>
        {label}
      </Button>
    {/each}
  </nav>
</div>

```

# src/lib/components/Button.svelte

```svelte
<script lang='ts'>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from 'cnfn'

  const { variant = 'primary', size, class: className, children, href, ...props }: Partial<HTMLButtonAttributes & {
    variant: 'primary' | 'secondary'
    size?: 'icon'
    children: Snippet
    href: string
  }> = $props()

</script>

<svelte:element
  this={href ? 'a' : 'button'}
  href={href}
  {...props}
  class={cn(
    'flex justify-center items-center gap-2  active:opacity-50 rounded-full active:scale-90 transition-transform',
    variant === 'primary' && 'bg-white text-zinc-800',
    variant === 'secondary' && 'bg-zinc-100/10',
    size === 'icon' ? 'size-10' : 'h-9 px-4',
    className,
  )}
>
  {@render children?.()}
</svelte:element>

```

# src/lib/components/listings/PlaylistListing.svelte

```svelte
<script lang='ts'>
  import type { Playlist } from '$lib/schemas/playlist'
  import ListingThumbnail from '../ListingThumbnail.svelte'

  const { playlist }: { playlist: Playlist } = $props()
</script>

<a
  href='/playlist/{playlist.id}'
  class='items-center text-left gap-4 grid grid-cols-[auto_1fr] active:scale-95 transition-transform active:opacity-50'
>
  <ListingThumbnail src={playlist.artwork_url} alt='Playlist picture of {playlist.title}' />

  <div class='flex flex-col w-full min-w-0'>
    <div class='flex gap-2'>
      <h3 class='truncate'>{playlist.title}</h3>
      {#if playlist.is_album}
        <div class='px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-400 text-sm whitespace-nowrap'>Album</div>
      {/if}
    </div>
    <p class='truncate opacity-50'>{playlist.user.username}</p>
  </div>
</a>

```

# src/lib/components/listings/TrackListing.svelte

```svelte
<script lang='ts'>
  import type { Track } from '$lib/schemas/track'
  import { nowPlaying } from '$lib/global.svelte'
  import ListingThumbnail from '../ListingThumbnail.svelte'

  const { track, inAlbum = false }: { track: Track, inAlbum?: boolean } = $props()
</script>

<button
  onclick={() => { nowPlaying.current = track }}
  class='items-center text-left gap-4 grid grid-cols-[auto_1fr] active:scale-95 transition-transform active:opacity-50'
>
  {#if !inAlbum}
    <ListingThumbnail src={track.artwork_url} alt='Album cover of {track.title}' />
  {/if}

  <div class='flex flex-col w-full min-w-0'>
    <div class='flex gap-2'>
      <h3 class='truncate'>{track.title}</h3>

      {#if track.policy === 'SNIP'}
        <div class='px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-400 text-sm whitespace-nowrap'>30s only</div>
      {/if}
    </div>
    <p class='truncate opacity-50'>{track.user?.username}</p>
  </div>
</button>

```

# src/lib/components/listings/UserListing.svelte

```svelte
<script lang='ts'>
  import type { User } from '$lib/schemas/user'
  import ListingThumbnail from '../ListingThumbnail.svelte'

  const { user }: { user: User } = $props()
</script>

<a
  href='/user/{user.id}'
  class='items-center text-left gap-4 grid grid-cols-[auto_1fr] active:scale-95 transition-transform active:opacity-50'
>
  <ListingThumbnail src={user.avatar_url} alt='Profile picture of {user.username}' class='rounded-full' />
  <div class='flex flex-col w-full min-w-0'>
    <h3 class='truncate'>{user.username}</h3>
    {#if user.full_name !== user.username}
      <p class='truncate opacity-50'>{user.full_name}</p>
    {/if}
  </div>
</a>

```

# src/lib/components/ListingThumbnail.svelte

```svelte
<script lang='ts'>
  import type { ClassValue } from 'cnfn'
  import { cn } from 'cnfn'

  const { src, alt, ...props }: { src: string | null, alt: string, class?: ClassValue } = $props()

  let hasFailed = $state(false)
</script>

{#if src && !hasFailed}
  <img {src} {alt} class={cn('rounded size-12 aspect-square', props.class)} onerror={() => hasFailed = true}>
{:else}
  <div class='rounded size-12 aspect-square bg-zinc-700'></div>
{/if}

```

# src/lib/components/NowPlayingView.svelte

```svelte
<script lang='ts'>
  import type { Track } from '$lib/schemas/track'
  import { getRelatedTracks } from '$lib/api/discovery.remote'
  import { getTrackSource } from '$lib/api/hsl.remote'
  import { nowPlaying } from '$lib/global.svelte'
  import { ChevronDownIcon } from '@lucide/svelte'
  import { cn } from 'cnfn'
  import Hls from 'hls.js'
  import { toast } from 'svelte-sonner'
  import TrackListing from './listings/TrackListing.svelte'
  import Spinner from './Spinner.svelte'

  let { show = $bindable(), isPaused = $bindable() }: { show: boolean, isPaused: boolean } = $props()

  $effect(() => {
    if (nowPlaying.current) {
      isPaused = true

      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: nowPlaying.current.title,
          artist: nowPlaying.current.user.username,
          album: 'Sveltrum',
          artwork: [
            {
              src: nowPlaying.current.artwork_url ?? '',
              sizes: '500x500',
              type: 'image/jpeg',
            },
          ],
        })
      }
    }
  })

  const applySource = (track: Track) => (element: HTMLAudioElement) => {
    getTrackSource(track.id).then((url) => {
      if (url.isErr()) {
        toast.error(`failed to get track source: ${url.error}`)
        return
      }

      if (!Hls.isSupported()) {
        toast.error('hls is not supported')
        return
      }

      const hls = new Hls()
      hls.loadSource(url.value)
      hls.attachMedia(element)
    })
  }

  $effect(() => {
    if (nowPlaying.current) {
      isPaused = true

      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: nowPlaying.current.title,
          artist: nowPlaying.current.user.username,
          album: 'Sveltrum',
          artwork: [
            {
              src: nowPlaying.current.artwork_url ?? '',
              sizes: '500x500',
              type: 'image/jpeg',
            },
          ],
        })
      }
    }
  })
</script>

{#if nowPlaying.current}
  {@const track = nowPlaying.current}

  <div
    class={cn(
      'z-50 fixed inset-x-0 overflow-y-scroll place-items-center md:grid-cols-2 grid grid-cols-1 gap-x-8 bg-zinc-700/75 backdrop-blur-lg p-4 h-full transition-[top] duration-300',
      show ? 'top-0' : 'top-[100%]',
    )}
  >
    <button
      onclick={() => show = false}
      class='flex absolute justify-center items-center bg-zinc-100/10 active:opacity-50 top-4 right-4 rounded-full size-10 active:scale-90 transition-transform'
    >
      <ChevronDownIcon size={16} strokeWidth={3} />
    </button>

    <div class='flex flex-col max-md:mt-16 gap-4 w-full md:max-w-sm'>
      {#if track.artwork_url}
        <img src={track.artwork_url.replace('large', 't500x500')} class='mt-12 aspect-square rounded-xl w-full' alt="">
      {:else}
        <div class='mt-12 rounded-xl aspect-square bg-zinc-700 w-full md:max-w-md'></div>
      {/if}

      <hgroup>
        <h1 class='font-medium text-2xl'>{track.title}</h1>

        <a href='/user/{track.user.id}' class='text-white/50 text-xl' onclick={() => show = false}>
          {track.user.username}
        </a>
      </hgroup>

      {#key track}
        <audio
          class='h-10'
          bind:paused={isPaused}
          controls
        {@attach track && applySource(track)}>
        </audio>
      {/key}
    </div>

    <div class='flex flex-col w-full gap-4 md:max-w-sm'>
      <h2 class='text-2xl mt-8 font-medium'>Related tracks</h2>

      {#await getRelatedTracks(track.id)}
        <Spinner />
      {:then relatedTracks}
        {#if relatedTracks.isErr()}
          Failed
        {:else}
          {#each relatedTracks.value.collection as track}
            <TrackListing {track} />
          {/each}
        {/if}

      {/await}
    </div>
  </div>
{/if}

```

# src/lib/components/Spinner.svelte

```svelte
    <div class='mx-auto mt-16 size-9 border-3 border-dashed opacity-50 animate-spin rounded-full'></div>

```

# src/lib/global.svelte.ts

```ts
import type { Track } from './schemas/track'
import { Ref } from './ref.svelte'

export const nowPlaying = new Ref<Track | null>(null)

```

# src/lib/ref.svelte.ts

```ts
export class Ref<T> {
  private state: T

  constructor(value: T) {
    this.state = $state(value)
  }

  get current() {
    return this.state
  }

  set current(value: T) {
    this.state = value
  }
}

```

# src/lib/schemas/playlist.ts

```ts
import { z } from 'zod'
import { track } from './track'
import { user } from './user'

export const playlist = z.strictObject({
  artwork_url: z.string().nullable(),
  created_at: z.iso.datetime(),
  description: z.string().nullish(),
  duration: z.number(),
  embeddable_by: z.enum(['all', 'none', 'me']).optional(),
  genre: z.string().nullish(),
  id: z.number(),
  kind: z.literal('playlist'),
  label_name: z.string().nullish(),
  last_modified: z.iso.datetime(),
  license: z.string().optional(),
  likes_count: z.number().nullable(),
  managed_by_feeds: z.boolean(),
  permalink: z.string(),
  permalink_url: z.url(),
  public: z.boolean(),
  purchase_title: z.string().nullish(),
  purchase_url: z.url().nullish(),
  release_date: z.string().nullable(),
  reposts_count: z.number(),
  secret_token: z.string().nullable(),
  sharing: z.enum(['public', 'private']),
  tag_list: z.string().optional(),
  title: z.string(),
  uri: z.url(),
  user_id: z.number(),
  is_album: z.boolean(),
  published_at: z.iso.datetime().nullable(),
  display_date: z.iso.datetime(),
  user,
  set_type: z.string(),
  track_count: z.number(),
  tracks: z.union([track, track.pick({
    id: true,
    kind: true,
    monetization_model: true,
    policy: true,
  })]).array().optional(),
})

export type Playlist = z.output<typeof playlist>

```

# src/lib/schemas/track.ts

```ts
import { z } from 'zod'
import { user } from './user'

export const track = z.strictObject({
  artwork_url: z.url().nullable(),
  caption: z.string().nullable(),
  commentable: z.boolean(),
  comment_count: z.number().nullable(),
  created_at: z.iso.datetime(),
  description: z.string().nullable(),
  downloadable: z.boolean(),
  download_count: z.number().nullable(),
  duration: z.number(),
  full_duration: z.number(),
  embeddable_by: z.enum(['all', 'none', 'me']),
  genre: z.string().nullable(),
  has_downloads_left: z.boolean(),
  id: z.number(),
  kind: z.literal('track'),
  label_name: z.string().nullable(),
  last_modified: z.iso.datetime(),
  license: z.string(),
  likes_count: z.number().nullable(),
  permalink: z.string(),
  permalink_url: z.url(),
  playback_count: z.number().nullable(),
  public: z.boolean(),
  publisher_metadata: z.strictObject({
    id: z.number(),
    urn: z.string(),
    artist: z.string().optional(),
    publisher: z.string().optional(),
    album_title: z.string().optional(),
    contains_music: z.boolean().optional(),
    upc_or_ean: z.string().optional(),
    iswc: z.string().optional(),
    isrc: z.string().optional(),
    explicit: z.boolean().optional(),
    p_line: z.string().optional(),
    p_line_for_display: z.string().optional(),
    c_line: z.string().optional(),
    c_line_for_display: z.string().optional(),
    writer_composer: z.string().optional(),
    release_title: z.string().optional(),
  }).nullable(),
  purchase_title: z.string().nullable(),
  purchase_url: z.url().nullable(),
  release_date: z.string().nullable(),
  reposts_count: z.number(),
  secret_token: z.string().nullable(),
  sharing: z.enum(['public', 'private']),
  state: z.enum(['finished', 'processing']),
  streamable: z.boolean(),
  tag_list: z.string(),
  title: z.string(),
  uri: z.url(),
  urn: z.string(),
  user_id: z.number(),
  visuals: z.strictObject({
    urn: z.string(),
    enabled: z.boolean(),
    visuals: z.strictObject({
      urn: z.string(),
      entry_time: z.number(),
      visual_url: z.url(),
      link: z.url().optional(),
    }).array(),
    tracking: z.null(),
  }).nullable(),
  waveform_url: z.url(),
  display_date: z.iso.datetime(),
  media: z.strictObject({
    transcodings: z
      .array(
        z.strictObject({
          url: z.url(),
          preset: z.enum(['opus_0_0', 'aac_160k', 'mp3_0_0', 'abr_sq', 'mp3_1_0', 'mp3_0_1', 'mp3_standard']),
          duration: z.number(),
          snipped: z.boolean(),
          format: z.strictObject({
            protocol: z.enum(['hls', 'progressive', 'ctr-encrypted-hls', 'cbc-encrypted-hls']),
            mime_type: z.enum(['audio/mp4; codecs="mp4a.40.2"', 'audio/mpegurl', 'audio/mpeg', 'audio/ogg; codecs="opus"']),
          }),
          quality: z.literal('sq'),
          is_legacy_transcoding: z.boolean(),
        }),
      ),
  }),
  station_urn: z.string(),
  station_permalink: z.string(),
  track_authorization: z.string(),
  monetization_model: z.enum(['AD_SUPPORTED', 'BLACKBOX', 'NOT_APPLICABLE', 'SUB_HIGH_TIER']),
  policy: z.enum(['MONETIZE', 'BLOCK', 'SNIP', 'ALLOW']),
  user,
})

export type Track = z.output<typeof track>

```

# src/lib/schemas/user.ts

```ts
import { z } from 'zod'

export const user = z.strictObject({
  avatar_url: z.url(),
  city: z.string().nullable(),
  comments_count: z.number().optional(),
  country_code: z.string().nullable(),
  created_at: z.iso.datetime().optional(),
  creator_subscriptions: z.strictObject({
    product: z.strictObject({
      id: z.string(),
    }),
  }).array().optional(),
  creator_subscription: z.strictObject({
    product: z.strictObject({
      id: z.string(),
    }),
  }).optional(),
  description: z.string().nullish(),
  followers_count: z.number(),
  followings_count: z.number().optional(),
  first_name: z.string(),
  full_name: z.string(),
  groups_count: z.number().optional(),
  id: z.number(),
  kind: z.literal('user'),
  last_modified: z.iso.datetime(),
  last_name: z.string(),
  likes_count: z.number().optional(),
  playlist_likes_count: z.number().optional(),
  permalink: z.string(),
  permalink_url: z.url(),
  playlist_count: z.number().optional(),
  reposts_count: z.number().nullish(),
  track_count: z.number().optional(),
  uri: z.url(),
  urn: z.string(),
  username: z.string(),
  verified: z.boolean(),
  visuals: z.strictObject({
    urn: z.string(),
    enabled: z.boolean(),
    visuals: z.strictObject({
      urn: z.string(),
      entry_time: z.number(),
      visual_url: z.url(),
      link: z.url().optional(),
    }).array(),
    tracking: z.null(),
  }).nullish(),
  badges: z.strictObject({
    pro: z.boolean(),
    creator_mid_tier: z.boolean(),
    pro_unlimited: z.boolean(),
    verified: z.boolean(),
  }),
  station_urn: z.string().optional(),
  station_permalink: z.string().optional(),
  date_of_birth: z.string().nullish(),
})

export type User = z.output<typeof user>

```

# src/routes/+layout.svelte

```svelte
<script lang='ts'>
  import BottomNav from '$lib/components/BottomNav.svelte'
  import NowPlayingView from '$lib/components/NowPlayingView.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
  import { NuqsAdapter } from 'nuqs-svelte/adapters/svelte-kit'
  import { Toaster } from 'svelte-sonner'
  import '../app.css'

  const { children } = $props()

  let isPaused = $state(true)
  let showNowPlayingView = $state(false)
</script>

<NuqsAdapter>
  <svelte:boundary>
    <div class='mb-64'>
      {@render children()}
    </div>

    <BottomNav bind:show={showNowPlayingView} bind:isPaused />
    <NowPlayingView bind:show={showNowPlayingView} bind:isPaused />

    {#snippet pending()}
      <Spinner />
    {/snippet}
    {#snippet failed(error)}
      {error}
    {/snippet}
  </svelte:boundary>
</NuqsAdapter>

<Toaster richColors />

```

# src/routes/+page.svelte

```svelte
<script lang='ts'>
  import { getSelections } from '$lib/api/discovery.remote'
  import Button from '$lib/components/Button.svelte'
  // import PlaylistListing from '$lib/components/listings/PlaylistListing.svelte'
  // import Spinner from '$lib/components/Spinner.svelte'
  import { toast } from 'svelte-sonner'

  // await getSelections().then()

  const selections = await getSelections()

  console.log(selections, 'arrived')

// if (selections.isErr()) {
    // toast.error(`${selections.error}`)
  // }
// try {

  // }
  // catch (error) {
  //   toast.error(error)
  // }
</script>

<div class='max-w-xl mx-auto p-4 flex flex-col gap-4'>
  <div class='my-16 flex flex-col gap-4'>
    <h1 class='mx-auto text-center text-3xl font-mediums'>Sveltrum</h1>
    <div class='flex gap-4 justify-center'>
      <Button href='https://tijn.dev/sveltrum'>View on GitHub</Button>
    </div>
  </div>

  <h2 class='text-2xl font-medium'>Trending playlists</h2>

  <!-- {#await getSelections()}
    <Spinner />
  {:then selections}
    {#if selections.isErr()}
      Faield
    {:else}
      {#each selections.value as selection}
        {#each selection.items.collection as playlist}
          <PlaylistListing playlist={playlist} />
        {/each}
      {/each}
    {/if}

    {JSON.stringify(selections)}
  {/await} -->
</div>

```

# src/routes/playlist/[id]/+page.svelte

```svelte
<script lang='ts'>
  import type { Playlist } from '$lib/schemas/playlist'
  import type { Track } from '$lib/schemas/track'
  import { page } from '$app/state'
  import { getPlaylistById, getTracksByIds } from '$lib/api/get-by-id.remote'
  import Button from '$lib/components/Button.svelte'
  import TrackListing from '$lib/components/listings/TrackListing.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
  import { err } from 'neverthrow'
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'

  const id = Number(page.params!.id)

  let playlist: Playlist | null = $state(null)

  let isLoading = $state(false)

  let tracks = $state<Track[]>([])

  let currentIndex = $state(0)

  let hasMoreTracks = $state(true)

  onMount(async () => {
    const res = await getPlaylistById(id)

    if (res.isErr()) {
      toast.error(`failed to get playlist: ${res.error}`)
      return
    }

    playlist = res.value
  })

  async function doFetch() {
    if (!playlist?.tracks) {
      return
    }

    isLoading = true

    const newTracks = await getTracksByIds({
      ids: playlist.tracks.map(({ id }) => id),
      index: currentIndex,
    })

    if (newTracks.isErr()) {
      return err(newTracks.error)
    }

    hasMoreTracks = newTracks.value.hasMore

    tracks = [...tracks, ...newTracks.value.tracks]

    isLoading = false
  }

  doFetch()
</script>

<svelte:head>
  <title>{playlist?.title} - {playlist?.user.username} &bull; sveltrum</title>
  <link rel='icon' href={playlist?.artwork_url} />
</svelte:head>

{#if playlist?.artwork_url}
  <img src={playlist.artwork_url.replace('large', 't500x500')} class='w-full aspect-square md:max-w-md' alt="">
{/if}

<div class='flex flex-col z-50 gap-4 w-full sticky p-4 top-0 inset-x-0  bg-zinc-700/75 backdrop-blur-lg'>
  <h1 class='font-medium text-2xl'>{playlist?.title}</h1>
</div>

<main class='p-4 flex flex-col gap-4'>

  {#each tracks as track}
    <TrackListing {track} inAlbum={playlist?.is_album} />
  {/each}

  {#if isLoading}
    <Spinner />
  {:else if hasMoreTracks}
    <Button
      class='w-full mt-8'
      onclick={() => {
        currentIndex++
        doFetch()
      }}
    >
      Load more
    </Button>
  {/if}
</main>

```

# src/routes/search/+page.svelte

```svelte
<script lang='ts'>
  import type { Playlist } from '$lib/schemas/playlist'
  import type { Track } from '$lib/schemas/track'
  import type { User } from '$lib/schemas/user'
  import type { RemoteQueryFunction } from '@sveltejs/kit'
  import type { Result } from 'neverthrow'
  import { searchPlaylists, searchTracks, searchUsers } from '$lib/api/search.remote'
  import Button from '$lib/components/Button.svelte'
  import PlaylistListing from '$lib/components/listings/PlaylistListing.svelte'
  import TrackListing from '$lib/components/listings/TrackListing.svelte'
  import UserListing from '$lib/components/listings/UserListing.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
  import { SearchIcon } from '@lucide/svelte'
  import { parseAsString, useQueryState } from 'nuqs-svelte'
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'

  let isLoading = $state(false)

  let results = $state<(Track | Playlist | User)[]>([])

  const query = useQueryState('q', { shallow: false, history: 'push' })

  const selectedKind = useQueryState('kind', parseAsString.withDefault('tracks').withOptions({
    shallow: false,
    history: 'push',
  }))

  onMount(() => {
    query && doFetch()
  })

  function searchFor(kind: string):
    RemoteQueryFunction<
      {
        query: string
        limit?: number | undefined
        index?: number | undefined
      },
      Result<any, Error>
    > {
    switch (kind) {
      case 'playlists': return searchPlaylists
      case 'users': return searchUsers
      default: return searchTracks
    }
  }

  let currentIndex = $state(0)

  let hasMoreResults = $state(false)

  async function doFetch() {
    if (!query.current) {
      return
    }

    isLoading = true

    const res = await searchFor(selectedKind.current ?? 'tracks')({
      query: query.current,
      index: currentIndex,
    })

    if (res.isErr()) {
      toast.error(`failed to search: ${res.error}`)
      return
    }

    hasMoreResults = res.value.hasMore

    results = [...results, ...res.value]
    isLoading = false
  }

  function onsubmit(e: Event) {
    e.preventDefault()
    results = []
    currentIndex = 0
    doFetch()
  }
</script>

<svelte:head>
  <title>results for '{query.current}' &bull; sveltrum</title>
</svelte:head>

<div class='top-0 z-50 sticky inset-x-0 flex flex-col gap-4 bg-zinc-700/75 backdrop-blur-lg p-4 w-full'>
  <form {onsubmit} class='flex gap-2'>
    <input
      type='text'
      bind:value={query.current}
      class='bg-zinc-700 px-4 rounded-full h-10 grow'
      placeholder='Search'
    />

    <Button type='submit' size='icon'>
      <SearchIcon size={16} strokeWidth={3} />
    </Button>
  </form>
  <div class='flex gap-2'>
    {#each ['tracks', 'playlists', 'users'] as kind}
      {#key selectedKind.current}
        <Button
          variant={selectedKind.current === kind ? 'primary' : 'secondary'}
          class='capitalize'
          onclick={() => {
            selectedKind.current = kind
            results = []
            currentIndex = 0
            doFetch()
          }}
        >
          {kind}
        </Button>
      {/key}

    {/each}
  </div>
</div>

<main class='p-4'>
  <div class='flex flex-col gap-4'>
    {#each results as result}
      {#if selectedKind.current === 'tracks'}
        <TrackListing track={result as Track} />
      {:else if selectedKind.current === 'playlists'}
        <PlaylistListing playlist={result as Playlist} />
      {:else if selectedKind.current === 'users'}
        <UserListing user={result as User} />
      {/if}
    {/each}
  </div>

  {#if isLoading}
    <Spinner />
  {:else}
    {#if query && hasMoreResults}
      <Button
        class='mt-8 w-full'
        onclick={() => {
          currentIndex++
          doFetch()
        }}
      >
        Load more
      </Button>
    {/if}
  {/if}
</main>

```

# src/routes/user/[id]/+page.svelte

```svelte
<script lang='ts'>
  import type { Playlist } from '$lib/schemas/playlist'
  import type { Track } from '$lib/schemas/track'
  import type { User } from '$lib/schemas/user'
  import { page } from '$app/state'
  import { getUserById } from '$lib/api/get-by-id.remote'
  import { getUserPlaylists, getUserTracks } from '$lib/api/user.remote'
  import Button from '$lib/components/Button.svelte'
  import PlaylistListing from '$lib/components/listings/PlaylistListing.svelte'
  import TrackListing from '$lib/components/listings/TrackListing.svelte'
  import UserListing from '$lib/components/listings/UserListing.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
  import { parseAsString, useQueryState } from 'nuqs-svelte'
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'

  const id = Number(page.params!.id)

  let user: User | null = $state(null)

  const selectedKind = useQueryState('kind', parseAsString.withDefault('tracks').withOptions({
    shallow: false,
    history: 'push',
  }))

  let isLoading = $state(false)

  let results = $state<(Track | Playlist | User)[]>([])

  function getUser(kind: string) {
    switch (kind) {
      case 'playlists': return getUserPlaylists
      default: return getUserTracks
    }
  }

  let currentIndex = $state(0)
  let hasMoreResults = $state(true)

  onMount(async () => {
    const res = await getUserById(id)

    if (res.isErr()) {
      toast.error(`faield to get user: ${res.error}`)
      return
    }

    user = res.value
  })

  async function doFetch() {
    isLoading = true

    const kind = selectedKind.current ?? 'tracks'

    const res = await getUser(kind)({
      id,
      index: currentIndex,
    })

    if (res.isErr()) {
      toast.error(`faield to get user ${kind}: ${res.error}`)
      return
    }

    hasMoreResults = res.value.hasMore

    results = [...results, ...res.value.results]
    isLoading = false
  }

  doFetch()
</script>

<svelte:head>
  <title>{user?.username} &bull; sveltrum</title>
  <link rel='icon' href={user?.avatar_url} />
</svelte:head>

<img src={user?.avatar_url.replace('large', 't500x500')} class='w-full aspect-square md:max-w-md' alt="">

<div class='top-0 z-50 sticky inset-x-0 flex flex-col gap-4 bg-zinc-700/75 backdrop-blur-lg p-4 w-full'>
  <h1 class='font-medium text-2xl'>{user?.username}</h1>
</div>

<main class='flex flex-col gap-4 p-4'>

  <div class='flex gap-2'>
    {#each ['tracks', 'playlists'] as kind}
      <Button
        variant={selectedKind.current === kind ? 'primary' : 'secondary'}
        class='capitalize'
        onclick={() => {
          selectedKind.current = kind
          results = []
          currentIndex = 0
          doFetch()
        }}
      >
        {kind}
      </Button>
    {/each}
  </div>

  <div class='flex flex-col gap-4'>
    {#each results as result}
      {#if selectedKind.current === 'tracks'}
        <TrackListing track={result as Track} />
      {:else if selectedKind.current === 'playlists'}
        <PlaylistListing playlist={result as Playlist} />
      {:else if selectedKind.current === 'users'}
        <UserListing user={result as User} />
      {/if}
    {/each}
  </div>

  {#if isLoading}
    <Spinner />
  {:else if hasMoreResults}
    <Button
      class='mt-8 w-full'
      onclick={() => {
        currentIndex++
        doFetch()
      }}
    >
      Load more
    </Button>
  {/if}
</main>

```

# svelte.config.js

```js
import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
export default {
  compilerOptions: {
    experimental: {
      async: true,
    },
  },
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    experimental: {
      remoteFunctions: true,
    },
  },
}

```

# tsconfig.json

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler"
  }

  // Path aliases are handled by https://svelte.dev/docs/kit/configuration#alias
  // except $lib which is handled by https://svelte.dev/docs/kit/configuration#files
  //
  // If you want to overwrite includes/excludes, make sure to copy over the relevant includes/excludes
  // from the referenced tsconfig.json - TypeScript does not merge them in
}

```

# vite.config.ts

```ts
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
})

```


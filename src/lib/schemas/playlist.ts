import { type } from 'arktype'
import { track } from './track'
import { user } from './user'

export const playlist = type({
  '+': 'reject',
  artwork_url: 'string.url | null',
  created_at: 'string.date',
  'description?': 'string | null',
  duration: 'number',
  embeddable_by: '"all"| "none"| "me"?',
  genre: 'string?',
  id: 'number',
  kind: '"playlist"',
  'label_name?': 'string | null',
  last_modified: 'string.date',
  license: 'string?',
  likes_count: 'number?',
  managed_by_feeds: 'boolean',
  permalink: 'string',
  permalink_url: 'string.url',
  public: 'boolean',
  'purchase_title?': 'string | null | undefined',
  'purchase_url?': 'string.url | null | undefined',
  release_date: 'string | null',
  reposts_count: 'number',
  secret_token: 'string | null',
  sharing: '"public" | "private"',
  tag_list: 'string?',
  title: 'string',
  uri: 'string.url',
  user_id: 'number',
  is_album: 'boolean',
  published_at: 'string.date | null',
  display_date: 'string.date',
  user,
  set_type: 'string',
  track_count: 'number',
  tracks: track.or(track.pick('id', 'kind', 'monetization_model', 'policy')).array().optional(),
})

export type Playlist = type.infer<typeof playlist>

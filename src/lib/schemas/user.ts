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

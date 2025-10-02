import { type } from "arktype";

export const user = type({
  "+": "reject",
  avatar_url: "string.url",
  city: "string | null",
  comments_count: "number?",
  country_code: "string | null",
  created_at: "string.date?",
  creator_subscriptions: type({
    product: {
      id: "string",
    },
  })
    .array()
    .optional(),
  creator_subscription: type({
    product: {
      id: "string",
    },
  }).optional(),
  "description?": "string | null",
  followers_count: "number",
  followings_count: "number?",
  first_name: "string",
  full_name: "string",
  groups_count: "number?",
  id: "number",
  kind: "'user'",
  last_modified: "string.date",
  last_name: "string",
  likes_count: "number?",
  playlist_likes_count: "number?",
  permalink: "string",
  permalink_url: "string.url",
  playlist_count: "number?",
  "reposts_count?": "number | null",
  track_count: "number?",
  uri: "string.url",
  urn: "string",
  username: "string",
  verified: "boolean",
  "visuals?": type({
    urn: "string",
    enabled: "boolean",
    visuals: type({
      urn: "string",
      entry_time: "number",
      visual_url: "string.url",
      link: "string.url?",
    }).array(),
    tracking: "null",
  }).or("null"),
  badges: type({
    pro: "boolean",
    creator_mid_tier: "boolean",

    pro_unlimited: "boolean",
    verified: "boolean",
  }),
  station_urn: "string?",
  station_permalink: "string?",
  "date_of_birth?": "string | null",
});

export type User = type.infer<typeof user>;

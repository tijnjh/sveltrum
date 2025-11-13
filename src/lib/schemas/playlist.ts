import { Track } from "./track";
import { User } from "./user";
import * as v from "valibot";

export const Playlist = v.strictObject({
  artwork_url: v.nullable(v.string()),
  created_at: v.pipe(v.string(), v.isoTimestamp()),
  description: v.optional(v.nullable(v.string())),
  display_date: v.pipe(v.string(), v.isoTimestamp()),
  duration: v.number(),
  embeddable_by: v.optional(v.picklist(["all", "none", "me"])),
  genre: v.optional(v.nullable(v.string())),
  id: v.number(),
  is_album: v.boolean(),
  kind: v.literal("playlist"),
  label_name: v.optional(v.nullable(v.string())),
  last_modified: v.pipe(v.string(), v.isoTimestamp()),
  license: v.optional(v.string()),
  likes_count: v.nullable(v.number()),
  managed_by_feeds: v.boolean(),
  permalink: v.string(),
  permalink_url: v.pipe(v.string(), v.url()),
  public: v.boolean(),
  published_at: v.nullable(v.pipe(v.string(), v.isoTimestamp())),
  purchase_title: v.optional(v.nullable(v.string())),
  purchase_url: v.nullish(v.pipe(v.string(), v.url())),
  release_date: v.nullable(v.string()),
  reposts_count: v.number(),
  secret_token: v.nullable(v.string()),
  set_type: v.string(),
  sharing: v.picklist(["public", "private"]),
  tag_list: v.optional(v.string()),
  title: v.string(),
  track_count: v.number(),
  tracks: v.optional(
    v.array(
      v.union([
        Track,
        v.pick(Track, ["id", "kind", "monetization_model", "policy"]),
      ]),
    ),
  ),
  uri: v.pipe(v.string(), v.url()),
  user: User,
  user_id: v.number(),
});

export type Playlist = v.InferOutput<typeof Playlist>;

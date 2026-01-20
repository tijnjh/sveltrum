import { query } from "$app/server";
import { Collection } from "$lib/schemas/collection";
import { Paginated } from "$lib/schemas/paginated";
import { Playlist } from "$lib/schemas/playlist";
import { Track } from "$lib/schemas/track";
import { User } from "$lib/schemas/user";
import { $api, getPermalinkPath } from "./utils";
import * as v from "valibot";

export const resolveUser = query(v.string(), (user) =>
  $api(getPermalinkPath(user), {
    schema: User,
  }),
);

export const getUserById = query(v.number(), (id) =>
  $api(`/users/${id}`, {
    schema: User,
  }),
);

export const getUserTracks = query(
  v.object({
    ...Paginated.entries,
    id: v.number(),
  }),
  async ({ id, offset, limit }) => {
    const res = await $api(`/users/${id}/tracks`, {
      params: { limit, offset },
      headers: { "Accept-Language": "en-US,en;q=0.5" },
      schema: Collection(Track),
    });
    return res.collection;
  },
);

export const getUserPlaylists = query(
  v.object({
    ...Paginated.entries,
    id: v.number(),
  }),
  async ({ id, offset, limit }) => {
    const res = await $api(`/users/${id}/playlists`, {
      params: { limit, offset },
      schema: Collection(Playlist),
    });
    return res.collection;
  },
);

import { query } from "$app/server";
import { playlist } from "$lib/schemas/playlist";
import { track } from "$lib/schemas/track";
import { user } from "$lib/schemas/user";
import { $api, withPagination } from "./utils";
import type { Type } from "arktype";
import { type } from "arktype";

const searchSchema = type({
  query: "string",
  limit: "number?",
  index: "number?",
});

function baseSearch<S extends Type<T>, T = type.infer<S>>(
  kind: string,
  schema: S,
) {
  return query(
    searchSchema,
    withPagination(async ({ limit, offset, query }) => {
      const res = await $api({
        path: `/search/${kind}`,
        params: { q: query, limit, offset },
        schema: type({
          collection: schema.array(),
        }),
      });
      return res.collection;
    }),
  );
}

export const searchTracks = baseSearch("tracks", track);
export const searchPlaylists = baseSearch("playlists", playlist);
export const searchUsers = baseSearch("users", user);

import "../chunks/event-state.js";
import "@sveltejs/kit";
import "../chunks/query.js";
import { s, b, a, f, g, c, e } from "../chunks/api.remote.js";
import { e as e2, c as c2, g as g2, f as f2, a as a2, b as b2, s as s2 } from "../chunks/api.remote.js";
import "zod";
import "../chunks/false.js";
import "../chunks/paths.js";
for (const [name, fn] of Object.entries({ getPlaylistById: e, getTrackById: c, getTracksByIds: g, getUserById: f, searchPlaylists: a, searchTracks: b, searchUsers: s })) {
  fn.__.id = "15oduhv/" + name;
  fn.__.name = name;
}
export {
  e2 as getPlaylistById,
  c2 as getTrackById,
  g2 as getTracksByIds,
  f2 as getUserById,
  a2 as searchPlaylists,
  b2 as searchTracks,
  s2 as searchUsers
};

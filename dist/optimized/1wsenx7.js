import "../chunks/event-state.js";
import "@sveltejs/kit";
import "../chunks/query.js";
import "arktype";
import "ofetch";
import { g, c, b } from "../chunks/soundcloud.remote.js";
import { b as b2, c as c2, g as g2 } from "../chunks/soundcloud.remote.js";
import "../chunks/false.js";
import "../chunks/paths.js";
for (const [name, fn] of Object.entries({ getResults: b, getScClientId: c, getTrackById: g })) {
  fn.__.id = "1wsenx7/" + name;
  fn.__.name = name;
}
export {
  b2 as getResults,
  c2 as getScClientId,
  g2 as getTrackById
};

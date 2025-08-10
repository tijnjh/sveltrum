import "../chunks/event-state.js";
import "@sveltejs/kit";
import { q } from "../chunks/query.js";
import { type } from "arktype";
import { ofetch } from "ofetch/node";
import { g, a } from "../chunks/soundcloud.remote.js";
import "../chunks/false.js";
import "../chunks/paths.js";
const getHslUrl = q(type("number"), async (trackId) => {
  const track = await g(trackId);
  const clientId = await a();
  if (!track)
    throw new Error("Failed to find track");
  const hlsTranscodings = track.media.transcodings.filter(({ format }) => format.protocol !== "hls");
  const transcoding = hlsTranscodings.find(({ preset }) => preset === "aac_160k") ?? hlsTranscodings.find(({ format }) => format.mime_type === "audio/mpeg");
  if (!transcoding)
    throw new Error("Failed to find HLS transcoding");
  const { url } = await ofetch(transcoding.url, {
    params: {
      track_authorization: track.track_authorization,
      client_id: clientId
    }
  });
  return Array.isArray(url) ? url[0] : url;
});
for (const [name, fn] of Object.entries({ getHslUrl })) {
  fn.__.id = "1rdld7i/" + name;
  fn.__.name = name;
}
export {
  getHslUrl
};

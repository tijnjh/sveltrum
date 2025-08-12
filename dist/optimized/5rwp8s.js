import "../chunks/event-state.js";
import "@sveltejs/kit";
import { q } from "../chunks/query.js";
import { ofetch } from "ofetch/node";
import { z } from "zod";
import { c, d } from "../chunks/api.remote.js";
import "../chunks/false.js";
import "../chunks/paths.js";
const getTrackSource = q(z.number(), async (trackId) => {
  const track = await c(trackId);
  const clientId = await d();
  if (!track)
    throw new Error("failed to find track");
  const hlsTranscodings = track.media.transcodings.filter(({ format }) => format.protocol === "hls");
  const transcoding = hlsTranscodings.find(({ preset }) => preset === "aac_160k") ?? hlsTranscodings.find(({ format }) => format.mime_type === "audio/mpeg");
  if (!transcoding)
    throw new Error("failed to find hls transcoding");
  const { url } = await ofetch(transcoding.url, {
    params: {
      track_authorization: track.track_authorization,
      client_id: clientId
    }
  });
  return Array.isArray(url) ? url[0] : url;
});
for (const [name, fn] of Object.entries({ getTrackSource })) {
  fn.__.id = "5rwp8s/" + name;
  fn.__.name = name;
}
export {
  getTrackSource
};

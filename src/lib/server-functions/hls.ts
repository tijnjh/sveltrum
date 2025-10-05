import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { ofetch } from "ofetch";
import { getTrackById } from "./get-by-id";
import { getClientId } from "./utils";

export const getTrackSource = createServerFn()
	.inputValidator(type.number)
	.handler(async ({ data: trackId }) => {
		const track = await getTrackById({ data: trackId });
		const clientId = await getClientId();

		if (!track) throw new Error("failed to find track");

		const hlsTranscodings = track.media.transcodings.filter(
			(t) => t.format.protocol === "hls",
		);

		const transcoding =
			hlsTranscodings.find(({ preset }) => preset === "aac_160k") ??
			hlsTranscodings.find(({ format }) => format.mime_type === "audio/mpeg");

		if (!transcoding) throw new Error("failed to find hls transcoding");

		const { url } = await ofetch(transcoding.url, {
			params: {
				track_authorization: track.track_authorization,
				client_id: clientId,
			},
		});

		return (Array.isArray(url) ? url[0] : url) as string;
	});

import { createServerFn } from "@tanstack/react-start";
import { ofetch } from "ofetch";
import { z } from "zod";
import { getTrackById } from "./track";
import { getClientId } from "./utils";

export const getTrackSource = createServerFn()
	.inputValidator(
		z.object({
			id: z.number(),
		}),
	)
	.handler(async ({ data: { id: trackId } }) => {
		const track = await getTrackById({ data: { id: trackId } });
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

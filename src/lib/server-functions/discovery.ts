import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { playlist } from "../schemas/playlist";
import { $api } from "./utils";


export const getSelections = createServerFn().handler(async () => {
	const res = await $api({
		path: "/mixed-selections",
		schema: type({
			collection: type({
				items: {
					collection: playlist.array(),
				},
			}).array(),
		}),
	});

	return res.collection;
})

import { createServerFn } from "@tanstack/react-start";
import type { Type } from "arktype";
import { type } from "arktype";
import { $api, withPagination } from "./utils";

const searchSchema = type({
	query: "string",
	limit: "number?",
	index: "number?",
});

function baseSearch<S extends Type<T>, T = type.infer<S>>(
	kind: string,
	schema: S,
) {
	return createServerFn()
		.inputValidator(searchSchema)
		.handler(async ({ data: { query, limit, index } }) => {
			const response = await $api({
				path: `/search/${kind}`,
				params: { query, limit, index },
				schema: withPagination(schema),
			});
			return response;
		});
}

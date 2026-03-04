import { readFavoritesFromDrive, writeFavoritesToDrive } from "$lib/server/google";
import { getValidAccessToken } from "$lib/server/session";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies }) => {
	const accessToken = await getValidAccessToken(cookies);
	if (!accessToken) error(401, "Not signed in");

	const favorites = await readFavoritesFromDrive(accessToken);
	return json(favorites);
};

export const PUT: RequestHandler = async ({ cookies, request }) => {
	const accessToken = await getValidAccessToken(cookies);
	if (!accessToken) error(401, "Not signed in");

	const trackIds: number[] = await request.json();
	await writeFavoritesToDrive(accessToken, trackIds);
	return json({ ok: true });
};

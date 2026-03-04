import { buildAuthUrl } from "$lib/server/google";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = ({ cookies }) => {
	const state = crypto.randomUUID();
	cookies.set("oauth_state", state, {
		path: "/",
		httpOnly: true,
		secure: false,
		sameSite: "lax",
		maxAge: 60 * 5,
	});
	redirect(302, buildAuthUrl(state));
};

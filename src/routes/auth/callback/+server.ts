import { exchangeCode, getUserInfo } from "$lib/server/google";
import { setSession } from "$lib/server/session";
import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const storedState = cookies.get("oauth_state");

	if (!code || !state || state !== storedState) {
		error(400, "Invalid OAuth callback");
	}

	cookies.delete("oauth_state", { path: "/" });

	const tokens = await exchangeCode(code);
	const user = await getUserInfo(tokens.access_token);

	await setSession(cookies, {
		user: { name: user.name, email: user.email, picture: user.picture },
		accessToken: tokens.access_token,
		refreshToken: tokens.refresh_token ?? "",
		expiresAt: Date.now() + tokens.expires_in * 1000,
	});

	redirect(302, "/");
};

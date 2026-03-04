import { clearSession } from "$lib/server/session";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = ({ cookies }) => {
	clearSession(cookies);
	redirect(302, "/");
};

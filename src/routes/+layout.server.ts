import { getSession } from "$lib/server/session";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
	const session = await getSession(cookies);
	return { user: session?.user ?? null };
};

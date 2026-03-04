import { SESSION_SECRET } from "$env/static/private";
import { refreshAccessToken } from "./google";
import type { Cookies } from "@sveltejs/kit";

const COOKIE_NAME = "session";
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export interface Session {
	user: { name: string; email: string; picture: string };
	accessToken: string;
	refreshToken: string;
	expiresAt: number;
}

function getKey(): Promise<CryptoKey> {
	const keyData = encoder.encode(SESSION_SECRET.slice(0, 32).padEnd(32, "0"));
	return crypto.subtle.importKey("raw", keyData, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function encrypt(data: string): Promise<string> {
	const key = await getKey();
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const encrypted = await crypto.subtle.encrypt(
		{ name: "AES-GCM", iv },
		key,
		encoder.encode(data),
	);
	const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
	combined.set(iv);
	combined.set(new Uint8Array(encrypted), iv.length);
	return btoa(String.fromCharCode(...combined));
}

async function decrypt(encoded: string): Promise<string> {
	const key = await getKey();
	const combined = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
	const iv = combined.slice(0, 12);
	const data = combined.slice(12);
	const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
	return decoder.decode(decrypted);
}

export async function setSession(cookies: Cookies, session: Session): Promise<void> {
	const encrypted = await encrypt(JSON.stringify(session));
	cookies.set(COOKIE_NAME, encrypted, {
		path: "/",
		httpOnly: true,
		secure: false,
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 30, // 30 days
	});
}

export async function getSession(cookies: Cookies): Promise<Session | null> {
	const value = cookies.get(COOKIE_NAME);
	if (!value) return null;
	try {
		return JSON.parse(await decrypt(value));
	} catch {
		return null;
	}
}

export function clearSession(cookies: Cookies): void {
	cookies.delete(COOKIE_NAME, { path: "/" });
}

export async function getValidAccessToken(cookies: Cookies): Promise<string | null> {
	const session = await getSession(cookies);
	if (!session) return null;

	if (Date.now() < session.expiresAt) {
		return session.accessToken;
	}

	// Token expired — refresh it
	try {
		const tokens = await refreshAccessToken(session.refreshToken);
		session.accessToken = tokens.access_token;
		session.expiresAt = Date.now() + tokens.expires_in * 1000;
		await setSession(cookies, session);
		return session.accessToken;
	} catch {
		clearSession(cookies);
		return null;
	}
}

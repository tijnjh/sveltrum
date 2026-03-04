import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from "$env/static/private";

const SCOPES = [
	"openid",
	"email",
	"profile",
	"https://www.googleapis.com/auth/drive.appdata",
].join(" ");

export function buildAuthUrl(state: string): string {
	const params = new URLSearchParams({
		client_id: GOOGLE_CLIENT_ID,
		redirect_uri: GOOGLE_REDIRECT_URI,
		response_type: "code",
		scope: SCOPES,
		state,
		access_type: "offline",
		prompt: "consent",
	});
	return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

interface TokenResponse {
	access_token: string;
	refresh_token?: string;
	expires_in: number;
	token_type: string;
}

export async function exchangeCode(code: string): Promise<TokenResponse> {
	const res = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			code,
			client_id: GOOGLE_CLIENT_ID,
			client_secret: GOOGLE_CLIENT_SECRET,
			redirect_uri: GOOGLE_REDIRECT_URI,
			grant_type: "authorization_code",
		}),
	});
	if (!res.ok) throw new Error(`Token exchange failed: ${await res.text()}`);
	return res.json();
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
	const res = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			refresh_token: refreshToken,
			client_id: GOOGLE_CLIENT_ID,
			client_secret: GOOGLE_CLIENT_SECRET,
			grant_type: "refresh_token",
		}),
	});
	if (!res.ok) throw new Error(`Token refresh failed: ${await res.text()}`);
	return res.json();
}

interface UserInfo {
	name: string;
	email: string;
	picture: string;
}

export async function getUserInfo(accessToken: string): Promise<UserInfo> {
	const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!res.ok) throw new Error(`Failed to get user info: ${await res.text()}`);
	return res.json();
}

export async function readFavoritesFromDrive(accessToken: string): Promise<number[]> {
	// Search for favorites.json in appDataFolder
	const searchRes = await fetch(
		`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${encodeURIComponent("name='favorites.json'")}&fields=files(id)`,
		{ headers: { Authorization: `Bearer ${accessToken}` } },
	);
	if (!searchRes.ok) return [];

	const { files } = (await searchRes.json()) as { files: { id: string }[] };
	if (!files?.length) return [];

	const contentRes = await fetch(
		`https://www.googleapis.com/drive/v3/files/${files[0].id}?alt=media`,
		{ headers: { Authorization: `Bearer ${accessToken}` } },
	);
	if (!contentRes.ok) return [];

	return contentRes.json();
}

export async function writeFavoritesToDrive(
	accessToken: string,
	trackIds: number[],
): Promise<void> {
	const headers = { Authorization: `Bearer ${accessToken}` };

	// Check if file already exists
	const searchRes = await fetch(
		`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${encodeURIComponent("name='favorites.json'")}&fields=files(id)`,
		{ headers },
	);

	const body = JSON.stringify(trackIds);
	const { files } = (await searchRes.json()) as { files: { id: string }[] };

	if (files?.length) {
		// Update existing file
		await fetch(`https://www.googleapis.com/upload/drive/v3/files/${files[0].id}?uploadType=media`, {
			method: "PATCH",
			headers: { ...headers, "Content-Type": "application/json" },
			body,
		});
	} else {
		// Create new file with multipart upload
		const metadata = JSON.stringify({
			name: "favorites.json",
			parents: ["appDataFolder"],
		});

		const boundary = "favorites_boundary";
		const multipart =
			`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n` +
			`--${boundary}\r\nContent-Type: application/json\r\n\r\n${body}\r\n` +
			`--${boundary}--`;

		await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
			method: "POST",
			headers: {
				...headers,
				"Content-Type": `multipart/related; boundary=${boundary}`,
			},
			body: multipart,
		});
	}
}

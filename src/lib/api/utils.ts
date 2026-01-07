import { isValidationError, up } from "up-fetch";

export const upfetch = up(fetch);

export const $api = up(fetch, async () => ({
  baseUrl: "https://api-v2.soundcloud.com",
  params: {
    client_id: await getClientId(),
  },
  onError: (error) => {
    if (isValidationError(error)) {
      for (const issue of error.issues) {
        console.error(issue);
        throw 0; // prevent the error from flooding the console
      }
    }
  },
}));

let clientId: string;
let clientIdExpiry: number;

export async function getClientId() {
  if (clientId && Date.now() < clientIdExpiry) return clientId;

  const html = await upfetch("https://soundcloud.com", {
    parseResponse: (r) => r.text(),
  });

  const scriptUrls = [
    ...html.matchAll(
      /<script crossorigin src="(https:\/\/a-v2\.sndcdn\.com\/assets\/[^"]+\.js)"><\/script>/g,
    ),
  ].map((m) => m[1]);

  if (scriptUrls.length === 0) {
    throw new Error("script not found");
  }

  for (const scriptUrl of scriptUrls) {
    const script = await upfetch(scriptUrl, {
      parseResponse: (r) => r.text(),
    });

    const id = script.match(/client_id:"([A-Za-z0-9]{32})"/)?.[1];

    if (id) {
      clientId = id;
      clientIdExpiry = Date.now() + 30 * 60 * 1000;
      return clientId;
    }
  }

  throw new Error("client id not found");
}

export function getPermalinkPath(...permalinks: string[]) {
  const permalinkUrl = `https://soundcloud.com/${permalinks.join("/")}`;
  const url = `/resolve?url=${encodeURIComponent(permalinkUrl)}`;
  return url;
}

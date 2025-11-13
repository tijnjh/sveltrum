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

  const scriptUrl = html.match(
    /<script crossorigin src="(https:\/\/a-v2\.sndcdn\.com\/assets\/0-[^"]+\.js)"><\/script>/,
  )?.[1];

  if (!scriptUrl) {
    throw new Error("script not found");
  }

  const script = await upfetch(scriptUrl, {
    parseResponse: (r) => r.text(),
  });

  const id = script.match(/client_id:"([A-Za-z0-9]{32})"/)?.[1];

  if (!id) {
    throw new Error("client id not found");
  }

  clientId = id;
  clientIdExpiry = Date.now() + 30 * 60 * 1000;

  return clientId;
}

export function getPermalinkPath(...permalinks: string[]) {
  const permalinkUrl = `https://soundcloud.com/${permalinks.join("/")}`;
  const url = `/resolve?url=${encodeURIComponent(permalinkUrl)}`;
  return url;
}

// import { query } from "$app/server";
// import { $api } from "./utils";
// import * as v from "valibot";

// tried to cook, realized genius blocks my vps
// maybe revisit this at some point in the future

// export const findLyrics = query(v.string(), async (query) => {
//   const res = await $api(
//     `https://genius.com/api/search/songs?q=${encodeURIComponent(query)}`,
//     {
//       schema: v.any(), // will add strict schema later
//     },
//   );

//   const trackId = res?.response?.sections?.[0].hits?.[0]?.result?.id;

//   if (!trackId) return;

//   const lyricsPage = await $api(`https://genius.com/songs/${trackId}`, {
//     schema: v.string(),
//   });

//   const preloadedState = lyricsPage.match(
//     /window\.__PRELOADED_STATE__\s*=\s*JSON\.parse\((['"`])(.*?)\1\)/s,
//   );

//   if (!preloadedState) return;

//   return preloadedState[2];

//   // yeah... idk either
//   //   const preloadedStateJson = preloadedState[2]
//   //     .replaceAll('\\"', '"')
//   //     .replaceAll("\\\\", "\\")
//   //     .replaceAll("\\'", "'");

//   const preloadedStateJson = preloadedState[2];

//   const lyricsNodes =
//     JSON.parse(preloadedStateJson).songPage.lyricsData.body.children;

//   const lyrics = convertToPlainText(lyricsNodes);

//   return lyrics.trim();
// });

// function convertToPlainText(node: unknown) {
//   if (!node) return "";

//   if (typeof node === "string") {
//     return node;
//   }

//   if (Array.isArray(node)) {
//     return node.map(convertToPlainText).join("");
//   }

//   if (typeof node === "object") {
//     // 1. Handle line breaks

//     if (node.tag === "br") {
//       return "\n";
//     }

//     if (node.children) {
//       return convertToPlainText(node.children);
//     }
//   }

//   return "";
// }

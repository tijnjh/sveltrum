import { query } from "$app/server";
import { Vibrant } from "node-vibrant/node";
import * as v from "valibot";

export const getThemeFromImageUrl = query(v.string(), async (url) => {
  const palette = await Vibrant.from(url).getPalette();

  const theme = {
    vibrant: palette.Vibrant?.hex,
    darkVibrant: palette.DarkVibrant?.hex,
    lightVibrant: palette.LightVibrant?.hex,
    muted: palette.Muted?.hex,
    darkMuted: palette.DarkMuted?.hex,
    lightMuted: palette.LightMuted?.hex,
  };

  return theme;
});

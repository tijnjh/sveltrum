interface ThemeVariables {
  vibrant?: string;
  darkVibrant?: string;
  lightVibrant?: string;
  muted?: string;
  darkMuted?: string;
  lightMuted?: string;
}

export class Theme {
  themeVariables = $state<ThemeVariables>({
    vibrant: undefined,
    darkVibrant: undefined,
    lightVibrant: undefined,
    muted: undefined,
    darkMuted: undefined,
    lightMuted: undefined,
  });

  reset() {
    this.themeVariables.vibrant = undefined;
    this.themeVariables.darkVibrant = undefined;
    this.themeVariables.lightVibrant = undefined;
    this.themeVariables.muted = undefined;
    this.themeVariables.darkMuted = undefined;
    this.themeVariables.lightMuted = undefined;
  }
}

export const theme = new Theme();

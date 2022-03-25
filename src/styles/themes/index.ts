import defaultTheme from "./default.theme";
import ausTheme from "./aus.theme";
import { Theme } from "./types";

const themes: Record<string, Theme> = {
  defaultTheme,
  ausTheme,
};

const DEFAULT_THEME = "defaultTheme";

let themeName = DEFAULT_THEME;
if (typeof window !== "undefined") {
  themeName = localStorage.getItem("samara_theme_name") || DEFAULT_THEME;
}

const theme = themes[themeName] || defaultTheme;

export default theme;
export type { Theme };

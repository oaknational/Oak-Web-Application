import { themeName } from "../../constants/themeName";

import defaultTheme from "./default.theme";
import ausTheme from "./aus.theme";
import { Theme } from "./types";

const themes: Record<string, Theme> = {
  defaultTheme,
  ausTheme,
};

const theme = themes[themeName || "defaultTheme"] || defaultTheme;

export default theme;
export type { Theme };

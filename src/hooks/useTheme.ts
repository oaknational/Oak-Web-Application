import { useEffect } from "react";

import { Theme, defaultTheme, ausTheme } from "../styles/themes";

import useLocalStorage, { dispatchLocalStorageEvent } from "./useLocalStorage";

// @TODO move to centralised local storage keys list
const LS_KEY_THEME = "theme";

const themeNames = ["default", "aus"] as const;
type ThemeName = typeof themeNames[number];

const themes: Record<ThemeName, Theme> = {
  default: defaultTheme,
  aus: ausTheme,
};

if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.oakThemes = {
    setTheme: (themeName: ThemeName) => {
      if (!themeNames.includes(themeName)) {
        return console.error(
          `Theme name must be one of: ${themeNames.join(", ")}`
        );
      }
      window.localStorage.setItem(LS_KEY_THEME, JSON.stringify(themeName));
      dispatchLocalStorageEvent();
    },
    availableThemes: themeNames,
  };
}
const useTheme = () => {
  const [selectedTheme] = useLocalStorage<ThemeName>(LS_KEY_THEME, "default");
  const theme = themes[selectedTheme];

  useEffect(() => {
    if (!theme) {
      console.error(`No theme found for theme name: ${selectedTheme}`);
    }
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }, [theme]);
};

export default useTheme;

import { useEffect } from "react";

import { LS_KEY_THEME } from "../config/localStorageKeys";
import theme, { OakTheme } from "../styles/theme";
import ausTheme from "../styles/theme/aus.theme";

import useLocalStorage, { dispatchLocalStorageEvent } from "./useLocalStorage";

export type WindowOakThemes = {
  setTheme: (themeName: ThemeName) => void;
  availableThemes: ThemeNames;
};
declare global {
  interface Window {
    oakThemes?: WindowOakThemes;
  }
}

export const themeNames = ["default", "aus"] as const;
type ThemeNames = typeof themeNames;
type ThemeName = ThemeNames[number];

const themes: Record<ThemeName, OakTheme> = {
  default: theme,
  aus: ausTheme,
};

const useOakTheme = () => {
  const [selectedTheme] = useLocalStorage<ThemeName>(LS_KEY_THEME, "default");

  const activeTheme = themes[selectedTheme];

  useEffect(() => {
    window.oakThemes = {
      setTheme: (themeName: ThemeName) => {
        if (!themeNames.includes(themeName)) {
          return console.error(
            `Theme name must be one of: ${themeNames.join(", ")}`
          );
        }

        window.localStorage.setItem(LS_KEY_THEME, JSON.stringify(themeName));
        dispatchLocalStorageEvent();
        console.log(`Switched to theme: ${themeName}`);
      },
      availableThemes: themeNames,
    };
  }, []);

  useEffect(() => {
    if (!activeTheme) {
      return console.error(
        `No theme found for theme name: ${selectedTheme}, falling back to default.`
      );
    }
  }, [selectedTheme, activeTheme]);

  return {
    theme: activeTheme || themes.default,
    name: selectedTheme,
  };
};

export default useOakTheme;

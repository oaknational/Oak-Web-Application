import { useEffect } from "react";

import { LS_KEY_THEME, LS_KEY_THEME_USER } from "../config/localStorageKeys";
import { UserType } from "../context/UserStyleContext";
import { Theme, defaultTheme, ausTheme } from "../styles/themes";

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

const themes: Record<ThemeName, Theme> = {
  default: defaultTheme,
  aus: ausTheme,
};

const useTheme = () => {
  const [selectedTheme] = useLocalStorage<ThemeName>(LS_KEY_THEME, "default");
  const [selectedUser] = useLocalStorage<UserType>(LS_KEY_THEME_USER, "pupils");

  const theme = themes[selectedTheme];

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
      },
      availableThemes: themeNames,
    };
  }, []);

  useEffect(() => {
    if (!theme) {
      return console.error(`No theme found for theme name: ${selectedTheme}`);
    }
    Object.entries(theme.common).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
    Object.entries(theme[selectedUser]).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }, [theme, selectedUser]);
};

export default useTheme;

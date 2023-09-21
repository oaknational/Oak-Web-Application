import { useEffect } from "react";

import { LS_KEY_THEME } from "../config/localStorageKeys";
import theme, { OakTheme } from "../styles/theme";
import oakBrandTheme from "../styles/theme/oakBrand.theme";

import useLocalStorage, { dispatchLocalStorageEvent } from "./useLocalStorage";

export type WindowOakThemes = {
  setTheme: (themeName: ThemeName) => void;
  availableThemes: ThemeNames;
};

export const THEME_NAMES = ["default", "oak"] as const;
type ThemeNames = typeof THEME_NAMES;
type ThemeName = ThemeNames[number];

const themes: Record<ThemeName, OakTheme> = {
  default: theme,
  oak: oakBrandTheme,
};

type UseOakThemeProps = {
  // Used in storybook where theme name must be passed externally
  overrideTheme: ThemeName;
};
const useOakTheme = (props?: UseOakThemeProps) => {
  const [selectedTheme] = useLocalStorage<ThemeName>(LS_KEY_THEME, "default");

  const activeTheme = themes[props?.overrideTheme || selectedTheme];

  useEffect(() => {
    window.__oakGlobals.oakThemes = {
      setTheme: (themeName: ThemeName) => {
        if (!THEME_NAMES.includes(themeName)) {
          return console.error(
            `Theme name must be one of: ${THEME_NAMES.join(", ")}`
          );
        }

        window.localStorage.setItem(LS_KEY_THEME, JSON.stringify(themeName));
        dispatchLocalStorageEvent();
        console.log(`Switched to theme: ${themeName}`);
      },
      availableThemes: THEME_NAMES,
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

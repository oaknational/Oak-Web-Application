import { useLayoutEffect } from "react";

import { Theme } from "../styles/theme";

const useTheme = (theme: Theme) => {
  useLayoutEffect(() => {
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }, [theme]);
};

export default useTheme;

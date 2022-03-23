import { useLayoutEffect } from "react";

import { Theme } from "../styles/themes";

const useTheme = (theme: Theme) => {
  useLayoutEffect(() => {
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }, [theme]);
};

export default useTheme;

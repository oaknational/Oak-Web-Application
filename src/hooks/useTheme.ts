import { useEffect } from "react";

import { Theme } from "../styles/themes";

const useTheme = (theme: Theme) => {
  useEffect(() => {
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }, [theme]);
};

export default useTheme;

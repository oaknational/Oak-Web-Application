import { useEffect, useState } from "react";

export function useBreakpoint(maxWidth: number) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${maxWidth}px)`);
    function handler() {
      setValue(mql.matches);
    }

    handler();
    mql.addEventListener("change", handler);

    return () => {
      mql.removeEventListener("change", handler);
    };
  }, [maxWidth]);

  return value;
}

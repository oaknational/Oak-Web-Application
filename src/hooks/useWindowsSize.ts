import { useState } from "react";

import { getBreakpoint } from "../styles/utils/responsive";

import useEventListener from "./useEventListener";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

interface WindowSize {
  width: number;
  height: number;
  breakpoint: string | undefined;
}

const getWindowBreakpoints = (width: number) => {
  switch (true) {
    case width >= getBreakpoint("large"):
      return "large";
    case width < getBreakpoint("large") && width >= getBreakpoint("medium"):
      return "medium";
    case width < getBreakpoint("medium"):
      return "small";
    default:
      return;
  }
};

function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
    breakpoint: undefined,
  });

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
      breakpoint: getWindowBreakpoints(window.innerWidth),
    });
  };

  useEventListener("resize", handleSize);

  // Set size at the first client-side load
  useIsomorphicLayoutEffect(() => {
    handleSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return windowSize;
}

export default useWindowSize;

import { useEffect, useRef, useState } from "react";

export const useContentVisibleOnClick = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const checkAndSetVisibility = () => {
      const rects = contentRef.current?.getClientRects();
      const isVisible = rects ? rects.length > 0 : false;
      setContentVisible(isVisible);
    };
    globalThis.addEventListener("click", checkAndSetVisibility);

    return () => globalThis.removeEventListener("click", checkAndSetVisibility);
  }, [contentRef]);

  return {
    contentVisible,
    contentRef,
  };
};

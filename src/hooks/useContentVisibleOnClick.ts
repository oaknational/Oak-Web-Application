import { useEffect, useRef, useState } from "react";

export const useContentVisibleOnClick = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const checkAndSetVisibility = () =>
      setContentVisible(contentRef.current?.checkVisibility() ?? false);

    globalThis.addEventListener("click", checkAndSetVisibility);

    return () => globalThis.removeEventListener("click", checkAndSetVisibility);
  }, [contentRef]);

  return {
    contentVisible,
    contentRef,
  };
};

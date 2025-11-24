import { RefObject, useEffect, useState } from "react";

export const useContentVisibleOnClick = (
  contentRef: RefObject<HTMLElement>,
) => {
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const checkAndSetVisibility = () =>
      setContentVisible(contentRef.current?.checkVisibility() ?? false);

    globalThis.addEventListener("click", checkAndSetVisibility);

    return () => globalThis.removeEventListener("click", checkAndSetVisibility);
  }, [contentRef]);

  return {
    contentVisible,
  };
};

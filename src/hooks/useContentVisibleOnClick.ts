import { RefObject, useEffect, useState } from "react";

export const useContentVisibleOnClick = (
  contentRef: RefObject<HTMLElement>,
) => {
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    globalThis.addEventListener("click", () => {
      setContentVisible(contentRef.current?.checkVisibility() ?? false);
    });
  }, [contentRef]);

  return {
    contentVisible,
  };
};

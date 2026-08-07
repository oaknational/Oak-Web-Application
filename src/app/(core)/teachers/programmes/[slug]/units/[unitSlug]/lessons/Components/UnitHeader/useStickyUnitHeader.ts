import { useEffect, useRef, useState } from "react";

export const useStickyUnitHeader = () => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    if (!sentinelRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          setIsStuck(false);
          return;
        }

        const viewportTop = entry.rootBounds?.top ?? 0;
        const hasScrolledPastSentinel =
          !entry.isIntersecting &&
          entry.boundingClientRect.bottom <= viewportTop;

        setIsStuck(hasScrolledPastSentinel);
      },
      { threshold: 0, rootMargin: "-1px 0px 0px" },
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, []);

  return { sentinelRef, isStuck };
};

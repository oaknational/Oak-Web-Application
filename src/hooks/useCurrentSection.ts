import { RefObject, useEffect, useState } from "react";

/**
 * Sets the hash in the URL without scrolling the page.
 * Without this, the browser auto-scrolls the user to the top of the section
 * they are on, when scrolling stops.
 */
function safeSetHash(hash: string): void {
  const element = document.getElementById(hash);

  if (element) {
    element.id = "";
  }

  globalThis.location.replace(`#${hash}`);

  if (element) {
    element.id = hash;
  }
}

function calculateCurrentSectionId<
  T extends Record<string, RefObject<HTMLElement>>,
>(sectionRefs: T): string | null {
  /**
   * Returns the last section that is above the middle of the screen
   */
  const currentSectionId = Object.entries(sectionRefs).reduce(
    (
      acc: { id: string; ref: RefObject<HTMLElement>; top: number } | null,
      [id, ref],
    ) => {
      const rect = ref.current?.getBoundingClientRect();

      if (rect) {
        /**
         * Is this section above the middle of the screen?
         */
        const isAboveThreshold = rect.top <= globalThis.innerHeight * 0.5;
        /**
         * Is this section below the previous section? We include this so that
         * the order of the sections in the sidebar doesn't have to match the
         * array passed to this function.
         */
        const isBelowPrevSection = acc ? rect.top > acc.top : true;
        /**
         * If the previous section is still completely in the view, don't
         * update the current section.
         */
        const isPrevSectionStillInView =
          typeof acc?.top === "number" ? acc?.top > 0 : false;
        if (
          isAboveThreshold &&
          isBelowPrevSection &&
          !isPrevSectionStillInView
        ) {
          return { id, ref, top: rect.top };
        }
      }
      return acc;
    },
    null,
  );

  return currentSectionId?.id ?? null;
}

export type UseCurrentSectionProps<
  T extends Record<string, RefObject<HTMLElement>>,
> = {
  sectionRefs: T;
};
export function useCurrentSection<
  T extends Record<string, RefObject<HTMLElement>>,
>({ sectionRefs }: UseCurrentSectionProps<T>) {
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [lastScrollTop, setLastScrollTop] = useState<number>(0);

  useEffect(() => {
    /**
     * Set the current section id on mount
     */
    setCurrentSectionId(calculateCurrentSectionId(sectionRefs));
  }, [sectionRefs]);

  useEffect(() => {
    /**
     * In a requestAnimationFrame loop, calculate the current section
     * and set it in state.
     */
    let running = false;

    const onScroll = () => {
      if (running) return;
      running = true;

      requestAnimationFrame(() => {
        setCurrentSectionId(calculateCurrentSectionId(sectionRefs));

        running = false;
      });
    };

    globalThis.addEventListener("scroll", onScroll);

    return () => {
      globalThis.removeEventListener("scroll", onScroll);
    };
  }, [currentSectionId, lastScrollTop, sectionRefs]);

  useEffect(() => {
    /**
     * Set isScrolling to true when the page is scrolling.
     * Set isScrolling to false when the page stops scrolling.
     */
    const onScroll = () => {
      const currentScrollTop =
        globalThis.pageYOffset || document.documentElement.scrollTop;

      if (currentScrollTop === lastScrollTop) {
        setIsScrolling(false);
      } else {
        setIsScrolling(true);
      }

      setLastScrollTop(currentScrollTop);
    };

    const intervalId = setInterval(onScroll, 50);

    return () => {
      clearInterval(intervalId);
    };
  }, [lastScrollTop, currentSectionId, sectionRefs]);

  useEffect(() => {
    /**
     * Wait for scroll to stop before updating the hash.
     */
    if (currentSectionId && !isScrolling) {
      safeSetHash(currentSectionId);
    }
  }, [currentSectionId, isScrolling]);

  return { currentSectionId, isScrolling };
}

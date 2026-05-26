"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const CurrentSectionIdContext = createContext<string | null>(null);

const ANCHOR_SECTION_SELECTOR = ".anchor-section[id]";
const HASH_SYNC_DEBOUNCE_MS = 250;

/**
 * Picks the section whose top edge is closest to the top of the viewport.
 * Sections that are too far below the viewport reference line are ignored.
 * The lower bound is based on the first section's vertical document position.
 */
export function pickSectionClosestToReferenceLine(
  sections: readonly Element[],
  sentinelTop: number,
): string | null {
  let closestId: string | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  /**
   * If the sentinel is in viewport, don't pick a section since
   * the content is not at the top of the page.
   */
  if (sentinelTop > 0) {
    return null;
  }

  for (const el of sections) {
    const top = el.getBoundingClientRect().top;
    const distance = Math.abs(top);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestId = el.id;
    }
  }

  return closestId;
}

/**
 * Sync fragment to address bar
 */
function replaceUrlHashWithSectionId(sectionId: string | null) {
  const { hash } = globalThis.location;
  const currentSectionId = hash.slice(1) || null;

  if (currentSectionId === sectionId) {
    return;
  }
  let path = `${globalThis.location.pathname}${globalThis.location.search}`;

  if (sectionId) {
    path += `#${sectionId}`;
  }

  history.replaceState(null, "", path);
}

export type CurrentSectionIdProviderProps = {
  children: ReactNode;
};

/**
 * Tracks the current lesson section for anchor navigation
 */
export function CurrentSectionIdProvider({
  children,
}: Readonly<CurrentSectionIdProviderProps>) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const rafRef = useRef<number>(0);
  const hashSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);

  const updateSectionId = useCallback(() => {
    const nextSectionId = pickSectionClosestToReferenceLine(
      sectionsRef.current,
      sentinelRef.current?.getBoundingClientRect().top ?? 0,
    );

    // Debounce the URL hash sync
    if (hashSyncTimeoutRef.current !== null) {
      globalThis.clearTimeout(hashSyncTimeoutRef.current);
    }
    hashSyncTimeoutRef.current = globalThis.setTimeout(() => {
      replaceUrlHashWithSectionId(nextSectionId);
    }, HASH_SYNC_DEBOUNCE_MS);

    setCurrentSectionId(nextSectionId);
  }, []);

  useEffect(() => {
    sectionsRef.current = Array.from(
      document.querySelectorAll<HTMLElement>(ANCHOR_SECTION_SELECTOR),
    );

    globalThis.addEventListener("hashchange", updateSectionId);

    const observer = new IntersectionObserver(
      () => {
        rafRef.current = requestAnimationFrame(updateSectionId);
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      },
    );

    for (const el of sectionsRef.current) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
      if (hashSyncTimeoutRef.current !== null) {
        globalThis.clearTimeout(hashSyncTimeoutRef.current);
      }
      globalThis.removeEventListener("hashchange", updateSectionId);
    };
  }, [updateSectionId]);

  return (
    <CurrentSectionIdContext.Provider value={currentSectionId}>
      <div ref={sentinelRef} />
      {children}
    </CurrentSectionIdContext.Provider>
  );
}

export function useCurrentSectionId(): string | null {
  return useContext(CurrentSectionIdContext);
}

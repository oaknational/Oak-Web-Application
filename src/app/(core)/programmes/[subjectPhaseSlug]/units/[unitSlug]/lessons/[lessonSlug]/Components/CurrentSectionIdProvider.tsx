"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const CurrentSectionIdContext = createContext<string | null>(null);

/**
 * Provides the current section ID to children.
 */
export function CurrentSectionIdProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);

  useEffect(() => {
    function syncFromLocation() {
      setCurrentSectionId(window.location.hash.slice(1) || null);
    }
    syncFromLocation();
    window.addEventListener("hashchange", syncFromLocation);
    return () => window.removeEventListener("hashchange", syncFromLocation);
  }, []);

  return (
    <CurrentSectionIdContext.Provider value={currentSectionId}>
      {children}
    </CurrentSectionIdContext.Provider>
  );
}

export function useCurrentSectionId(): string | null {
  return useContext(CurrentSectionIdContext);
}

"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type ProgrammePageFiltersModalContextValue = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const ProgrammePageFiltersModalContext =
  createContext<ProgrammePageFiltersModalContextValue | null>(null);

/**
 * Holds the open state of the mobile filters modal.
 */
export function ProgrammePageFiltersModalProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [isOpen, setIsOpen] = useState(false);
  const value = useMemo(() => ({ isOpen, setIsOpen }), [isOpen, setIsOpen]);

  return (
    <ProgrammePageFiltersModalContext.Provider value={value}>
      {children}
    </ProgrammePageFiltersModalContext.Provider>
  );
}

export function useProgrammePageFiltersModal() {
  const context = useContext(ProgrammePageFiltersModalContext);
  if (!context) {
    throw new Error(
      "useProgrammePageFiltersModal must be used within ProgrammePageFiltersModalProvider",
    );
  }
  return context;
}

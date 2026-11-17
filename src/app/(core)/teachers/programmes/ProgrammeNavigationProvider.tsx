"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import type { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { resolveOakHref } from "@/common-lib/urls";
import { getSubjectPhaseSlug } from "@/components/TeacherComponents/helpers/getSubjectPhaseSlug";

export type ProgrammeNavigationIntent = {
  destination: CurriculumSelectionSlugs;
  restoreFocus: boolean;
  reopenFiltersModal: boolean;
};

type ProgrammeNavigationContextValue = {
  setNavigationIntent: (intent: ProgrammeNavigationIntent) => void;
  consumeNavigationIntent: (
    destination: CurriculumSelectionSlugs,
  ) => ProgrammeNavigationIntent | null;
};

const ProgrammeNavigationContext =
  createContext<ProgrammeNavigationContextValue | null>(null);

/** Carries one-time UI intent across programme page remounts, never into URLs. */
export function ProgrammeNavigationProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const pending = useRef<{
    intent: ProgrammeNavigationIntent;
    sourcePath: string | null;
    destinationPath: string;
  } | null>(null);

  const setNavigationIntent = useCallback(
    (intent: ProgrammeNavigationIntent) => {
      pending.current = {
        intent,
        sourcePath: pathname,
        destinationPath: resolveOakHref({
          page: "teacher-programme",
          subjectPhaseSlug: getSubjectPhaseSlug({
            subject: intent.destination.subjectSlug,
            phaseSlug: intent.destination.phaseSlug,
            examBoardSlug: intent.destination.ks4OptionSlug,
          }),
          tab: "units",
        }),
      };
    },
    [pathname],
  );

  const consumeNavigationIntent = useCallback(
    (destination: CurriculumSelectionSlugs) => {
      const intent = pending.current?.intent;
      if (
        intent?.destination.subjectSlug !== destination.subjectSlug ||
        intent?.destination.phaseSlug !== destination.phaseSlug ||
        intent?.destination.ks4OptionSlug !== destination.ks4OptionSlug
      ) {
        return null;
      }
      pending.current = null;
      return intent;
    },
    [],
  );

  useEffect(() => {
    if (
      pending.current &&
      pathname !== pending.current.sourcePath &&
      pathname !== pending.current.destinationPath
    ) {
      pending.current = null;
    }
  }, [pathname]);

  const value = useMemo(
    () => ({ setNavigationIntent, consumeNavigationIntent }),
    [setNavigationIntent, consumeNavigationIntent],
  );

  return (
    <ProgrammeNavigationContext.Provider value={value}>
      {children}
    </ProgrammeNavigationContext.Provider>
  );
}

export function useProgrammeNavigation() {
  const context = useContext(ProgrammeNavigationContext);
  if (!context) {
    throw new Error(
      "useProgrammeNavigation must be used within ProgrammeNavigationProvider",
    );
  }
  return context;
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useProgrammeNavigation } from "../../../../../ProgrammeNavigationProvider";
import { useProgrammePageFiltersModal } from "../ProgrammePageFiltersModalProvider";

import {
  focusExamBoardRadio,
  getScopeRef,
  type KS4OptionFocusScopeRefs,
  type KS4OptionFocusScopeVariant,
} from "./ks4OptionFocusParams";

import type { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

type KS4OptionFocusContextValue = {
  registerScope: (
    variant: KS4OptionFocusScopeVariant,
    node: HTMLDivElement | null,
  ) => void;
};

const KS4OptionFocusContext = createContext<KS4OptionFocusContextValue | null>(
  null,
);

/** Restores one-time navigation intent once the destination's radio scope mounts. */
export function KS4OptionFocusProvider({
  children,
  slugs,
}: Readonly<{ children: ReactNode; slugs: CurriculumSelectionSlugs }>) {
  const { consumeNavigationIntent } = useProgrammeNavigation();
  const { isOpen: modalOpen, setIsOpen: setModalOpen } =
    useProgrammePageFiltersModal();
  const scopeRefs = useRef<KS4OptionFocusScopeRefs>({
    page: null,
    modal: null,
  });
  const [pendingFocus, setPendingFocus] = useState<{
    slug: string;
    scope: KS4OptionFocusScopeVariant;
  } | null>(null);
  const [registeredScopes, setRegisteredScopes] = useState<
    Record<KS4OptionFocusScopeVariant, boolean>
  >({
    page: false,
    modal: false,
  });

  const registerScope = useCallback(
    (variant: KS4OptionFocusScopeVariant, node: HTMLDivElement | null) => {
      scopeRefs.current[variant] = node;
      setRegisteredScopes((current) => {
        if (current[variant] === (node !== null)) {
          return current;
        }
        return { ...current, [variant]: node !== null };
      });
    },
    [],
  );

  useEffect(() => {
    const intent = consumeNavigationIntent(slugs);
    if (!intent) {
      return;
    }
    if (intent.reopenFiltersModal) {
      setModalOpen(true);
    }
    setPendingFocus(
      intent.restoreFocus && intent.destination.ks4OptionSlug
        ? {
            slug: intent.destination.ks4OptionSlug,
            scope: intent.reopenFiltersModal ? "modal" : "page",
          }
        : null,
    );
  }, [consumeNavigationIntent, slugs, setModalOpen]);

  const activeVariant: KS4OptionFocusScopeVariant =
    pendingFocus?.scope ?? "page";
  const focusEnabled =
    pendingFocus !== null &&
    (activeVariant === "page" || modalOpen) &&
    registeredScopes[activeVariant];

  useEffect(() => {
    if (!focusEnabled || !pendingFocus) {
      return;
    }
    const focusSlug = pendingFocus.slug;
    const frame = requestAnimationFrame(() => {
      focusExamBoardRadio(getScopeRef(scopeRefs, activeVariant), focusSlug);
      setPendingFocus(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [focusEnabled, pendingFocus, activeVariant]);

  const value = useMemo(() => ({ registerScope }), [registerScope]);

  return (
    <KS4OptionFocusContext.Provider value={value}>
      {children}
    </KS4OptionFocusContext.Provider>
  );
}

export function useKS4OptionFocus() {
  const context = useContext(KS4OptionFocusContext);
  if (!context) {
    throw new Error(
      "useKS4OptionFocus must be used within KS4OptionFocusProvider",
    );
  }
  return context;
}

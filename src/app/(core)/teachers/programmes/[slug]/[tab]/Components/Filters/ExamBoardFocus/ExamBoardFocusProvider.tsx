import { useSearchParams } from "next/navigation";
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

import { useProgrammePageFiltersModal } from "../ProgrammePageFiltersModalProvider";

import {
  FOCUS_KS4_OPTION_QUERY_PARAM,
  focusExamBoardRadio,
  getScopeRef,
  OPEN_FILTERS_MODAL_QUERY_PARAM,
  stripEphemeralFocusParams,
  type ExamBoardFocusScopeRefs,
  type ExamBoardFocusScopeVariant,
} from "./examBoardFocusParams";

type ExamBoardFocusContextValue = {
  registerScope: (
    variant: ExamBoardFocusScopeVariant,
    node: HTMLDivElement | null,
  ) => void;
};

const ExamBoardFocusContext = createContext<ExamBoardFocusContextValue | null>(
  null,
);

/**
 * Exam board selection navigates to a new programme slug, remounting the filter
 * and dropping focus. Descendants append ephemeral query params
 * {@link FOCUS_KS4_OPTION_QUERY_PARAM} (and {@link OPEN_FILTERS_MODAL_QUERY_PARAM}
 * from the modal tree) on push; this provider reads those params on load,
 * re-opens the mobile filters modal when needed, focuses the matching radio in
 * the correct scope, then strips the params from the URL.
 */
export function ExamBoardFocusProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const searchParams = useSearchParams();
  const { isOpen: modalOpen, setIsOpen: setModalOpen } =
    useProgrammePageFiltersModal();
  const scopeRefs = useRef<ExamBoardFocusScopeRefs>({
    page: null,
    modal: null,
  });
  const hasHandledFocus = useRef(false);
  const isMobileRestore = useRef(false);
  const hasReadRestoreParams = useRef(false);

  const [pendingFocusSlug, setPendingFocusSlug] = useState<string | null>(null);
  const [registeredScopes, setRegisteredScopes] = useState<
    Record<ExamBoardFocusScopeVariant, boolean>
  >({
    page: false,
    modal: false,
  });

  const registerScope = useCallback(
    (variant: ExamBoardFocusScopeVariant, node: HTMLDivElement | null) => {
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
    if (hasReadRestoreParams.current || !searchParams) {
      return;
    }

    const focusSlug = searchParams.get(FOCUS_KS4_OPTION_QUERY_PARAM);
    if (!focusSlug) {
      return;
    }

    hasReadRestoreParams.current = true;

    if (searchParams.get(OPEN_FILTERS_MODAL_QUERY_PARAM)) {
      isMobileRestore.current = true;
      setPendingFocusSlug(focusSlug);
      setModalOpen(true);
      return;
    }

    setPendingFocusSlug(focusSlug);
  }, [searchParams, setModalOpen]);

  const activeVariant: ExamBoardFocusScopeVariant = isMobileRestore.current
    ? "modal"
    : "page";
  const focusEnabled =
    pendingFocusSlug !== null &&
    (activeVariant === "page" || modalOpen) &&
    registeredScopes[activeVariant];

  useEffect(() => {
    if (!focusEnabled || hasHandledFocus.current || !searchParams) {
      return;
    }

    hasHandledFocus.current = true;
    const focusSlug = pendingFocusSlug;

    requestAnimationFrame(() => {
      focusExamBoardRadio(getScopeRef(scopeRefs, activeVariant), focusSlug);

      globalThis.history.replaceState(
        null,
        "",
        stripEphemeralFocusParams(searchParams),
      );

      setPendingFocusSlug(null);
      isMobileRestore.current = false;
    });
  }, [
    focusEnabled,
    pendingFocusSlug,
    activeVariant,
    searchParams,
    modalOpen,
    registeredScopes,
  ]);
  const value = useMemo(() => ({ registerScope }), [registerScope]);

  return (
    <ExamBoardFocusContext.Provider value={value}>
      {children}
    </ExamBoardFocusContext.Provider>
  );
}

export function useExamBoardFocus() {
  const context = useContext(ExamBoardFocusContext);
  if (!context) {
    throw new Error(
      "useExamBoardFocus must be used within ExamBoardFocusProvider",
    );
  }
  return context;
}

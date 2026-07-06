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
  type KS4OptionFocusScopeRefs,
  type KS4OptionFocusScopeVariant,
} from "./ks4OptionFocusParams";

type KS4OptionFocusContextValue = {
  registerScope: (
    variant: KS4OptionFocusScopeVariant,
    node: HTMLDivElement | null,
  ) => void;
};

const KS4OptionFocusContext = createContext<KS4OptionFocusContextValue | null>(
  null,
);

/**
 * KS4 option selection navigates to a new programme slug, remounting the filter
 * and dropping focus. Descendants append ephemeral query params
 * {@link FOCUS_KS4_OPTION_QUERY_PARAM} (and {@link OPEN_FILTERS_MODAL_QUERY_PARAM}
 * from the modal tree) on push; this provider reads those params on load,
 * re-opens the mobile filters modal when needed, focuses the matching radio in
 * the correct scope, then strips the params from the URL.
 */
export function KS4OptionFocusProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const searchParams = useSearchParams();
  const { isOpen: modalOpen, setIsOpen: setModalOpen } =
    useProgrammePageFiltersModal();
  const scopeRefs = useRef<KS4OptionFocusScopeRefs>({
    page: null,
    modal: null,
  });
  const hasHandledFocus = useRef(false);
  const isMobileRestore = useRef(false);
  const hasReadRestoreParams = useRef(false);

  const [pendingFocusSlug, setPendingFocusSlug] = useState<string | null>(null);
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

  const activeVariant: KS4OptionFocusScopeVariant = isMobileRestore.current
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

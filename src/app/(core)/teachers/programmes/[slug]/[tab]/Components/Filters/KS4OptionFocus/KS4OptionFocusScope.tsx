"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";

import { useKS4OptionFocus } from "./KS4OptionFocusProvider";
import type { KS4OptionFocusScopeVariant } from "./ks4OptionFocusParams";

const KS4OptionFocusScopeVariantContext =
  createContext<KS4OptionFocusScopeVariant>("page");

export function useKS4OptionFocusScopeVariant() {
  return useContext(KS4OptionFocusScopeVariantContext);
}

/**
 * Desktop and mobile each mount their own `ProgrammeFilters` tree (including
 * KS4 option radios), so a shared provider cannot tell which instance the user
 * interacted with. Each scope tags its subtree as `page` or `modal`: the
 * provider uses that ref to restore focus to the correct radio after KS4
 * option navigation.
 */
export function KS4OptionFocusScope({
  variant,
  children,
  focusContainerOnOpen = false,
}: Readonly<{
  variant: KS4OptionFocusScopeVariant;
  children: ReactNode;
  focusContainerOnOpen?: boolean;
}>) {
  const { registerScope } = useKS4OptionFocus();
  const lastInteractedRadio = useRef<HTMLInputElement | null>(null);

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (variant === "modal" && !focusContainerOnOpen) {
        const firstGroup = node?.querySelector("fieldset");
        const firstRadio =
          firstGroup?.querySelector<HTMLInputElement>(
            'input[type="radio"]:checked',
          ) ??
          firstGroup?.querySelector<HTMLInputElement>('input[type="radio"]');
        firstRadio?.focus({ preventScroll: true });
      }
      registerScope(variant, node);
    },
    [registerScope, variant, focusContainerOnOpen],
  );

  return (
    <KS4OptionFocusScopeVariantContext.Provider value={variant}>
      <div
        ref={ref}
        tabIndex={-1}
        data-autofocus={focusContainerOnOpen || undefined}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "inherit",
          outline: "none",
        }}
        onKeyDownCapture={(event) => {
          if (
            event.target === event.currentTarget &&
            event.key === "Tab" &&
            !event.shiftKey &&
            lastInteractedRadio.current?.isConnected
          ) {
            event.preventDefault();
            lastInteractedRadio.current.focus({ preventScroll: true });
          }
        }}
        onFocusCapture={(event) => {
          if (
            event.target instanceof HTMLInputElement &&
            event.target.type === "radio"
          ) {
            lastInteractedRadio.current = event.target;
          }
        }}
        onPointerDownCapture={(event) => {
          const button =
            event.target instanceof Element
              ? event.target.closest("fieldset > div")
              : null;
          const clickedRadio = button?.querySelector<HTMLInputElement>(
            'input[type="radio"]',
          );

          if (!clickedRadio) return;
          lastInteractedRadio.current = clickedRadio;
          event.preventDefault();
          event.currentTarget.focus({ preventScroll: true });
        }}
      >
        {children}
      </div>
    </KS4OptionFocusScopeVariantContext.Provider>
  );
}

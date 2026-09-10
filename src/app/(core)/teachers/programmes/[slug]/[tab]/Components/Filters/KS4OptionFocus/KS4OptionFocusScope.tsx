"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";

import { useKS4OptionFocus } from "./KS4OptionFocusProvider";
import {
  getKs4OptionFocusNavigationQuery,
  type KS4OptionFocusScopeVariant,
} from "./ks4OptionFocusParams";

const KS4OptionFocusScopeVariantContext =
  createContext<KS4OptionFocusScopeVariant>("page");

export function useKS4OptionFocusScopeVariant() {
  return useContext(KS4OptionFocusScopeVariantContext);
}

/** Ephemeral query params to append when KS4 option navigation should restore focus in this scope. */
export function useGetKs4OptionFocusNavigationQuery() {
  const variant = useKS4OptionFocusScopeVariant();

  return useCallback(
    (slug: string) => getKs4OptionFocusNavigationQuery(slug, variant),
    [variant],
  );
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
}: Readonly<{
  variant: KS4OptionFocusScopeVariant;
  children: ReactNode;
}>) {
  const { registerScope } = useKS4OptionFocus();

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      registerScope(variant, node);
    },
    [registerScope, variant],
  );

  return (
    <KS4OptionFocusScopeVariantContext.Provider value={variant}>
      <div ref={ref} style={{ display: "contents" }}>
        {children}
      </div>
    </KS4OptionFocusScopeVariantContext.Provider>
  );
}

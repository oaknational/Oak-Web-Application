"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";

import { useExamBoardFocus } from "./ExamBoardFocusProvider";
import {
  getExamBoardFocusNavigationQuery,
  type ExamBoardFocusScopeVariant,
} from "./examBoardFocusParams";

const ExamBoardFocusScopeVariantContext =
  createContext<ExamBoardFocusScopeVariant>("page");

export function useExamBoardFocusScopeVariant() {
  return useContext(ExamBoardFocusScopeVariantContext);
}

/** Ephemeral query params to append when exam board navigation should restore focus in this scope. */
export function useGetExamBoardFocusNavigationQuery() {
  const variant = useExamBoardFocusScopeVariant();

  return useCallback(
    (slug: string) => getExamBoardFocusNavigationQuery(slug, variant),
    [variant],
  );
}

/**
 * Desktop and mobile each mount their own `ProgrammeFilters` tree (including
 * exam board radios), so a shared provider cannot tell which instance the user
 * interacted with. Each scope tags its subtree as `page` or `modal`: the
 * provider uses that ref to restore focus to the correct radio after exam board
 * navigation
 */
export function ExamBoardFocusScope({
  variant,
  children,
}: Readonly<{
  variant: ExamBoardFocusScopeVariant;
  children: ReactNode;
}>) {
  const { registerScope } = useExamBoardFocus();

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      registerScope(variant, node);
    },
    [registerScope, variant],
  );

  return (
    <ExamBoardFocusScopeVariantContext.Provider value={variant}>
      <div ref={ref} style={{ display: "contents" }}>
        {children}
      </div>
    </ExamBoardFocusScopeVariantContext.Provider>
  );
}

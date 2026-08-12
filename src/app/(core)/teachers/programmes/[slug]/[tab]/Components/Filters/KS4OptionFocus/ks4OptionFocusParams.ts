import type { RefObject } from "react";

export const FOCUS_KS4_OPTION_QUERY_PARAM = "focus_ks4option";
export const OPEN_FILTERS_MODAL_QUERY_PARAM = "open_filters_modal";

export function stripEphemeralFocusParams(
  searchParams: URLSearchParams,
): string {
  const params = new URLSearchParams(searchParams);
  params.delete(FOCUS_KS4_OPTION_QUERY_PARAM);
  params.delete(OPEN_FILTERS_MODAL_QUERY_PARAM);
  const qs = params.toString();
  return qs
    ? `${globalThis.location.pathname}?${qs}`
    : globalThis.location.pathname;
}

export function focusExamBoardRadio(
  scopeElement: HTMLElement | null,
  slug: string,
) {
  const radio = scopeElement?.querySelector<HTMLInputElement>(
    `input[type="radio"][value="${slug}"]`,
  );
  radio?.focus();
}

export type KS4OptionFocusScopeVariant = "page" | "modal";

export function getKs4OptionFocusNavigationQuery(
  slug: string,
  variant: KS4OptionFocusScopeVariant,
) {
  return {
    [FOCUS_KS4_OPTION_QUERY_PARAM]: slug,
    ...(variant === "modal"
      ? { [OPEN_FILTERS_MODAL_QUERY_PARAM]: "1" }
      : undefined),
  };
}

export type KS4OptionFocusScopeRefs = Record<
  KS4OptionFocusScopeVariant,
  HTMLElement | null
>;

export function getScopeRef(
  scopeRefs: RefObject<KS4OptionFocusScopeRefs>,
  variant: KS4OptionFocusScopeVariant,
): HTMLElement | null {
  return scopeRefs?.current?.[variant] ?? null;
}

import type { RefObject } from "react";

export function focusExamBoardRadio(
  scopeElement: HTMLElement | null,
  slug: string,
) {
  const radio = scopeElement?.querySelector<HTMLInputElement>(
    `input[type="radio"][value="${slug}"]`,
  );
  radio?.focus({ preventScroll: true });
}

export type KS4OptionFocusScopeVariant = "page" | "modal";

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

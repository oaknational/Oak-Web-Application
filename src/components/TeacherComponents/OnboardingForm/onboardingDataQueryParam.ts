import { ReadonlyURLSearchParams } from "next/navigation";

import { OnboardingFormValues } from "./OnboardingForm.schema";

type SearchParamsInput =
  | URLSearchParams
  | ReadonlyURLSearchParams
  | null
  | undefined;

/**
 * Decodes the accumulated onboarding form data from the `state` query param.
 *
 * Pass the search params, e.g. `useSearchParams()` (App Router).
 */
export function decodeOnboardingDataQueryParam(
  searchParams: SearchParamsInput,
): OnboardingFormValues | null {
  try {
    const state = searchParams?.get("state");
    if (!state) {
      return null;
    }

    return JSON.parse(fromBase64(state));
  } catch (_error) {
    return null;
  }
}

/**
 * Accumulates onboarding form data into the `state` query param, returning the
 * full query string to place into the URL. Merges `data` on top of any
 * existing `state` in the provided search params.
 */
export function encodeOnboardingDataQueryParam(
  searchParams: SearchParamsInput,
  data: OnboardingFormValues,
): string {
  const query = new URLSearchParams(searchParams?.toString() ?? "");
  const currentState = decodeOnboardingDataQueryParam(query) ?? undefined;

  query.set("state", toBase64(JSON.stringify({ ...currentState, ...data })));

  return query.toString();
}

function fromBase64(value: string) {
  const binString = atob(value);
  const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);

  return new TextDecoder().decode(bytes);
}

function toBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte),
  ).join("");
  return btoa(binString);
}

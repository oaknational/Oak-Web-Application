import type { ParsedUrlQuery } from "querystring";

import { OnboardingFormProps } from "./OnboardingForm.schema";

/**
 * Decodes the onboarding form data from a query param
 */
export function decodeOnboardingDataQueryParam(
  query: ParsedUrlQuery,
): OnboardingFormProps | null {
  try {
    const formData = query.state?.toString();

    if (!formData) {
      return null;
    }

    return JSON.parse(fromBase64(formData));
  } catch (_error) {
    return null;
  }
}

/**
 * Accumulates onboarding form data in a query param
 */
export function encodeOnboardingDataQueryParam(
  query: ParsedUrlQuery,
  data: OnboardingFormProps,
): ParsedUrlQuery {
  const currentState = decodeOnboardingDataQueryParam(query) ?? undefined;

  return {
    ...query,
    state: toBase64(JSON.stringify({ ...currentState, ...data })),
  };
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

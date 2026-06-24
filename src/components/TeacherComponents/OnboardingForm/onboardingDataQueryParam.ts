import { OnboardingFormValues } from "./OnboardingForm.schema";

/**
 * Decodes the accumulated onboarding form data from the `state` query param value.
 *
 * Pass the raw value of the `state` param, e.g. `searchParams.get("state")`
 * (App Router) or `router.query.state` (Pages Router).
 */
export function decodeOnboardingDataQueryParam(
  state: string | null | undefined,
): OnboardingFormValues | null {
  try {
    if (!state) {
      return null;
    }

    return JSON.parse(fromBase64(state));
  } catch (_error) {
    return null;
  }
}

/**
 * Accumulates onboarding form data, returning the encoded value for the `state`
 * query param. Merges `data` on top of any previously encoded `state`.
 *
 * The caller is responsible for placing the returned value back into the URL,
 * e.g. `params.set("state", encodeOnboardingDataQueryParam(params.get("state"), data))`.
 */
export function encodeOnboardingDataQueryParam(
  state: string | null | undefined,
  data: OnboardingFormValues,
): string {
  const currentState = decodeOnboardingDataQueryParam(state) ?? undefined;

  return toBase64(JSON.stringify({ ...currentState, ...data }));
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

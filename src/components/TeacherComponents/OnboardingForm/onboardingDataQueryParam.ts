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

    return JSON.parse(atob(formData));
  } catch (error) {
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
    state: btoa(JSON.stringify({ ...currentState, ...data })),
  };
}

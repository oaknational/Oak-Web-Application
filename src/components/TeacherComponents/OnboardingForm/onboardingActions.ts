import errorReporter from "@/common-lib/error-reporter";
import type { OnboardingSchema } from "@/common-lib/schemas/onboarding";
import OakError from "@/errors/OakError";

const apiRoute = "/api/auth/onboarding";

const reportError = errorReporter("onboardingActions");

/**
 * Makes a request to mark the user as onboarded in Clerk
 */
export async function onboardUser(
  data: OnboardingSchema,
): Promise<OnboardingSchema & { "owa:onboarded": true }> {
  try {
    const response = await fetch(apiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new OakError({
        code: "onboarding/request-error",
        meta: {
          url: apiRoute,
          status: response.status,
        },
      });
    }
    return response.json();
  } catch (error) {
    let finalError = error;
    if (!(error instanceof OakError)) {
      finalError = new OakError({
        code: "misc/network-error",
        originalError: error,
        meta: { route: apiRoute },
      });
    }

    reportError(finalError);

    throw error;
  }
}

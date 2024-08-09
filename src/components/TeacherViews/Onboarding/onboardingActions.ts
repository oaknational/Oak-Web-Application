import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

const apiRoute = "/api/auth/onboarding";

const reportError = errorReporter("onboardingActions");

/**
 * Makes a request to mark the user as onboarded
 */
export async function onboardUser(): Promise<{ "owa:onboarded": true }> {
  const response = await fetch(apiRoute, {
    method: "POST",
  });

  if (!response.ok) {
    const error = new OakError({
      code: "onboarding/request-error",
      meta: {
        url: apiRoute,
        status: response.status,
      },
    });
    reportError(error);
    throw error;
  }

  return response.json();
}

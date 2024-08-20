import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

const apiRoute = "/api/auth/onboarding";

const reportError = errorReporter("onboardingActions");

/**
 * Makes a request to mark the user as onboarded in Clerk
 */
export async function onboardUser(): Promise<{ "owa:onboarded": true }> {
  try {
    const response = await fetch(apiRoute, {
      method: "POST",
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

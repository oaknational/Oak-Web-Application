import errorReporter from "@/common-lib/error-reporter";
import type { OnboardingSchema } from "@/common-lib/schemas/onboarding";
import OakError from "@/errors/OakError";

const onboardingApiRoute = "/api/auth/onboarding";

export const reportError = errorReporter("onboardUser");

/**
 * Makes a request to mark the user as onboarded in Clerk
 */
export async function onboardUser(
  data: OnboardingSchema,
): Promise<UserPublicMetadata> {
  try {
    const response = await fetch(onboardingApiRoute, {
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
          url: onboardingApiRoute,
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
        meta: { route: onboardingApiRoute },
      });
    }

    reportError(finalError);

    throw error;
  }
}

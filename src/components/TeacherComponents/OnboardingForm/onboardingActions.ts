import errorReporter from "@/common-lib/error-reporter";
import type { OnboardingSchema } from "@/common-lib/schemas/onboarding";
import OakError from "@/errors/OakError";
import { subscriptionResponseSchema } from "@/pages/api/hubspot/subscription";

const onboardingApiRoute = "/api/auth/onboarding";

const reportError = errorReporter("onboardingActions");

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

export async function getSubscriptionStatus(
  email: string,
  callback: (status: boolean) => void,
) {
  try {
    const response = await fetch("/api/hubspot/subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        subscriptionName: "School Support",
      }),
    });
    const result = subscriptionResponseSchema.parse(await response.json());
    callback(result);
  } catch (err) {
    if (err instanceof OakError) {
      throw err;
    }
    throw new OakError({
      code: "hubspot/unknown",
      originalError: err,
    });
  }
}

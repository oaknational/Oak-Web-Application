import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { hubspotSubmitForm } from "@/browser-lib/hubspot/forms";
import {
  getHubspotOnboardingFormPayload,
  OnboardingHubspotFormData,
} from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import getHubspotUserToken from "@/browser-lib/hubspot/forms/getHubspotUserToken";
import errorReporter from "@/common-lib/error-reporter";
import type { OnboardingSchema } from "@/common-lib/schemas/onboarding";
import OakError from "@/errors/OakError";
import { subscriptionResponseSchema } from "@/pages/api/hubspot/subscription";

const onboardingApiRoute = "/api/auth/onboarding";

export const reportError = errorReporter("onboardingActions");

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

/**
 * Sends onboarding data to hubspot
 */
export async function onboardUserToHubspot(data: OnboardingHubspotFormData) {
  const hubspotFormId = getBrowserConfig("hubspotOnboardingFormId");
  const hubspotFormPayload = getHubspotOnboardingFormPayload({
    hutk: getHubspotUserToken(),
    data,
  });

  try {
    await hubspotSubmitForm({
      hubspotFormId,
      payload: hubspotFormPayload,
    });
  } catch (error) {
    if (error instanceof OakError) {
      reportError(error);
    } else {
      reportError(
        new OakError({
          code: "hubspot/unknown",
          originalError: error,
        }),
      );
    }
  }
}

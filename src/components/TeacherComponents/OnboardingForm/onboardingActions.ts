import useLocalStorageForDownloads from "../hooks/downloadAndShareHooks/useLocalStorageForDownloads";

import { OnboardingFormProps } from "./OnboardingForm.schema";

import type { OnboardingSchema } from "@/common-lib/schemas/onboarding";
import OakError from "@/errors/OakError";
import { subscriptionResponseSchema } from "@/pages/api/hubspot/subscription";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { hubspotSubmitForm } from "@/browser-lib/hubspot/forms";
import { getHubspotOnboardingFormPayload } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import errorReporter from "@/common-lib/error-reporter";

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
  callback?: (status: boolean) => void,
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
    if (callback) {
      callback(result);
    }
    return result;
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

const reportHubspotError = errorReporter("resolveHubspotFormReferences.ts");

interface OnboardingHubspotData {
  hutk: string | undefined;
  utmParams: Partial<
    Record<
      "utm_source" | "utm_medium" | "utm_campaign" | "utm_term" | "utm_content",
      string
    >
  >;
  data: OnboardingFormProps;
  userSubscribed: boolean;
  posthogDistinctId: string | null;
  userEmail: string | undefined;
}

export async function submitOnboardingHubspotData({
  hutk,
  utmParams,
  data,
  userSubscribed,
  posthogDistinctId,
  userEmail,
}: OnboardingHubspotData) {
  const hubspotFormId = getBrowserConfig("hubspotOnboardingFormId");

  const hubspotFormPayload = getHubspotOnboardingFormPayload({
    hutk,
    data: {
      ...utmParams,
      ...data,
      role: "role" in data ? data.role : "",
      newsletterSignUp: userSubscribed,
      oakUserId: posthogDistinctId,
      email: userEmail,
    },
  });

  try {
    await hubspotSubmitForm({
      hubspotFormId,
      payload: hubspotFormPayload,
    });
  } catch (error) {
    if (error instanceof OakError) {
      reportHubspotError(error);
    } else {
      reportHubspotError(
        new OakError({
          code: "hubspot/unknown",
          originalError: error,
        }),
      );
    }
  }
}

interface OnboardingData {
  localStorageForDownloads: ReturnType<typeof useLocalStorageForDownloads>;
  userSubscribed: boolean;
  data: OnboardingFormProps;
  userEmail?: string;
}

export async function setOnboardingLocalStorage({
  localStorageForDownloads,
  data,
  userEmail,
  userSubscribed,
}: OnboardingData) {
  if ("school" in data) {
    localStorageForDownloads.setSchoolInLocalStorage({
      schoolName: data.schoolName || data.school,
      schoolId: data.school,
    });
  } else if ("manualSchoolName" in data) {
    localStorageForDownloads.setSchoolInLocalStorage({
      schoolName: data.manualSchoolName,
      schoolId: data.manualSchoolName,
    });
  } else {
    localStorageForDownloads.setSchoolInLocalStorage({
      schoolName: "",
      schoolId: "",
    });
  }

  if (userEmail && userSubscribed) {
    localStorageForDownloads.setEmailInLocalStorage(userEmail);
  } else {
    localStorageForDownloads.setEmailInLocalStorage(""); // on download they subscribe by adding email, so this is empty if unsubscribed
  }

  localStorageForDownloads.setTermsInLocalStorage(true); // on sign up they are accepting terms so this is true
}

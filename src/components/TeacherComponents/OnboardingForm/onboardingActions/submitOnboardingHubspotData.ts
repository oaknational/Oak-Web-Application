import { OnboardingFormProps } from "../OnboardingForm.schema";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { hubspotSubmitForm } from "@/browser-lib/hubspot/forms";
import { getHubspotOnboardingFormPayload } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

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

export const reportError = errorReporter("submitOnboardingHubspotData");

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

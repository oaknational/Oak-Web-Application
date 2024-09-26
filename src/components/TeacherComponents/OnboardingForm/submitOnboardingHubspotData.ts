import { SchoolSelectFormProps } from "./OnboardingForm.schema";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { hubspotSubmitForm } from "@/browser-lib/hubspot/forms";
import { getHubspotOnboardingFormPayload } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
const reportError = errorReporter("resolveHubspotFormReferences.ts");

export async function submitOnboardingHubspotData(
  hutk: string | undefined,
  utmParams: Partial<
    Record<
      "utm_source" | "utm_medium" | "utm_campaign" | "utm_term" | "utm_content",
      string
    >
  >,
  data: SchoolSelectFormProps,
  userSubscribedInHubspot: boolean | undefined,
  posthogDistinctId: string | null,
  userEmail: string | undefined,
) {
  const hubspotFormId = getBrowserConfig("hubspotOnboardingFormId");

  const hubspotFormPayload = getHubspotOnboardingFormPayload({
    hutk,
    data: {
      ...utmParams,
      ...data,
      newsletterSignUp: userSubscribedInHubspot || data.newsletterSignUp,
      oakUserId: posthogDistinctId,
      email:
        userSubscribedInHubspot || data.newsletterSignUp
          ? userEmail
          : undefined,
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

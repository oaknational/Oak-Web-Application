import Bugsnag from "@bugsnag/js";
import { OakConsentClient } from "@oaknational/oak-consent-client";

import getBrowserConfig from "../getBrowserConfig";

import { ServicePolicyMap } from "./ServicePolicyMap";

/**
 * A singleton instance of OakConsentClient
 */
export const consentClient = new OakConsentClient({
  appSlug: "owa",
  policiesUrl: getBrowserConfig("oakConsentPoliciesUrl"),
  consentLogUrl: getBrowserConfig("oakConsentLogUrl"),
  onError(error) {
    console.error("`OakConsentClient` error", error);

    // Notify Bugsnag of errors only when we have been given consent
    // this means we won't be notified of errors in the consent flow
    // unless the user has previously given consent 😅.
    if (
      error instanceof Error &&
      consentClient.getConsent(ServicePolicyMap.BUGSNAG) === "granted"
    ) {
      Bugsnag.notify(error);
    }
  },
});

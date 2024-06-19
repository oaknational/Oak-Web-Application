import isBrowser from "../../utils/isBrowser";

import { consentClient } from "./consentClient";
import { HasConsentedTo } from "./CookieConsentProvider";
import { servicePolicyMap } from "./types";

/**
 * Gets the latest cookie consent choices from oak-consent-client.
 * Use this function when you need to access the user's
 * consent choices from outside of the React component
 * lifecycle. If you need to use the user's consent choices
 * in React components/hooks, then use the useHasConsentedTo()
 * hook from CookieConsentProvider
 */
const getHasConsentedTo: HasConsentedTo = (serviceType) => {
  if (!isBrowser) {
    throw new Error("getHasConsentedTo() called not in browser");
  }

  const policyName = servicePolicyMap[serviceType];

  return consentClient.getConsent(policyName);
};

export default getHasConsentedTo;

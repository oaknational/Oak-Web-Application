import isBrowser from "../../utils/isBrowser";

import { getConsentsFromLocalStorage } from "./confirmic/useConfirmicConsents";
import { CookiePolicyName } from "./types";

/**
 * Gets the latest cookie consent choices from local storage.
 * Use this function when you need to access the user's
 * consent choices from outside of the React component
 * lifecycle. If you need to use the user's consent choices
 * in React components/hooks, then use the hasConsentedTo()
 * hook from CookieConsentProvider
 */
const getHasConsentedTo = (policyName: CookiePolicyName): boolean => {
  if (!isBrowser) {
    throw new Error("getHasConsentedTo() called not in browser");
  }
  return getConsentsFromLocalStorage()[policyName].enabled;
};

export default getHasConsentedTo;

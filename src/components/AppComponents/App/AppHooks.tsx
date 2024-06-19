import { watchModals } from "@react-aria/aria-modal-polyfill";
import { useRouter } from "next/router";

import useAxe from "@/browser-lib/axe/useAxe";
import useBugsnag from "@/browser-lib/bugsnag/useBugsnag";
import useGleap from "@/browser-lib/gleap";
import isBrowser from "@/utils/isBrowser";
import useAnalytics from "@/context/Analytics/useAnalytics";
import removeDecommissionedKeys from "@/config/removeDecommissionedKeys";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { ServicePolicyMap } from "@/browser-lib/cookie-consent/ServicePolicyMap";
import { useCookieConsent } from "@/browser-lib/cookie-consent/CookieConsentProvider";

/**
 * Anything code that should run once in the browser should be placed here
 */
if (isBrowser) {
  watchModals();
  removeDecommissionedKeys();
}

/**
 * These hooks will generally be used to initialise listeners etc
 * when the app first loads.
 */
const useAppHooks = () => {
  const { getConsentState } = useCookieConsent();
  const { posthogDistinctId } = useAnalytics();
  const router = useRouter();
  useBugsnag({
    enabled: getConsentState(ServicePolicyMap.BUGSNAG) === "granted",
    userId: posthogDistinctId,
  });
  useGleap({
    enabled:
      getConsentState(ServicePolicyMap.GLEAP) === "granted" &&
      !router.pathname.startsWith("/pupils") && // Disable Gleap for pupils
      !router.pathname.startsWith("/videos"), // Disable Gleap for standalone video pages
  });
  useAxe({ enabled: getBrowserConfig("axeA11yLogging") === "on" });
};

const AppHooks = () => {
  useAppHooks();

  return null;
};
export default AppHooks;

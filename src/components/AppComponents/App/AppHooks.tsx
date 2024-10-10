import { watchModals } from "@react-aria/aria-modal-polyfill";
import { useRouter } from "next/router";
import { useOakConsent } from "@oaknational/oak-consent-client";

import useAxe from "@/browser-lib/axe/useAxe";
import useBugsnag from "@/browser-lib/bugsnag/useBugsnag";
import useGleap from "@/browser-lib/gleap";
import isBrowser from "@/utils/isBrowser";
import useAnalytics from "@/context/Analytics/useAnalytics";
import removeDecommissionedKeys from "@/config/removeDecommissionedKeys";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { ServicePolicyMap } from "@/browser-lib/cookie-consent/ServicePolicyMap";
import { useTrackRegistration } from "@/hooks/useTrackRegistration";

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
  const { getConsent } = useOakConsent();
  const { posthogDistinctId } = useAnalytics();
  const router = useRouter();
  useBugsnag({
    enabled: getConsent(ServicePolicyMap.BUGSNAG) === "granted",
    userId: posthogDistinctId,
  });
  useGleap({
    enabled:
      getConsent(ServicePolicyMap.GLEAP) === "granted" &&
      !router.pathname.startsWith("/pupils") && // Disable Gleap for pupils
      !router.pathname.startsWith("/videos"), // Disable Gleap for standalone video pages
  });
  useAxe({ enabled: getBrowserConfig("axeA11yLogging") === "on" });
  useTrackRegistration();
};

const AppHooks = () => {
  useAppHooks();

  return null;
};
export default AppHooks;

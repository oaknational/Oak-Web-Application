import { watchModals } from "@react-aria/aria-modal-polyfill";

import useAxe from "../../browser-lib/axe/useAxe";
import useBugsnag from "../../browser-lib/bugsnag/useBugsnag";
import { useCookieConsent } from "../../browser-lib/cookie-consent/CookieConsentProvider";
import useGleap from "../../browser-lib/gleap";
import isBrowser from "../../utils/isBrowser";
import useAnalytics from "../../context/Analytics/useAnalytics";
import removeDecommissionedKeys from "../../config/removeDecommissionedKeys";
import getBrowserConfig from "../../browser-lib/getBrowserConfig";

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
  const { hasConsentedTo } = useCookieConsent();
  const { posthogDistinctId } = useAnalytics();
  useBugsnag({
    enabled: hasConsentedTo("bugsnag") === "enabled",
    userId: posthogDistinctId,
  });
  useGleap({ enabled: hasConsentedTo("gleap") === "enabled" });
  useAxe({ enabled: getBrowserConfig("axeA11yLogging") === "on" });
};

const AppHooks = () => {
  useAppHooks();

  return null;
};
export default AppHooks;

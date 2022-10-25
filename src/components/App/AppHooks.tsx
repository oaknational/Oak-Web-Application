import { watchModals } from "@react-aria/aria-modal-polyfill";

import useAxe from "../../browser-lib/axe/useAxe";
import useBugsnag from "../../browser-lib/bugsnag/useBugsnag";
import { useCookieConsent } from "../../browser-lib/cookie-consent/CookieConsentProvider";
import useGleap from "../../browser-lib/gleap";
import config from "../../config/browser";
import isBrowser from "../../utils/isBrowser";

/**
 * Anything code that should run once in the browser should be placed here
 */
if (isBrowser) {
  watchModals();
}

/**
 * These hooks will generally be used to initialise listeners etc
 * when the app first loads.
 */
const useAppHooks = () => {
  const { hasConsentedTo } = useCookieConsent();

  useBugsnag({ enabled: hasConsentedTo("bugsnag") === "enabled" });
  useGleap({ enabled: hasConsentedTo("gleap") === "enabled" });
  useAxe({ enabled: config.get("axeA11yLogging") === "on" });
};

const AppHooks = () => {
  useAppHooks();

  return null;
};
export default AppHooks;

import useBugsnag from "../../browser-lib/bugsnag/useBugsnag";
import { useCookieConsent } from "../../browser-lib/cookie-consent/CookieConsentProvider";
import useGleap from "../../browser-lib/gleap";

/**
 * @description These hooks will generally be used to initialise listeners etc when the app first loads
 */
const useAppHooks = () => {
  const { hasConsentedTo } = useCookieConsent();

  useBugsnag({ enabled: hasConsentedTo("bugsnag") });
  useGleap({ enabled: hasConsentedTo("gleap") });
};

const AppHooks = () => {
  useAppHooks();

  return null;
};
export default AppHooks;

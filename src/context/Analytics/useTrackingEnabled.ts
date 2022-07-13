import { useCookieConsent } from "../../browser-lib/cookie-consent/CookieConsentProvider";

const useTrackingEnabled = () => {
  const { hasConsentedTo } = useCookieConsent();

  return hasConsentedTo("statistics");
};

export default useTrackingEnabled;

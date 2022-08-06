import { useCookieConsent } from "./CookieConsentProvider";
import { ServiceType } from "./types";

const useHasConsentedTo = (serviceType: ServiceType) => {
  const { hasConsentedTo } = useCookieConsent();

  return hasConsentedTo(serviceType);
};

export default useHasConsentedTo;

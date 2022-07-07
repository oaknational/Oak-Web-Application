import { FC, ReactNode } from "react";

import { useCookieConsent } from "./CookieConsentProvider";
import { CookiePolicyName } from "./types";

type CookieConsentGateProps = {
  policyName: CookiePolicyName;
  children: ReactNode;
};
/**
 * CookieConsentGate will conditionally render it's children if the user
 * has consented to the cookie policy whose name is pass as prop
 * 'policyName'.
 */
const CookieConsentGate: FC<CookieConsentGateProps> = (props) => {
  const { policyName, children } = props;
  const { hasConsentedTo } = useCookieConsent();

  if (!hasConsentedTo(policyName)) {
    return null;
  }

  return <>{children}</>;
};

export default CookieConsentGate;

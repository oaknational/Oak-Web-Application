/**
 * This file should provide all we need to:
 * 1. allow the user to set/update cookie preferences
 * 2. determine which services should run depending on which policies are agreed to
 */

import { createContext, FC, useContext } from "react";

// eslint-disable-next-line
// @ts-ignore
import { MetomicProvider } from "./confirmic/metomic-react.hacked.ts";
import useConfirmicConsents from "./confirmic/useConfirmicConsents";
import {
  CookieConsent,
  CookieConsentState,
  CookiePolicyName,
  servicePolicyMap,
  ServiceType,
} from "./types";

export type CookieConsents = Record<CookiePolicyName, CookieConsent>;
export type HasConsentedTo = (serviceType: ServiceType) => CookieConsentState;
export type HasConsentedToPolicy = (
  policyName: CookiePolicyName
) => CookieConsentState;

export type CookieConsentContext = {
  // makes consent manager modal visible
  showConsentManager: () => void;
  // whether the user has granted consent to the latest version of a partular policy
  hasConsentedTo: HasConsentedTo;
  // consent by policyName
  hasConsentedToPolicy: HasConsentedToPolicy;
};

export const cookieConsentContext = createContext<CookieConsentContext | null>(
  null
);

export const useCookieConsent = () => {
  const cookieConsentsContext = useContext(cookieConsentContext);
  if (!cookieConsentsContext) {
    throw new Error(
      "useCookieConsent() called outside of cookieConsentContext provider"
    );
  }
  return cookieConsentsContext;
};

type CookieConsentProviderProps = {
  children?: React.ReactNode;
  __testMockValue?: CookieConsentContext;
};
const CookieConsentProvider: FC<CookieConsentProviderProps> = (props) => {
  const { children } = props;
  const consents = useConfirmicConsents();

  const showConsentManager = () => {
    // eslint-disable-next-line
    // @ts-ignore
    window.Metomic("ConsentManager:show");
  };

  const hasConsentedTo = (serviceType: ServiceType) => {
    const policyName = servicePolicyMap[serviceType];

    return consents[policyName].state;
  };

  const hasConsentedToPolicy = (policyName: CookiePolicyName) => {
    return consents[policyName].state;
  };

  return (
    <MetomicProvider projectId="prj:ecbd577f-d069-4aae-aae2-b622504679cd">
      <cookieConsentContext.Provider
        value={{ showConsentManager, hasConsentedTo, hasConsentedToPolicy }}
      >
        {children}
      </cookieConsentContext.Provider>
    </MetomicProvider>
  );
};

export default CookieConsentProvider;

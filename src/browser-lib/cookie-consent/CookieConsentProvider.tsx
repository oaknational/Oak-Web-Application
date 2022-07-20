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
import { CookieConsentChoice, CookiePolicyName } from "./types";

export type CookieConsents = Record<CookiePolicyName, CookieConsentChoice>;

type CookieConsentContext = {
  // makes consent manager modal visible
  showConsentManager: () => void;
  // user consent choices
  consents: CookieConsents;
  // whether the user has granted consent to a partular policy
  hasConsentedTo: (policyName: CookiePolicyName) => boolean;
};

const cookieConsentContext = createContext<CookieConsentContext | null>(null);

export const useCookieConsent = () => {
  const cookieConsentsContext = useContext(cookieConsentContext);
  if (!cookieConsentsContext) {
    throw new Error(
      "useCookieConsent() called outside of cookieConsentContext provider"
    );
  }
  return cookieConsentsContext;
};
const CookieConsentProvider: FC = (props) => {
  const { children } = props;
  const consents = useConfirmicConsents();

  const showConsentManager = () => {
    // eslint-disable-next-line
    // @ts-ignore
    window.Metomic("ConsentManager:show");
  };

  const hasConsentedTo = (policyName: CookiePolicyName) => {
    return consents[policyName].enabled;
  };

  return (
    <MetomicProvider projectId="prj:ecbd577f-d069-4aae-aae2-b622504679cd">
      <cookieConsentContext.Provider
        value={{ consents, showConsentManager, hasConsentedTo }}
      >
        {children}
      </cookieConsentContext.Provider>
    </MetomicProvider>
  );
};

export default CookieConsentProvider;

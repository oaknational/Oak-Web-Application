/**
 * This file should provide all we need to:
 * 1. allow the user to set/update cookie preferences
 * 2. determine which services should run depending on which policies are agreed to
 */
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
} from "react";
import {
  OakConsentProvider,
  useOakConsent,
} from "@oaknational/oak-consent-client";
import {
  OakCookieConsent,
  OakCookieConsentProvider,
  oakDefaultTheme,
  OakThemeProvider,
  useCookieConsent as useCookieConsentUI,
} from "@oaknational/oak-components";

import {
  CookieConsent,
  CookieConsentState,
  CookiePolicyName,
  servicePolicyMap,
  ServiceType,
} from "./types";
import { consentClient } from "./consentClient";

export type CookieConsents = Record<CookiePolicyName, CookieConsent>;
export type HasConsentedTo = (serviceType: ServiceType) => CookieConsentState;
export type HasConsentedToPolicy = (
  policyName: CookiePolicyName,
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
  null,
);

export const useCookieConsent = () => {
  const cookieConsentsContext = useContext(cookieConsentContext);
  if (!cookieConsentsContext) {
    throw new Error(
      "useCookieConsent() called outside of cookieConsentContext provider",
    );
  }
  return cookieConsentsContext;
};

type CookieConsentProviderProps = {
  children?: React.ReactNode;
  __testMockValue?: CookieConsentContext;
};

const CookieConsentContextProvider: FC<CookieConsentProviderProps> = (
  props,
) => {
  const { getConsent, state } = useOakConsent();
  const { openSettings: showConsentManager, showBanner } = useCookieConsentUI();
  const hasConsentedToPolicy = (policyName: CookiePolicyName) => {
    return getConsent(policyName);
  };
  const hasConsentedTo = (serviceType: ServiceType) => {
    const policyName = servicePolicyMap[serviceType];

    return hasConsentedToPolicy(policyName);
  };

  useEffect(() => {
    if (state.requiresInteraction) {
      showBanner();
    }
  }, [state.requiresInteraction, showBanner]);

  return (
    <cookieConsentContext.Provider
      {...props}
      value={{ showConsentManager, hasConsentedTo, hasConsentedToPolicy }}
    />
  );
};

const CookieConsentUIProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const { state, logConsents } = useOakConsent();
  const policies = state.policyConsents.map((policyConsent) => ({
    id: policyConsent.policyId,
    label: policyConsent.policyLabel,
    description: policyConsent.policyDescription,
    strictlyNecessary: policyConsent.isStrictlyNecessary,
    parties: policyConsent.policyParties.map((party) => ({
      name: party.name,
      policyURL: party.url,
    })),
  }));

  const currentConsents = state.policyConsents.reduce<{
    [policyId: string]: Exclude<CookieConsentState, "pending">;
  }>((acc, policyConsent) => {
    if (policyConsent.consentState !== "pending") {
      acc[policyConsent.policyId] = policyConsent.consentState;
    }
    return acc;
  }, {});

  return (
    <OakCookieConsentProvider
      policies={policies}
      currentConsents={currentConsents}
      onConsentChange={(consents) => {
        const consentsToLog = Object.entries(consents).map(
          ([policyId, consentState]) => ({
            policyId,
            consentState,
          }),
        );
        console.log("Logging consents", consentsToLog);

        logConsents(consentsToLog);
      }}
    >
      {children}
      <OakThemeProvider theme={oakDefaultTheme}>
        <OakCookieConsent policyURL="/legal/cookie-policy" isFixed />
      </OakThemeProvider>
    </OakCookieConsentProvider>
  );
};

const CookieConsentProvider: FC<CookieConsentProviderProps> = (props) => (
  <OakConsentProvider client={consentClient}>
    <CookieConsentUIProvider>
      <CookieConsentContextProvider {...props} />
    </CookieConsentUIProvider>
  </OakConsentProvider>
);

export default CookieConsentProvider;

/**
 * This file should provide all we need to:
 * 1. allow the user to set/update cookie preferences
 * 2. determine which services should run depending on which policies are agreed to
 */
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
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

import { consentClient } from "./consentClient";

export type CookieConsentContext = {
  /**
   * Show the cookie consent modal
   */
  showConsentManager: () => void;
  /**
   * Get the current consent state for a given policy
   */
  getConsentState: (
    policyName: "strictly-necessary" | "embedded-content" | "statistics",
  ) => "granted" | "denied" | "pending";
};

export const cookieConsentContext = createContext<CookieConsentContext | null>(
  null,
);

/**
 * Provides methods to open the consent settings and get the current consent state for a policy
 */
export const useCookieConsent = () => {
  const context = useContext(cookieConsentContext);

  if (!context) {
    throw new Error(
      "useCookieConsent() called outside of cookieConsentContext provider",
    );
  }

  return context;
};

const CookieConsentContextProvider = (props: PropsWithChildren) => {
  const { state, getConsent: getConsentState } = useOakConsent();
  const { showBanner, openSettings: showConsentManager } = useCookieConsentUI();

  useEffect(() => {
    if (state.requiresInteraction) {
      showBanner();
    }
  }, [state.requiresInteraction, showBanner]);

  return (
    <cookieConsentContext.Provider
      {...props}
      // This value should not be memoised as it should always trigger a render whenever `state` changes
      value={{ getConsentState, showConsentManager }} //NOSONAR
    />
  );
};

const CookieConsentUIProvider = ({ children }: PropsWithChildren) => {
  const { state, logConsents } = useOakConsent();
  // Suppress an SSR warning around using `useLayoutEffect` on the server
  // by only rendering the consent UI on the client
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <OakCookieConsentProvider
      policyConsents={state.policyConsents}
      onConsentChange={logConsents}
    >
      {children}
      <OakThemeProvider theme={oakDefaultTheme}>
        {isMounted && (
          <OakCookieConsent policyURL="/legal/cookie-policy" isFixed />
        )}
      </OakThemeProvider>
    </OakCookieConsentProvider>
  );
};

const CookieConsentProvider = (props: PropsWithChildren) => (
  <OakConsentProvider client={consentClient}>
    <CookieConsentUIProvider>
      <CookieConsentContextProvider {...props} />
    </CookieConsentUIProvider>
  </OakConsentProvider>
);

export default CookieConsentProvider;

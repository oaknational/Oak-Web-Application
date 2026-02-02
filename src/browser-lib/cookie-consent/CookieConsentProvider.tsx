"use client";
/**
 * This file should provide all we need to:
 * 1. allow the user to set/update cookie preferences
 * 2. determine which services should run depending on which policies are agreed to
 */

import { PropsWithChildren, useEffect, useState } from "react";
// eslint-disable-next-line import/order
import {
  MockOakConsentClient,
  OakConsentClient,
  OakConsentProvider,
  useOakConsent,
} from "@oaknational/oak-consent-client";

import {
  OakBox,
  OakCookieConsent,
  OakCookieConsentProvider,
  useCookieConsent as useCookieConsentUI,
} from "@oaknational/oak-components";

// eslint-disable-next-line import/order
import { consentClient } from "./consentClient";

const RequiresInteraction = () => {
  const { state } = useOakConsent();
  const { showBanner } = useCookieConsentUI();

  useEffect(() => {
    if (state.requiresInteraction) {
      showBanner();
    }
  }, [state.requiresInteraction, showBanner]);

  return null;
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
      {isMounted && (
        <OakBox $position={"sticky"} $bottom={"spacing-0"} $zIndex={"banner"}>
          <OakCookieConsent policyURL="/legal/cookie-policy" />
          <RequiresInteraction />
        </OakBox>
      )}
    </OakCookieConsentProvider>
  );
};

const CookieConsentProvider = ({
  children,
  client = consentClient,
}: PropsWithChildren<{ client?: OakConsentClient | MockOakConsentClient }>) => (
  <OakConsentProvider client={client}>
    <CookieConsentUIProvider>{children}</CookieConsentUIProvider>
  </OakConsentProvider>
);

export default CookieConsentProvider;

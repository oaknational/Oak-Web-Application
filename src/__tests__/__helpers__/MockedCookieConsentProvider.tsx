import { FC } from "react";

import {
  CookieConsentContext,
  cookieConsentContext,
} from "../../browser-lib/cookie-consent/CookieConsentProvider";

import noop from "./noop";

const MockedAnalyticsProvider: FC<{
  children?: React.ReactNode;
  value?: CookieConsentContext;
}> = ({ children, value }) => {
  return (
    <cookieConsentContext.Provider
      value={{
        hasConsentedTo: () => "pending",
        hasConsentedToPolicy: () => "pending",
        showConsentManager: noop,
        ...value,
      }}
    >
      {children}
    </cookieConsentContext.Provider>
  );
};

export default MockedAnalyticsProvider;

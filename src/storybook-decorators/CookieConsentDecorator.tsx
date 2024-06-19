import { Story } from "@storybook/react";
import { useState } from "react";

import { cookieConsentContext } from "../browser-lib/cookie-consent/CookieConsentProvider";
import {
  CookiePolicyName,
  ServiceType,
} from "../browser-lib/cookie-consent/types";
import noop from "../__tests__/__helpers__/noop";

export default function CookieConsentDecorator(Story: Story) {
  const [state] = useState({
    showConsentManager: noop,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasConsentedTo: (serviceType: ServiceType) => "denied",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasConsentedToPolicy: (policyName: CookiePolicyName) => "denied",
  });

  return (
    <cookieConsentContext.Provider value={state}>
      <Story />
    </cookieConsentContext.Provider>
  );
}

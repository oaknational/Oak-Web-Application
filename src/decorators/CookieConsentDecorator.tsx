import { Story } from "@storybook/react";
import { FC, useState } from "react";

import { cookieConsentContext } from "../browser-lib/cookie-consent/CookieConsentProvider";
import {
  CookiePolicyName,
  ServiceType,
} from "../browser-lib/cookie-consent/types";

export default function CookieConsentDecorator(Story: Story | FC) {
  const [state] = useState({
    /* eslint-disable @typescript-eslint/no-empty-function */
    showConsentManager: () => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasConsentedTo: (serviceType: ServiceType) => "disabled",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasConsentedToPolicy: (policyName: CookiePolicyName) => "disabled",
    /* eslint-enable @typescript-eslint/no-empty-function */
  });

  return (
    <div>
      <cookieConsentContext.Provider value={state}>
        <Story />
      </cookieConsentContext.Provider>
    </div>
  );
}

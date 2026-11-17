import type { Decorator } from "@storybook/react";
import { MockOakConsentClient } from "@oaknational/oak-consent-client";

import CookieConsentProvider from "@/browser-lib/cookie-consent/CookieConsentProvider";

const CookieConsentDecorator: Decorator = (Story) => {
  return (
    <CookieConsentProvider client={new MockOakConsentClient()}>
      <Story />
    </CookieConsentProvider>
  );
};

export default CookieConsentDecorator;

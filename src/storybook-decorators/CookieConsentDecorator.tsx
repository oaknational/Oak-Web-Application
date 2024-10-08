import { StoryFn } from "@storybook/react";
import { MockOakConsentClient } from "@oaknational/oak-consent-client";

import CookieConsentProvider from "@/browser-lib/cookie-consent/CookieConsentProvider";

export default function CookieConsentDecorator(Story: StoryFn) {
  return (
    <CookieConsentProvider client={new MockOakConsentClient()}>
      <Story />
    </CookieConsentProvider>
  );
}

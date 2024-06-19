import { Story } from "@storybook/react";
import { useState } from "react";

import noop from "../__tests__/__helpers__/noop";

import { cookieConsentContext } from "@/browser-lib/cookie-consent/CookieConsentProvider";

export default function CookieConsentDecorator(Story: Story) {
  const [state] = useState({
    showConsentManager: noop,
    getConsentState: () => "denied",
  });

  return (
    <cookieConsentContext.Provider value={state}>
      <Story />
    </cookieConsentContext.Provider>
  );
}

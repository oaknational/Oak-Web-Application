import React, { FC } from "react";
import { PortableTextMarkComponent } from "@portabletext/react";

import { Span } from "../Typography";
import UnstyledButton from "../UnstyledButton";
import { useCookieConsent } from "../../browser-lib/cookie-consent/CookieConsentProvider";

enum AllowedActions {
  OPEN_COOKIE_SETTINGS = "OPEN_COOKIE_SETTINGS",
}

/**
 * Trigger a JS function call on click
 */
export const PTActionTrigger: PortableTextMarkComponent<{
  _type: "action";
  actionType: AllowedActions;
}> = (props) => {
  const actionType = props.value?.actionType;

  switch (actionType) {
    case AllowedActions.OPEN_COOKIE_SETTINGS:
      return <ConsentManagerTrigger {...props} />;
    default:
      console.warn("Unable to render action for props:", props);
      return null;
  }
};

const ConsentManagerTrigger: FC = (props) => {
  const { showConsentManager } = useCookieConsent();

  return (
    <UnstyledButton onClick={showConsentManager}>
      <Span $color="hyperlink">{props.children}</Span>
    </UnstyledButton>
  );
};

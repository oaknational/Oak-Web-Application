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

const ConsentManagerTrigger: FC<{ children?: React.ReactNode }> = (props) => {
  const { showConsentManager } = useCookieConsent();

  return (
    <UnstyledButton
      $color="navy"
      $textDecoration={"underline"}
      $display="inline"
      onClick={showConsentManager}
    >
      <Span $color="navy">{props.children}</Span>
    </UnstyledButton>
  );
};

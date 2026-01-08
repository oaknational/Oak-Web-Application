import React, { FC } from "react";
import { PortableTextMarkComponent } from "@portabletext/react";
import { OakSpan, useCookieConsent } from "@oaknational/oak-components";

import UnstyledButton from "@/components/SharedComponents/UnstyledButton";

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
  const { openSettings } = useCookieConsent();

  return (
    <UnstyledButton
      $color="navy"
      $textDecoration={"underline"}
      $display="inline"
      onClick={openSettings}
    >
      <OakSpan $color="text-link-active">{props.children}</OakSpan>
    </UnstyledButton>
  );
};

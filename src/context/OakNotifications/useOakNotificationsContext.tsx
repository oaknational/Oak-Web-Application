import { useContext } from "react";

import { oakNotificationsContext } from "./OakNotificationsProvider";

export const useOakNotificationsContext = () => {
  const oakNotificationsValue = useContext(oakNotificationsContext);

  if (!oakNotificationsValue) {
    throw new Error(
      "useOakNotificationsContext() called outside of OakToastProvider",
    );
  }

  return oakNotificationsValue;
};

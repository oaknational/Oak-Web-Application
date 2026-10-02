import type { Decorator } from "@storybook/react";

import { oakNotificationsContext } from "@/context/OakNotifications/OakNotificationsProvider";

const NotificationsDecorator: Decorator = (Story) => {
  const NotificationsProvider = oakNotificationsContext.Provider;

  const value = {
    currentToastProps: null,
    setCurrentToastProps: () => console.log("set toast props"),
    currentBannerProps: null,
    setCurrentBannerProps: () => console.log("set banner props"),
  };

  return (
    <NotificationsProvider value={value}>
      <Story />
    </NotificationsProvider>
  );
};

export default NotificationsDecorator;

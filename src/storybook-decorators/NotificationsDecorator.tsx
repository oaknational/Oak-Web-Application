import { StoryFn } from "@storybook/react";

import { oakNotificationsContext } from "@/context/OakNotifications/OakNotificationsProvider";

export default function NotificationsDecorator(Story: StoryFn) {
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
}

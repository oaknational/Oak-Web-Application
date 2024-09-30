import { useContext } from "react";

import { pupilAnalyticsContext } from "./PupilAnalyticsProvider";

const isStorybook = !!process.env.STORYBOOK;

export const usePupilAnalytics = () => {
  const analytics = useContext(pupilAnalyticsContext);

  if (isStorybook) {
    // Provide a mock implementation for Storybook
    return {
      trackEvent: (event: string, data: unknown) => {
        console.log(`Mock trackEvent called with event: ${event}, data:`, data);
      },
      // Add other mock methods as needed
    };
  }

  if (!analytics) {
    throw new Error("usePupilAnalytics called outside of AnalyticsProvider");
  }

  return analytics;
};

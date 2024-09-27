import { useContext } from "react";

import { analyticsContext } from "./AnalyticsProvider";

const isStorybook = !!process.env.STORYBOOK;

const useAnalytics = () => {
  const analytics = useContext(analyticsContext);

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
    throw new Error("useAnalytics called outside of AnalyticsProvider");
  }

  return analytics;
};

export default useAnalytics;

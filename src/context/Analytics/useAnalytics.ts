import { useContext } from "react";

import { AnalyticsContext, analyticsContext } from "./AnalyticsProvider";
import { getMockAnalytics } from "./getMockAnalytics";

const isStorybook = !!process.env.STORYBOOK;

const useAnalytics = (): AnalyticsContext => {
  const analytics = useContext(analyticsContext);

  if (isStorybook) {
    return getMockAnalytics();
  }

  if (!analytics) {
    throw new Error("useAnalytics called outside of AnalyticsProvider");
  }

  return analytics;
};

export default useAnalytics;

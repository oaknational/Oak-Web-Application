import { useContext } from "react";

import { pupilAnalyticsContext } from "./PupilAnalyticsProvider";
import { getMockPupilAnalytics } from "./getMockPupilAnalytics";

export const usePupilAnalytics = () => {
  const analytics = useContext(pupilAnalyticsContext);
  const isStorybook = !!process.env.STORYBOOK;

  if (isStorybook) {
    return getMockPupilAnalytics();
  }

  if (!analytics) {
    throw new Error("usePupilAnalytics called outside of AnalyticsProvider");
  }

  return analytics;
};

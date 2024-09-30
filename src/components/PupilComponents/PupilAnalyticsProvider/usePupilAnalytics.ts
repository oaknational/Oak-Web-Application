import { useContext } from "react";

import { pupilAnalyticsContext } from "./PupilAnalyticsProvider";
import { getMockPupilAnalytics } from "./getMockPupilAnalytics";

const isStorybook = !!process.env.STORYBOOK;

export const usePupilAnalytics = () => {
  const analytics = useContext(pupilAnalyticsContext);

  if (isStorybook) {
    return getMockPupilAnalytics();
  }

  if (!analytics) {
    throw new Error("usePupilAnalytics called outside of AnalyticsProvider");
  }

  return analytics;
};

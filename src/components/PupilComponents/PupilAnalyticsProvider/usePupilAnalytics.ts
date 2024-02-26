import { useContext } from "react";

import { pupilAnalyticsContext } from "./PupilAnalyticsProvider";

export const usePupilAnalytics = () => {
  const analytics = useContext(pupilAnalyticsContext);

  if (!analytics) {
    throw new Error("usePupilAnalytics called outside of AnalyticsProvider");
  }

  return analytics;
};

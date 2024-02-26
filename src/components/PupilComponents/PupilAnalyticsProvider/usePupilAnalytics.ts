/**
 * This file is used to wrap the track function from the analytics context
 * and only expose the functions that are relevant to the pupil experience.
 * It ensures that we keep all of our tracking events in one neat little file.
 *
 * You can find the source code for the tracking events in src/browser-lib/avo/Avo.ts
 *
 */

import { useContext } from "react";

import { pupilAnalyticsContext } from "./PupilAnalyticsProvider";

export const usePupilAnalytics = () => {
  const analytics = useContext(pupilAnalyticsContext);

  if (!analytics) {
    throw new Error("usePupilAnalytics called outside of AnalyticsProvider");
  }

  return analytics;
};

import { useContext } from "react";
import { pick } from "lodash";

import {
  TrackFns,
  analyticsContext,
} from "@/context/Analytics/AnalyticsProvider";

const trackingEvents = ["lessonSelected", "unitSelected"] as const;

type PupilAnalytics = (typeof trackingEvents)[number];

export const usePupilAnalytics = () => {
  const analytics = useContext(analyticsContext);

  if (!analytics) {
    throw new Error("usePupilAnalytics called outside of AnalyticsProvider");
  }

  // wrap the track function
  const pupilTrack = pick<TrackFns, PupilAnalytics>(
    analytics.track,
    trackingEvents,
  );

  return { ...analytics, track: pupilTrack };
};

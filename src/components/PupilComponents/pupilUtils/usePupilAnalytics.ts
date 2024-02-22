/**
 * This file is used to wrap the track function from the analytics context
 * and only expose the functions that are relevant to the pupil experience.
 * It ensures that we keep all of our tracking events in one neat little file.
 *
 * You can find the source code for the tracking events in src/browser-lib/avo/Avo.ts
 *
 */

import { useContext } from "react";
import { pick } from "lodash";

import {
  TrackFns,
  analyticsContext,
} from "@/context/Analytics/AnalyticsProvider";

const trackingEvents = [
  "lessonStarted",
  "lessonCompleted",
  "lessonSectionStarted",
  "lessonSectionCompleted",
] as const;

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

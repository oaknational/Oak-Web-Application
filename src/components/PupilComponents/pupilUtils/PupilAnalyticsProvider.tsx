import { pick } from "lodash";

import {
  TrackFns,
  analyticsContext,
} from "@/context/Analytics/AnalyticsProvider";
import useAnalytics from "@/context/Analytics/useAnalytics";

const trackingEvents = [
  "lessonStarted",
  "lessonCompleted",
  "lessonSectionStarted",
  "lessonSectionCompleted",
] as const;

type PupilAnalytics = (typeof trackingEvents)[number];

export const PupilAnalyticsProvider = (props: {
  children: React.ReactNode;
}) => {
  const { children } = props;

  const { track, ...rest } = useAnalytics();

  // wrap the track function
  const pupilTrack: Pick<TrackFns, PupilAnalytics> = pick<
    TrackFns,
    PupilAnalytics
  >(track, trackingEvents);

  const extraArgs = {};

  for (const key in pupilTrack) {
    const wrapper = pupilTrack[key as PupilAnalytics];
    pupilTrack[key as PupilAnalytics] = (args: ArgType) => {
      wrapper({ ...args });
    };
  }

  return (
    <analyticsContext.Provider value={{ track, ...rest }}>
      {children}
    </analyticsContext.Provider>
  );
};

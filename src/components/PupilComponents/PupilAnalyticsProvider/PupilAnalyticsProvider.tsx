import { createContext } from "react";

import { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import useAnalytics from "@/context/Analytics/useAnalytics";
import {
  AnalyticsUseCaseValueType,
  KeyStageTitleValueType,
} from "@/browser-lib/avo/Avo";

/**
 * This file is used to wrap the track function from the analytics context
 * and only expose the functions that are relevant to the pupil experience.
 * It ensures that we keep all of our tracking events in one neat little file.
 *
 * You can find the source code for the tracking events in src/browser-lib/avo/Avo.ts
 *
 */

type NavigationEventProps =
  | "unitName"
  | "unitSlug"
  | "lessonSlug"
  | "lessonName"
  | "keyStageSlug"
  | "keyStageTitle"
  | "subjectTitle"
  | "subjectSlug";

export const trackingEvents = [
  "lessonStarted",
  "lessonCompleted",
  "lessonSectionStarted",
  "lessonSectionCompleted",
] as const;

export type PupilAnalyticsEvents = (typeof trackingEvents)[number];

type PupilAnalyticsTrack = {
  [eventName in PupilAnalyticsEvents]: (
    props: Omit<Parameters<TrackFns[eventName]>[0], NavigationEventProps>,
  ) => void;
};

export const pupilAnalyticsContext = createContext<{
  track: PupilAnalyticsTrack;
} | null>(null);

type BrowseData = {
  unitName: string;
  unitSlug: string;
  lessonSlug: string;
  lessonName: string;
  keyStageSlug: string;
  keyStageTitle: KeyStageTitleValueType;
  subjectTitle: string;
  subjectSlug: string;
  analyticsUseCase?: AnalyticsUseCaseValueType;
};

export const PupilAnalyticsProvider = (props: {
  children: React.ReactNode;
}) => {
  const { children } = props;
  const { track } = useAnalytics();

  const additionalArgs: BrowseData = {
    unitName: "foo",
    unitSlug: "bar",
    lessonSlug: "baz",
    lessonName: "qux",
    keyStageSlug: "quux",
    keyStageTitle: "Key stage 1",
    subjectTitle: "quuz",
    subjectSlug: "corge",
    analyticsUseCase: "Pupil",
  };

  const pupilTrack: PupilAnalyticsTrack = {
    lessonCompleted: (args) =>
      track.lessonCompleted({
        ...args,
        ...additionalArgs,
      }),
    lessonSectionCompleted: (args) =>
      track.lessonSectionCompleted({
        ...args,
        ...additionalArgs,
      }),
    lessonSectionStarted: (args) =>
      track.lessonSectionStarted({
        ...additionalArgs,
        ...args,
      }),
    lessonStarted: (args) =>
      track.lessonStarted({
        ...additionalArgs,
        ...args,
      }),
  };

  return (
    <pupilAnalyticsContext.Provider value={{ track: pupilTrack }}>
      {children}
    </pupilAnalyticsContext.Provider>
  );
};

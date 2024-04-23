import { createContext } from "react";

import { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import useAnalytics from "@/context/Analytics/useAnalytics";
import {
  AnalyticsUseCaseValueType,
  KeyStageTitleValueType,
  KeyStageTitle,
} from "@/browser-lib/avo/Avo";
import errorReporter from "@/common-lib/error-reporter";
import { LessonBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

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
  | "subjectSlug"
  | "analyticsUseCase";

export const trackingEvents = [
  "lessonStarted",
  "lessonCompleted",
  "lessonSectionStarted",
  "lessonSectionCompleted",
  "lessonSectionAbandoned",
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

export type PupilPathwayData = {
  unitName: string;
  unitSlug: string;
  lessonSlug: string;
  lessonName: string;
  keyStageSlug: string;
  keyStageTitle: KeyStageTitleValueType | null;
  subjectTitle: string;
  subjectSlug: string;
};

export const PupilAnalyticsProvider = ({
  children,
  pupilPathwayData,
}: {
  children: React.ReactNode;
  pupilPathwayData: PupilPathwayData;
}) => {
  const { track } = useAnalytics();

  const additionalArgs: PupilPathwayData & {
    analyticsUseCase: AnalyticsUseCaseValueType;
  } = {
    ...pupilPathwayData,
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
    lessonSectionAbandoned: (args) =>
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

const isKeyStageTitle = (
  keyStageTitle: string,
): keyStageTitle is KeyStageTitleValueType => {
  return Object.values(KeyStageTitle).includes(
    keyStageTitle as KeyStageTitleValueType,
  );
};

export const getPupilPathwayData = (
  browseData: LessonBrowseData,
): PupilPathwayData => {
  const k = browseData.programmeFields.keystageDescription.replace(
    "Stage",
    "stage",
  );

  const keyStageTitle = isKeyStageTitle(k) ? k : null;

  if (!keyStageTitle) {
    console.error("Invalid key stage title", k);
    const error = new Error("Invalid key stage title");
    errorReporter(
      "pupils::pupilAnalyticsProvider::getPupilPathwayData::invalidKeyStageTitle",
    )(error, {
      severity: "warning",
      keyStageTitle: k,
    });
  }

  return {
    unitName: browseData.unitData.description ?? "",
    unitSlug: browseData.unitData.slug,
    lessonSlug: browseData.lessonData.slug,
    lessonName: browseData.lessonData.title,
    keyStageSlug: browseData.programmeFields.keystageSlug,
    keyStageTitle,
    subjectTitle: browseData.programmeFields.subject,
    subjectSlug: browseData.programmeFields.subjectSlug,
  };
};

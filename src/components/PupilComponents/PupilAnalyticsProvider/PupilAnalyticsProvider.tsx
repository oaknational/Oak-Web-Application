import {
  TrackFns,
  analyticsContext,
} from "@/context/Analytics/AnalyticsProvider";
import useAnalytics from "@/context/Analytics/useAnalytics";

export const trackingEvents = [
  "lessonStarted",
  "lessonCompleted",
  "lessonSectionStarted",
  "lessonSectionCompleted",
] as const;

export type PupilAnalytics = (typeof trackingEvents)[number];

export const PupilAnalyticsProvider = (props: {
  children: React.ReactNode;
}) => {
  const { children } = props;

  const { track, ...rest } = useAnalytics();

  // wrap the track function
  const pupilTrack: TrackFns = { ...track };

  for (const event of trackingEvents) {
    pupilTrack[event] = (args) =>
      track[event]({
        ...args,
        unitName: "foo",
        unitSlug: "bar",
        lessonSlug: "baz",
        lessonName: "qux",
        keyStageSlug: "quux",
        subjectTitle: "quuz",
        subjectSlug: "corge",
        keyStageTitle: "Key stage 1",
        pupilExperienceLessonSection: "exit-quiz",
      });
  }

  return (
    <analyticsContext.Provider value={{ track, ...rest }}>
      {children}
    </analyticsContext.Provider>
  );
};

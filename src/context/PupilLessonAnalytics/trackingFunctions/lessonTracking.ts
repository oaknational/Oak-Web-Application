import { ComponentType, Platform } from "@/browser-lib/avo/Avo";
import type {
  AdditionalArgs,
  PupilLessonAnalyticsGet,
} from "@/context/PupilLessonAnalytics/pupilLessonAnalytics.types";
import type { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import type { PupilAnalyticsProviderClassroomContext } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";

export const getCorePropertyArgs = (
  clientEnvironment: PupilAnalyticsProviderClassroomContext["clientEnvironment"],
) =>
  ({
    platform:
      clientEnvironment === "iframe" ? Platform.GOOGLE_CLASSROOM : Platform.OWA,
    product: "pupil lesson activities",
    engagementIntent: "use",
    eventVersion: "2.0.0",
  }) as const;

export const trackLessonAccessed = ({
  track,
  additionalArgs,
}: {
  track: TrackFns;
  additionalArgs: AdditionalArgs;
}) => {
  track.lessonAccessedPupilJourney({
    ...additionalArgs,
    ...getCorePropertyArgs(additionalArgs.clientEnvironment),
    componentType: ComponentType.PAGE_VIEW,
  });
};

export const trackLessonStarted = (get: PupilLessonAnalyticsGet) => {
  const { track, additionalArgs } = get();
  if (!track || !additionalArgs) return;

  track.lessonStarted({
    ...additionalArgs,
  });
};

export const trackLessonCompleted = (get: PupilLessonAnalyticsGet) => {
  const { track, additionalArgs } = get();
  if (!track || !additionalArgs) return;

  track.lessonCompleted({
    ...additionalArgs,
  });
};

export const trackLessonAbandoned = (get: PupilLessonAnalyticsGet) => {
  const { track, additionalArgs } = get();
  if (!track || !additionalArgs) return;

  track.lessonAbandoned({
    ...additionalArgs,
    ...getCorePropertyArgs(additionalArgs.clientEnvironment),
  });
};

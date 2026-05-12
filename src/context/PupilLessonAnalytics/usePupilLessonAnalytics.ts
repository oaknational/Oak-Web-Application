import { useCallback } from "react";

import useAnalytics from "@/context/Analytics/useAnalytics";
import { usePupilLessonAnalyticsStore } from "@/context/PupilLessonAnalytics/usePupilLessonAnalyticsStore";

type InitialisePupilLessonAnalyticsArgs = Omit<
  Parameters<
    ReturnType<
      typeof usePupilLessonAnalyticsStore.getState
    >["initialisePupilLessonAnalytics"]
  >[0],
  "track"
>;

export const usePupilLessonAnalytics = () => {
  const { track } = useAnalytics();
  const initialiseStoreAnalytics = usePupilLessonAnalyticsStore(
    (state) => state.initialisePupilLessonAnalytics,
  );
  const trackSectionStarted = usePupilLessonAnalyticsStore(
    (state) => state.trackSectionStarted,
  );
  const trackQuizQuestionAttempt = usePupilLessonAnalyticsStore(
    (state) => state.trackQuizQuestionAttempt,
  );
  const trackQuizCompleted = usePupilLessonAnalyticsStore(
    (state) => state.trackQuizCompleted,
  );
  const trackQuizAbandoned = usePupilLessonAnalyticsStore(
    (state) => state.trackQuizAbandoned,
  );
  const trackLessonStarted = usePupilLessonAnalyticsStore(
    (state) => state.trackLessonStarted,
  );
  const trackLessonCompleted = usePupilLessonAnalyticsStore(
    (state) => state.trackLessonCompleted,
  );
  const trackLessonAbandoned = usePupilLessonAnalyticsStore(
    (state) => state.trackLessonAbandoned,
  );
  const trackIntroCompleted = usePupilLessonAnalyticsStore(
    (state) => state.trackIntroCompleted,
  );
  const trackIntroAbandoned = usePupilLessonAnalyticsStore(
    (state) => state.trackIntroAbandoned,
  );
  const trackWorksheetDownloaded = usePupilLessonAnalyticsStore(
    (state) => state.trackWorksheetDownloaded,
  );
  const trackVideoCompleted = usePupilLessonAnalyticsStore(
    (state) => state.trackVideoCompleted,
  );
  const trackVideoAbandoned = usePupilLessonAnalyticsStore(
    (state) => state.trackVideoAbandoned,
  );
  const trackLessonSummaryReviewed = usePupilLessonAnalyticsStore(
    (state) => state.trackLessonSummaryReviewed,
  );
  const trackActivityResultsShared = usePupilLessonAnalyticsStore(
    (state) => state.trackActivityResultsShared,
  );
  const trackContentGuidanceAccepted = usePupilLessonAnalyticsStore(
    (state) => state.trackContentGuidanceAccepted,
  );
  const trackContentGuidanceDeclined = usePupilLessonAnalyticsStore(
    (state) => state.trackContentGuidanceDeclined,
  );

  const initialisePupilLessonAnalytics = useCallback(
    (args: InitialisePupilLessonAnalyticsArgs) => {
      initialiseStoreAnalytics({ ...args, track });
    },
    [initialiseStoreAnalytics, track],
  );

  return {
    initialisePupilLessonAnalytics,
    trackSectionStarted,
    trackQuizQuestionAttempt,
    trackQuizCompleted,
    trackQuizAbandoned,
    trackLessonStarted,
    trackLessonCompleted,
    trackLessonAbandoned,
    trackIntroCompleted,
    trackIntroAbandoned,
    trackWorksheetDownloaded,
    trackVideoCompleted,
    trackVideoAbandoned,
    trackLessonSummaryReviewed,
    trackActivityResultsShared,
    trackContentGuidanceAccepted,
    trackContentGuidanceDeclined,
  };
};

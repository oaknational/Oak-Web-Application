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
  const trackLessonAbandoned = usePupilLessonAnalyticsStore(
    (state) => state.trackLessonAbandoned,
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
    trackLessonAbandoned,
  };
};

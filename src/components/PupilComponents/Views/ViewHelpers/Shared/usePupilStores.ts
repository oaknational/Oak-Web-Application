import { useEffect, useMemo, useRef } from "react";

import { getPupilPathwayData } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";
import { pickAvailableSectionsForLesson } from "@/components/PupilComponents/Views/ViewHelpers/Experience/pickAvailableSectionsForLesson";
import { usePupilLessonAnalytics } from "@/context/PupilLessonAnalytics/usePupilLessonAnalytics";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import {
  LessonBrowseData,
  LessonContent,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

type UsePupilStoresParams = {
  browseData: LessonBrowseData;
  lessonContent: LessonContent;
};

/**
 * Initialises pupil lesson stores for the page-based pupil experience flow.
 *
 * This hook sets up:
 * - `PupilLessonProgress` (review sections and progress state)
 * - `PupilLessonAnalytics` (pathway/context + lesson analytics payload data)
 *
 * @param params Optional lesson payload used to initialise both stores.
 */
export const usePupilStores = (params?: UsePupilStoresParams) => {
  const browseData = params?.browseData;
  const lessonContent = params?.lessonContent;
  const availableSections = useMemo(
    () => (lessonContent ? pickAvailableSectionsForLesson(lessonContent) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      lessonContent?.starterQuiz,
      lessonContent?.exitQuiz,
      lessonContent?.videoMuxPlaybackId,
    ],
  );
  const availableSectionsKey = availableSections.join("|");
  const initialiseKeyRef = useRef<string | null>(null);
  const initialiseLessonProgress = usePupilLessonProgress(
    (state) => state.initialiseLessonProgress,
  );
  const currentLessonSlug = usePupilLessonProgress((state) => state.lessonSlug);
  const { initialisePupilLessonAnalytics } = usePupilLessonAnalytics();
  const pathwayData = useMemo(
    () => (browseData ? getPupilPathwayData(browseData) : null),
    [browseData],
  );
  const analyticsInitialiseKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!browseData || !lessonContent) return;
    if (currentLessonSlug === browseData.lessonSlug) return;
    const initialiseKey = `${browseData.lessonSlug}:${availableSectionsKey}`;
    if (initialiseKeyRef.current === initialiseKey) return;
    initialiseKeyRef.current = initialiseKey;

    initialiseLessonProgress({
      lessonSlug: browseData.lessonSlug,
      lessonReviewSections: availableSections,
      isReadOnly: false,
      isHydratingInitialProgress: false,
    });
  }, [
    availableSections,
    availableSectionsKey,
    browseData,
    currentLessonSlug,
    lessonContent,
    initialiseLessonProgress,
  ]);

  useEffect(() => {
    if (!browseData || !lessonContent || !pathwayData) return;
    const initialiseKey = browseData.lessonSlug;
    if (analyticsInitialiseKeyRef.current === initialiseKey) return;
    analyticsInitialiseKeyRef.current = initialiseKey;

    initialisePupilLessonAnalytics({
      pupilPathwayData: pathwayData,
      classroomAssignmentContext: {
        courseId: null,
        itemId: null,
        attachmentId: null,
        clientEnvironment: "web-browser",
        classroomAssignmentId: null,
      },
      lessonContent,
    });
  }, [browseData, initialisePupilLessonAnalytics, lessonContent, pathwayData]);
};

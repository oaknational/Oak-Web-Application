import { useEffect, useMemo, useRef } from "react";

import { useClassroomAddonContext } from "@/components/PupilComponents/Views/ViewHelpers/Shared/useClassroomAddonContext";
import { useClassroomProgressSync } from "@/components/PupilComponents/Views/ViewHelpers/Shared/useClassroomProgressSync";
import { pickAvailableSectionsForLesson } from "@/components/PupilComponents/Views/ViewHelpers/Experience/pickAvailableSectionsForLesson";
import { getPupilPathwayData } from "@/context/PupilLessonAnalytics/pupilAnalyticsHelpers";
import { usePupilLessonAnalytics } from "@/context/PupilLessonAnalytics/usePupilLessonAnalytics";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import type { ClassroomAssignmentContext } from "@/browser-lib/google-classroom/classroomAssignmentContext";
import {
  LessonBrowseData,
  LessonContent,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { LessonShareVariant } from "@/pages-helpers/pupil";

type UsePupilStoresParams = {
  browseData: LessonBrowseData;
  lessonContent: LessonContent;
  variant: LessonShareVariant | null;
};

/**
 * Initialises pupil lesson stores for the page-based pupil experience flow.
 *
 * This hook sets up:
 * - `PupilLessonProgress` (review sections and progress state)
 * - `PupilLessonAnalytics` (pathway/context + lesson analytics payload data)
 * - Google Classroom progress write-back (for add-on assignments)
 *
 * @param params Optional lesson payload used to initialise both stores.
 */
export const usePupilStores = (params?: UsePupilStoresParams) => {
  const browseData = params?.browseData;
  const lessonContent = params?.lessonContent;

  const classroom = useClassroomAddonContext();

  const availableSections = useMemo(
    () =>
      lessonContent
        ? pickAvailableSectionsForLesson(lessonContent, params.variant)
        : [],
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
  const setReadOnly = usePupilLessonProgress((state) => state.setReadOnly);
  const setRefreshReadOnly = usePupilLessonProgress(
    (state) => state.setRefreshReadOnly,
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
    if (!classroom.isReady) return;
    if (currentLessonSlug === browseData.lessonSlug) return;
    const initialiseKey = `${browseData.lessonSlug}:${availableSectionsKey}`;
    if (initialiseKeyRef.current === initialiseKey) return;
    initialiseKeyRef.current = initialiseKey;

    initialiseLessonProgress({
      lessonSlug: browseData.lessonSlug,
      lessonReviewSections: availableSections,
      initialSectionResults: classroom.initialSectionResults,
      isReadOnly: classroom.isReadOnly,
      isHydratingInitialProgress: false,
    });
  }, [
    availableSections,
    availableSectionsKey,
    browseData,
    currentLessonSlug,
    lessonContent,
    initialiseLessonProgress,
    classroom.isReady,
    classroom.initialSectionResults,
    classroom.isReadOnly,
  ]);

  useEffect(() => {
    if (!classroom.isReady) return;
    setReadOnly(classroom.isReadOnly);
  }, [classroom.isReady, classroom.isReadOnly, setReadOnly]);

  useEffect(() => {
    setRefreshReadOnly(classroom.refreshReadOnly);
  }, [classroom.refreshReadOnly, setRefreshReadOnly]);

  useEffect(() => {
    if (!browseData || !lessonContent || !pathwayData) return;
    if (!classroom.isReady) return;

    const classroomAssignmentContext: ClassroomAssignmentContext = {
      courseId: classroom.courseId,
      itemId: classroom.itemId,
      attachmentId: classroom.attachmentId,
      submissionId: classroom.submissionId,
      teacherLoginHint: classroom.teacherLoginHint,
      pupilLoginHint: classroom.pupilLoginHint,
      classroomAssignmentId: classroom.classroomAssignmentId,
      clientEnvironment: classroom.clientEnvironment,
    };

    const initialiseKey = `${browseData.lessonSlug}:${JSON.stringify(
      classroomAssignmentContext,
    )}`;
    if (analyticsInitialiseKeyRef.current === initialiseKey) return;
    analyticsInitialiseKeyRef.current = initialiseKey;

    initialisePupilLessonAnalytics({
      pupilPathwayData: pathwayData,
      classroomAssignmentContext,
      lessonContent,
    });
  }, [
    browseData,
    initialisePupilLessonAnalytics,
    lessonContent,
    pathwayData,
    classroom.isReady,
    classroom.courseId,
    classroom.itemId,
    classroom.attachmentId,
    classroom.submissionId,
    classroom.teacherLoginHint,
    classroom.pupilLoginHint,
    classroom.classroomAssignmentId,
    classroom.clientEnvironment,
  ]);

  useClassroomProgressSync({
    courseId: classroom.courseId,
    itemId: classroom.itemId,
    attachmentId: classroom.attachmentId,
    submissionId: classroom.submissionId,
    pupilLoginHint: classroom.pupilLoginHint,
    isReadOnly: classroom.isReadOnly,
    isReady: classroom.isReady,
  });
};

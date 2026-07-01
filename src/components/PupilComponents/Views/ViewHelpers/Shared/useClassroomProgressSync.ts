"use client";

import { useEffect } from "react";

import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import { mapToSubmitPupilProgress } from "@/browser-lib/google-classroom/mapToSubmitPupilProgress";
import type { ClassroomProgressContext } from "@/browser-lib/google-classroom/classroomAssignmentContext";
import {
  usePupilLessonProgress,
  type LessonSectionResults,
} from "@/context/PupilLessonProgress";

type ClassroomProgressSyncArgs = {
  courseId: string | null;
  itemId: string | null;
  attachmentId: string | null;
  submissionId: string | null;
  pupilLoginHint: string | null;
  isReadOnly: boolean;
  isReady: boolean;
};

/**
 * Used as the subscribe dependency to trigger updates on section completion.
 */
const completedSectionCount = (results: LessonSectionResults) =>
  Object.values(results).filter((value) => value?.isComplete).length;

/**
 * Writes pupil progress back to the Google Classroom assignment whenever a new
 * section is completed.
 */
export const useClassroomProgressSync = ({
  courseId,
  itemId,
  attachmentId,
  submissionId,
  pupilLoginHint,
  isReadOnly,
  isReady,
}: ClassroomProgressSyncArgs) => {
  useEffect(() => {
    if (!isReady || isReadOnly) return;
    if (
      !courseId ||
      !itemId ||
      !attachmentId ||
      !submissionId ||
      !pupilLoginHint
    ) {
      return;
    }

    const progressContext: ClassroomProgressContext = {
      courseId,
      itemId,
      attachmentId,
      submissionId,
      pupilLoginHint,
    };

    return usePupilLessonProgress.subscribe(
      (state) => completedSectionCount(state.sectionResults),
      () => {
        try {
          const payload = mapToSubmitPupilProgress(
            progressContext,
            usePupilLessonProgress.getState().sectionResults,
          );
          void googleClassroomApi.submitPupilProgress(payload).catch(() => {
            // Submission failed — progress sync failed, lesson continues for next sync.
          });
        } catch {
          // Payload could not be built (unexpected shape) — skip this submission.
        }
      },
    );
  }, [
    isReady,
    isReadOnly,
    courseId,
    itemId,
    attachmentId,
    submissionId,
    pupilLoginHint,
  ]);
};

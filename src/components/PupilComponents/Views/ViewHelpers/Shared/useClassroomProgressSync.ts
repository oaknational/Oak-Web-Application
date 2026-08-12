"use client";

import { useEffect } from "react";

import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import { mapToSubmitPupilProgress } from "@/browser-lib/google-classroom/mapToSubmitPupilProgress";
import type { ClassroomProgressContext } from "@/browser-lib/google-classroom/classroomAssignmentContext";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";

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
 * Writes pupil progress back to the Google Classroom assignment on every
 * section result change — i.e. after each quiz question, not only when a
 * section completes — so a pupil who closes the lesson part-way resumes where
 * they left off. No-op for non-Classroom pupils, before resolution, or when the
 * assignment is read-only.
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
      (state) => state.sectionResults,
      (sectionResults) => {
        try {
          const payload = mapToSubmitPupilProgress(
            progressContext,
            sectionResults,
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

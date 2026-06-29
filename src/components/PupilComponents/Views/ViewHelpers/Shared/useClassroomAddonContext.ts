"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PostSubmissionState } from "@oaknational/google-classroom-addon/types";

import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import { mapPupilLessonProgressToSectionResults } from "@/browser-lib/google-classroom/mapPupilLessonProgressToSectionResults";
import { useGoogleClassroomContext } from "@/components/GoogleClassroom/useGoogleClassroomContext";
import type { ClassroomAssignmentContext } from "@/browser-lib/google-classroom/classroomAssignmentContext";
import type { LessonSectionResults } from "@/context/PupilLessonProgress";

export type ResolvedClassroomAddonContext = ClassroomAssignmentContext & {
  initialSectionResults: LessonSectionResults;
  isReadOnly: boolean;
  isReady: boolean;
};

export const useClassroomAddonContext = (): ResolvedClassroomAddonContext => {
  const {
    isClassroomAssignment,
    classroomAssignmentChecked,
    courseId,
    itemId,
    attachmentId,
    clientEnvironment,
    classroomAssignmentId,
  } = useGoogleClassroomContext();

  const isGoogleClassroomAssignment =
    isClassroomAssignment === true && classroomAssignmentChecked;

  const resolvedRef = useRef(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [pupilLoginHint, setPupilLoginHint] = useState<string | null>(null);
  const [teacherLoginHint, setTeacherLoginHint] = useState<string | null>(null);
  const [initialSectionResults, setInitialSectionResults] =
    useState<LessonSectionResults>({});
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const refreshReadOnly = useCallback(
    async (args: {
      courseId: string;
      itemId: string;
      attachmentId: string;
      submissionId: string;
    }) => {
      const state = await googleClassroomApi.getPostSubmissionState(args);
      if (!state) return;
      setIsReadOnly(
        state.submissionState === PostSubmissionState.RETURNED ||
          state.submissionState === PostSubmissionState.TURNED_IN,
      );
    },
    [],
  );

  useEffect(() => {
    if (!classroomAssignmentChecked) return;
    if (!isGoogleClassroomAssignment) {
      setIsReady(true);
      return;
    }
    if (resolvedRef.current) return;
    if (!courseId || !itemId || !attachmentId) {
      setIsReady(true);
      return;
    }
    resolvedRef.current = true;

    const hydrate = async () => {
      try {
        const addonContext = await googleClassroomApi.getAddOnContext({
          courseId,
          itemId,
          attachmentId,
        });
        const resolvedSubmissionId =
          addonContext?.studentContext?.submissionId ?? null;
        setSubmissionId(resolvedSubmissionId);
        setPupilLoginHint(addonContext?.pupilLoginHint ?? null);
        setTeacherLoginHint(addonContext?.teacherLoginHint ?? null);

        if (resolvedSubmissionId) {
          const progress = await googleClassroomApi.getPupilLessonProgress({
            submissionId: resolvedSubmissionId,
            itemId,
            attachmentId,
          });
          if (progress) {
            setInitialSectionResults(
              mapPupilLessonProgressToSectionResults(progress),
            );
          }
          await refreshReadOnly({
            courseId,
            itemId,
            attachmentId,
            submissionId: resolvedSubmissionId,
          });
        }
      } catch {
        // Failed to resolve context — progress sync disabled, lesson still works.
      } finally {
        setIsReady(true);
      }
    };

    void hydrate();
  }, [
    classroomAssignmentChecked,
    isGoogleClassroomAssignment,
    courseId,
    itemId,
    attachmentId,
    refreshReadOnly,
  ]);

  // Re-check read-only when the pupil refocuses the tab (teacher may have returned the work in the meantime).
  useEffect(() => {
    if (
      !isGoogleClassroomAssignment ||
      !submissionId ||
      !courseId ||
      !itemId ||
      !attachmentId
    ) {
      return;
    }
    const onFocus = () => {
      void refreshReadOnly({ courseId, itemId, attachmentId, submissionId });
    };
    globalThis.window.addEventListener("focus", onFocus);
    return () => globalThis.window.removeEventListener("focus", onFocus);
  }, [
    isGoogleClassroomAssignment,
    submissionId,
    courseId,
    itemId,
    attachmentId,
    refreshReadOnly,
  ]);

  return {
    courseId,
    itemId,
    attachmentId,
    submissionId,
    pupilLoginHint,
    teacherLoginHint,
    classroomAssignmentId,
    clientEnvironment,
    initialSectionResults,
    isReadOnly,
    isReady,
  };
};

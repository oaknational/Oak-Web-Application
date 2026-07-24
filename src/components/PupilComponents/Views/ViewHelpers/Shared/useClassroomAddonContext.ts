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
  refreshReadOnly: () => Promise<boolean>;
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

  const contextKey =
    isGoogleClassroomAssignment && courseId && itemId && attachmentId
      ? JSON.stringify({ courseId, itemId, attachmentId })
      : null;
  const activeContextKeyRef = useRef(contextKey);
  activeContextKeyRef.current = contextKey;
  const resolvedContextKeyRef = useRef<string | null>(null);
  const hydrationGenerationRef = useRef(0);
  const submissionStateRequestRef = useRef<{
    key: string;
    request: Promise<boolean | null>;
  } | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [pupilLoginHint, setPupilLoginHint] = useState<string | null>(null);
  const [teacherLoginHint, setTeacherLoginHint] = useState<string | null>(null);
  const [initialSectionResults, setInitialSectionResults] =
    useState<LessonSectionResults>({});
  const [isReadOnly, setIsReadOnly] = useState(false);
  const isReadOnlyRef = useRef(isReadOnly);
  const [isReady, setIsReady] = useState(false);
  isReadOnlyRef.current = isReadOnly;

  const getReadOnlyState = useCallback(
    async (args: {
      courseId: string;
      itemId: string;
      attachmentId: string;
      submissionId: string;
    }): Promise<boolean | null> => {
      const key = JSON.stringify(args);
      if (submissionStateRequestRef.current?.key === key) {
        return submissionStateRequestRef.current.request;
      }

      const request = googleClassroomApi
        .getPostSubmissionState(args)
        .then((state) => {
          if (!state) return null;
          return (
            state.submissionState === PostSubmissionState.RETURNED ||
            state.submissionState === PostSubmissionState.TURNED_IN
          );
        });
      submissionStateRequestRef.current = { key, request };

      try {
        return await request;
      } finally {
        if (submissionStateRequestRef.current?.request === request) {
          submissionStateRequestRef.current = null;
        }
      }
    },
    [],
  );

  const refreshReadOnly = useCallback(async () => {
    if (!courseId || !itemId || !attachmentId || !submissionId) {
      return isReadOnlyRef.current;
    }

    const requestContextKey = contextKey;
    try {
      const nextIsReadOnly = await getReadOnlyState({
        courseId,
        itemId,
        attachmentId,
        submissionId,
      });
      if (activeContextKeyRef.current !== requestContextKey) {
        return isReadOnlyRef.current;
      }
      if (nextIsReadOnly === null) return isReadOnlyRef.current;
      setIsReadOnly(nextIsReadOnly);
      return nextIsReadOnly;
    } catch {
      return isReadOnlyRef.current;
    }
  }, [
    attachmentId,
    contextKey,
    courseId,
    getReadOnlyState,
    itemId,
    submissionId,
  ]);

  useEffect(() => {
    if (!classroomAssignmentChecked) {
      if (resolvedContextKeyRef.current !== null) {
        hydrationGenerationRef.current += 1;
        resolvedContextKeyRef.current = null;
        setSubmissionId(null);
        setPupilLoginHint(null);
        setTeacherLoginHint(null);
        setInitialSectionResults({});
        setIsReadOnly(false);
      }
      setIsReady(false);
      return;
    }

    if (!contextKey || !courseId || !itemId || !attachmentId) {
      if (resolvedContextKeyRef.current !== null) {
        hydrationGenerationRef.current += 1;
        resolvedContextKeyRef.current = null;
        setSubmissionId(null);
        setPupilLoginHint(null);
        setTeacherLoginHint(null);
        setInitialSectionResults({});
        setIsReadOnly(false);
      }
      setIsReady(true);
      return;
    }
    if (resolvedContextKeyRef.current === contextKey) return;

    resolvedContextKeyRef.current = contextKey;
    const hydrationGeneration = ++hydrationGenerationRef.current;
    setSubmissionId(null);
    setPupilLoginHint(null);
    setTeacherLoginHint(null);
    setInitialSectionResults({});
    setIsReadOnly(false);
    setIsReady(false);

    const isCurrentContext = () =>
      hydrationGenerationRef.current === hydrationGeneration &&
      activeContextKeyRef.current === contextKey;

    const hydrate = async () => {
      try {
        const addonContext = await googleClassroomApi.getAddOnContext({
          courseId,
          itemId,
          attachmentId,
        });
        if (!isCurrentContext()) return;

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
          if (!isCurrentContext()) return;
          if (progress) {
            setInitialSectionResults(
              mapPupilLessonProgressToSectionResults(progress),
            );
          }
          const nextIsReadOnly = await getReadOnlyState({
            courseId,
            itemId,
            attachmentId,
            submissionId: resolvedSubmissionId,
          });
          if (!isCurrentContext()) return;
          if (nextIsReadOnly !== null) {
            setIsReadOnly(nextIsReadOnly);
          }
        }
      } catch {
        // keep the lesson usable if progress context cannot be resolved
      } finally {
        if (isCurrentContext()) {
          setIsReady(true);
        }
      }
    };

    void hydrate();
  }, [
    classroomAssignmentChecked,
    isGoogleClassroomAssignment,
    courseId,
    itemId,
    attachmentId,
    contextKey,
    getReadOnlyState,
  ]);

  // recheck read-only when the tab regains focus
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
      void refreshReadOnly();
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
    refreshReadOnly,
    isReady,
  };
};

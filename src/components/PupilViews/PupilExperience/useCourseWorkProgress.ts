import { useCallback, useEffect, useRef, useState } from "react";

import {
  mapToSubmitCourseWorkProgress,
  type CourseWorkProgressContext,
} from "@/browser-lib/google-classroom/mapToSubmitCourseWorkProgress";
import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import type { LessonSectionResults } from "@/components/PupilComponents/LessonEngineProvider";

const mapSavedCourseWorkProgress = (
  savedProgress: Record<string, unknown>,
): LessonSectionResults => {
  const mapped: LessonSectionResults = {};
  if (savedProgress.starterQuiz)
    mapped["starter-quiz"] =
      savedProgress.starterQuiz as LessonSectionResults["starter-quiz"];
  if (savedProgress.exitQuiz)
    mapped["exit-quiz"] =
      savedProgress.exitQuiz as LessonSectionResults["exit-quiz"];
  if (savedProgress.video)
    mapped.video = savedProgress.video as LessonSectionResults["video"];
  if (savedProgress.intro)
    mapped.intro = savedProgress.intro as LessonSectionResults["intro"];
  return mapped;
};

type UseCourseWorkProgressArgs = {
  assignmentToken: string | null | undefined;
  isGoogleClassroomAssignment: boolean;
};

export function useCourseWorkProgress({
  assignmentToken,
  isGoogleClassroomAssignment,
}: UseCourseWorkProgressArgs) {
  const isCourseWorkFlow = Boolean(
    assignmentToken && !isGoogleClassroomAssignment,
  );

  const courseWorkContextRef = useRef<CourseWorkProgressContext | null>(null);
  const pendingCourseWorkSaveRef = useRef<LessonSectionResults | null>(null);
  const courseWorkSaveInFlightRef = useRef(false);

  const [isPupilSignInRequired, setIsPupilSignInRequired] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isContextReady, setIsContextReady] = useState(false);
  const [initialSectionResults, setInitialSectionResults] =
    useState<LessonSectionResults>();
  const [lessonEngineKey, setLessonEngineKey] = useState(0);

  const saveProgress = useCallback(
    async (sectionResults: LessonSectionResults) => {
      const cwCtx = courseWorkContextRef.current;
      if (!cwCtx) return;
      if (courseWorkSaveInFlightRef.current) {
        pendingCourseWorkSaveRef.current = sectionResults;
        return;
      }
      courseWorkSaveInFlightRef.current = true;
      try {
        const payload = mapToSubmitCourseWorkProgress(cwCtx, sectionResults);
        await googleClassroomApi.upsertCourseWorkProgress(payload);
      } catch (error) {
        console.error("Failed to save CourseWork progress:", error);
      } finally {
        courseWorkSaveInFlightRef.current = false;
        const pending = pendingCourseWorkSaveRef.current;
        if (pending) {
          pendingCourseWorkSaveRef.current = null;
          void saveProgress(pending);
        }
      }
    },
    [],
  );

  const saveOrQueueProgress = useCallback(
    async (sectionResults: LessonSectionResults) => {
      if (courseWorkContextRef.current) {
        await saveProgress(sectionResults);
      } else {
        pendingCourseWorkSaveRef.current = sectionResults;
      }
    },
    [saveProgress],
  );

  const hydrate = useCallback(async () => {
    if (!assignmentToken) return;
    setIsFetching(true);

    const session = await googleClassroomApi.verifySession(true)();
    if (!session.authenticated) {
      setIsPupilSignInRequired(true);
      setIsFetching(false);
      setIsContextReady(true);
      return;
    }

    try {
      const ctx =
        await googleClassroomApi.getCourseWorkContext(assignmentToken);

      if (!ctx?.submissionId || !session.loginHint) {
        setIsContextReady(true);
        return;
      }

      courseWorkContextRef.current = {
        submissionId: ctx.submissionId,
        assignmentToken,
        courseWorkId: ctx.courseWorkId,
        courseId: ctx.courseId,
        pupilLoginHint: session.loginHint,
      };

      const savedProgress = await googleClassroomApi.getCourseWorkProgress(
        ctx.submissionId,
        assignmentToken,
      );
      if (savedProgress) {
        const mapped = mapSavedCourseWorkProgress(
          savedProgress as Record<string, unknown>,
        );
        if (Object.keys(mapped).length > 0) {
          setInitialSectionResults(mapped);
          setLessonEngineKey((k) => k + 1);
        }
      }

      // Flush any progress that queued before context was ready (re-hydration
      // after sign-in — the isContextReady effect handles the initial load case).
      const pending = pendingCourseWorkSaveRef.current;
      if (pending) {
        pendingCourseWorkSaveRef.current = null;
        void saveProgress(pending);
      }
    } catch {
      // Failed to load context — lesson will render without progress tracking
    } finally {
      setIsFetching(false);
      setIsContextReady(true);
    }
  }, [assignmentToken, saveProgress]);

  useEffect(() => {
    if (!isCourseWorkFlow || !assignmentToken) return;
    if (courseWorkContextRef.current) return;
    void hydrate();
  }, [isCourseWorkFlow, assignmentToken, hydrate]);

  // Flush any progress that was queued before context was ready.
  useEffect(() => {
    if (!isContextReady || !courseWorkContextRef.current) return;
    const pending = pendingCourseWorkSaveRef.current;
    if (!pending) return;
    pendingCourseWorkSaveRef.current = null;
    void saveProgress(pending);
  }, [isContextReady, saveProgress]);

  const onSignInSuccess = useCallback(async () => {
    setIsPupilSignInRequired(false);
    await hydrate();
  }, [hydrate]);

  return {
    isCourseWorkFlow,
    isPupilSignInRequired,
    isFetching,
    isContextReady,
    initialSectionResults,
    lessonEngineKey,
    saveOrQueueProgress,
    onSignInSuccess,
  };
}

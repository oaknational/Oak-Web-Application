import { useCallback, useEffect, useState } from "react";

import {
  mapToSubmitCourseWorkProgress,
  type CourseWorkProgressContext,
} from "@/browser-lib/google-classroom/mapToSubmitCourseWorkProgress";
import { mapPupilLessonProgressToSectionResults } from "@/browser-lib/google-classroom/mapPupilLessonProgressToSectionResults";
import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import type { LessonSectionResults } from "@/components/PupilComponents/LessonEngineProvider";

export type CourseWorkProgressStatus =
  | "inactive"
  | "loading"
  | "sign_in_required"
  | "ready"
  | "error";

const COURSEWORK_LOAD_ERROR_MESSAGE =
  "We couldn't load your assignment progress. You can still view the lesson, but progress won't sync.";
const COURSEWORK_SAVE_ERROR_MESSAGE =
  "We couldn't save your assignment progress. Please try again.";
const COURSEWORK_NOT_READY_ERROR_MESSAGE =
  "Assignment progress isn't ready yet. Please try again.";
const COURSEWORK_PREVIEW_MESSAGE =
  "You're viewing this lesson in preview mode. Progress won't sync to Google Classroom.";

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

  const [status, setStatus] = useState<CourseWorkProgressStatus>(
    isCourseWorkFlow ? "loading" : "inactive",
  );
  const [context, setContext] = useState<CourseWorkProgressContext | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewMessage, setPreviewMessage] = useState<string | null>(null);
  const [initialSectionResults, setInitialSectionResults] =
    useState<LessonSectionResults>();
  const [lessonEngineKey, setLessonEngineKey] = useState(0);

  const hydrate = useCallback(async () => {
    if (!assignmentToken || !isCourseWorkFlow) {
      setStatus("inactive");
      setContext(null);
      setErrorMessage(null);
      setPreviewMessage(null);
      setInitialSectionResults(undefined);
      return;
    }

    setStatus("loading");
    setContext(null);
    setErrorMessage(null);
    setPreviewMessage(null);
    setInitialSectionResults(undefined);

    const session = await googleClassroomApi.verifySession(true)();
    if (!session.authenticated) {
      setStatus("sign_in_required");
      return;
    }

    try {
      const ctx =
        await googleClassroomApi.getCourseWorkContext(assignmentToken);
      if (!ctx?.submissionId || !session.loginHint) {
        // No submission for this user. If they have teacher cookies it's a
        // preview link — show an info banner. Otherwise degrade silently.
        setStatus("inactive");
        const isTeacher = await googleClassroomApi.hasTeacherCookies();
        if (isTeacher) {
          setPreviewMessage(COURSEWORK_PREVIEW_MESSAGE);
        }
        return;
      }

      const courseWorkContext = {
        submissionId: ctx.submissionId,
        assignmentToken,
        courseWorkId: ctx.courseWorkId,
        courseId: ctx.courseId,
        pupilLoginHint: session.loginHint,
      };
      setContext(courseWorkContext);

      const savedProgress = await googleClassroomApi.getCourseWorkProgress(
        ctx.submissionId,
        assignmentToken,
      );
      if (savedProgress) {
        const mapped = mapPupilLessonProgressToSectionResults(savedProgress);
        if (Object.keys(mapped).length > 0) {
          setInitialSectionResults(mapped);
          setLessonEngineKey((k) => k + 1);
        }
      }
      setStatus("ready");
    } catch {
      setContext(null);
      setStatus("error");
      setErrorMessage(COURSEWORK_LOAD_ERROR_MESSAGE);
    }
  }, [assignmentToken, isCourseWorkFlow]);

  useEffect(() => {
    if (!isCourseWorkFlow) {
      setStatus("inactive");
      setContext(null);
      setErrorMessage(null);
      setPreviewMessage(null);
      setInitialSectionResults(undefined);
      return;
    }
    void hydrate();
  }, [isCourseWorkFlow, assignmentToken, hydrate]);

  const saveProgress = useCallback(
    async (sectionResults: LessonSectionResults) => {
      if (status !== "ready" || !context) {
        setErrorMessage(COURSEWORK_NOT_READY_ERROR_MESSAGE);
        return false;
      }

      try {
        const payload = mapToSubmitCourseWorkProgress(context, sectionResults);
        await googleClassroomApi.upsertCourseWorkProgress(payload);
        setErrorMessage(null);
        return true;
      } catch {
        setErrorMessage(COURSEWORK_SAVE_ERROR_MESSAGE);
        return false;
      }
    },
    [context, status],
  );

  const onSignInSuccess = useCallback(async () => {
    await hydrate();
  }, [hydrate]);

  return {
    isCourseWorkFlow,
    status,
    errorMessage,
    previewMessage,
    isPupilSignInRequired: status === "sign_in_required",
    isFetching: status === "loading",
    isContextReady: status !== "loading",
    initialSectionResults,
    lessonEngineKey,
    saveProgress,
    onSignInSuccess,
  };
}

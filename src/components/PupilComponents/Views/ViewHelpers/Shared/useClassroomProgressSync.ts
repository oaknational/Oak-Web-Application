"use client";

import { useCallback, useEffect, useRef } from "react";

import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import type { SubmitPupilProgressResult } from "@/browser-lib/google-classroom/googleClassroomApi";
import { mapToSubmitPupilProgress } from "@/browser-lib/google-classroom/mapToSubmitPupilProgress";
import type { ClassroomProgressContext } from "@/browser-lib/google-classroom/classroomAssignmentContext";
import {
  LessonSectionResults,
  usePupilLessonProgress,
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

const noClassroomSubmission = async () => null;
const staleClassroomProgressError = new Error(
  "classroom progress context changed",
);

export const useClassroomProgressSync = ({
  courseId,
  itemId,
  attachmentId,
  submissionId,
  pupilLoginHint,
  isReadOnly,
  isReady,
}: ClassroomProgressSyncArgs) => {
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const generationRef = useRef(0);
  const inFlightRef = useRef(
    new Map<string, Promise<SubmitPupilProgressResult | null>>(),
  );
  const lastSuccessfulRef = useRef<{
    key: string;
    result: SubmitPupilProgressResult;
  } | null>(null);
  const readOnlyResultRef = useRef<SubmitPupilProgressResult | null>(null);

  const submitProgress = useCallback(
    (
      sectionResults: LessonSectionResults,
    ): Promise<SubmitPupilProgressResult | null> => {
      if (!isReady || isReadOnly) {
        return Promise.resolve(readOnlyResultRef.current);
      }
      if (
        !courseId ||
        !itemId ||
        !attachmentId ||
        !submissionId ||
        !pupilLoginHint
      ) {
        return Promise.resolve(null);
      }

      const progressContext: ClassroomProgressContext = {
        courseId,
        itemId,
        attachmentId,
        submissionId,
        pupilLoginHint,
      };
      const payload = mapToSubmitPupilProgress(progressContext, sectionResults);
      const key = JSON.stringify(payload);
      const lastSuccessful = lastSuccessfulRef.current;
      if (lastSuccessful?.key === key) {
        return Promise.resolve(lastSuccessful.result);
      }

      const inFlight = inFlightRef.current.get(key);
      if (inFlight) return inFlight;

      const generation = generationRef.current;
      const request = queueRef.current.then(async () => {
        if (generation !== generationRef.current) {
          throw staleClassroomProgressError;
        }
        if (readOnlyResultRef.current) return readOnlyResultRef.current;

        const result = await googleClassroomApi.submitPupilProgress(payload);
        if (generation !== generationRef.current) {
          throw staleClassroomProgressError;
        }

        lastSuccessfulRef.current = { key, result };
        if (result.status === "READ_ONLY") {
          readOnlyResultRef.current = result;
          usePupilLessonProgress.getState().setReadOnly(true);
        }
        return result;
      });
      queueRef.current = request.then(
        () => undefined,
        () => undefined,
      );
      inFlightRef.current.set(key, request);
      void request.then(
        () => {
          if (inFlightRef.current.get(key) === request) {
            inFlightRef.current.delete(key);
          }
        },
        () => {
          if (inFlightRef.current.get(key) === request) {
            inFlightRef.current.delete(key);
          }
        },
      );

      return request;
    },
    [
      attachmentId,
      courseId,
      isReadOnly,
      isReady,
      itemId,
      pupilLoginHint,
      submissionId,
    ],
  );

  useEffect(() => {
    generationRef.current += 1;
    queueRef.current = Promise.resolve();
    inFlightRef.current.clear();
    lastSuccessfulRef.current = null;
    readOnlyResultRef.current = null;

    usePupilLessonProgress
      .getState()
      .setSubmitClassroomProgress(submitProgress);

    return () => {
      generationRef.current += 1;
      if (
        usePupilLessonProgress.getState().submitClassroomProgress ===
        submitProgress
      ) {
        usePupilLessonProgress
          .getState()
          .setSubmitClassroomProgress(noClassroomSubmission);
      }
    };
  }, [submitProgress]);

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

    return usePupilLessonProgress.subscribe(
      (state) => state.sectionResults,
      (sectionResults) => {
        try {
          void submitProgress(sectionResults).catch(() => undefined);
        } catch {
          return;
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
    submitProgress,
  ]);
};

"use client";

import { useEffect } from "react";

import { AnalyticsUseCase } from "@/browser-lib/avo/Avo";
import { useGoogleClassroomAnalytics } from "@/components/GoogleClassroom/useGoogleClassroomAnalytics";
import { useGoogleClassroomContext } from "@/components/GoogleClassroom/useGoogleClassroomContext";

/**
 * Fires the pupil `classroomAddOnOpened` event once when a lesson is opened as a
 * Google Classroom assignment, and clears the once-per-open flag on page hide so
 * a subsequent open re-tracks. Restores the behaviour of the removed
 * `PupilExperience` classroom analytics.
 *
 * Must be rendered inside `GoogleClassroomAnalyticsProvider`. Renders nothing.
 */
export const PupilClassroomAddOnAnalytics = () => {
  const { isClassroomAssignment, classroomAssignmentChecked } =
    useGoogleClassroomContext();
  const isGoogleClassroomAssignment =
    isClassroomAssignment === true && classroomAssignmentChecked === true;

  const trackAddOnOpenedOnce = useGoogleClassroomAnalytics(
    (state) => state.trackAddOnOpenedOnce,
  );
  const clearAddOnOpenedFlag = useGoogleClassroomAnalytics(
    (state) => state.clearAddOnOpenedFlag,
  );

  useEffect(() => {
    globalThis.window.addEventListener("pagehide", clearAddOnOpenedFlag);
    return () =>
      globalThis.window.removeEventListener("pagehide", clearAddOnOpenedFlag);
  }, [clearAddOnOpenedFlag]);

  useEffect(() => {
    if (!isGoogleClassroomAssignment) return;

    trackAddOnOpenedOnce({
      analyticsUseCase: AnalyticsUseCase.PUPIL,
    });
  }, [isGoogleClassroomAssignment, trackAddOnOpenedOnce]);

  return null;
};

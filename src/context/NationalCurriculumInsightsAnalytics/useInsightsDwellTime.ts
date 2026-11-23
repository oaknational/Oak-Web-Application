"use client";

import { useCallback, useEffect, useRef } from "react";

export const INSIGHTS_DWELL_THRESHOLD_SECONDS = 240;
export const INSIGHTS_SHOW_SURVEY_THRESHOLD_SECONDS = 180;

/** Reports cumulative visible time; consumers should not sum snapshots per visit. */
export function useInsightsDwellTime(
  onRecord: (seconds: number) => void,
  onThresholdReached?: (seconds: number) => void,
) {
  const onRecordRef = useRef(onRecord);
  const onThresholdReachedRef = useRef(onThresholdReached);
  const thresholdEnabled = Boolean(onThresholdReached);
  const measurement = useRef({
    totalMs: 0,
    lastReportedMs: 0,
    visibleSince: null as number | null,
    thresholdReached: false,
    surveyThresholdReached: false,
  });

  const getElapsedSeconds = useCallback(() => {
    const state = measurement.current;
    return (
      (state.totalMs +
        (state.visibleSince === null
          ? 0
          : Math.max(0, performance.now() - state.visibleSince))) /
      1000
    );
  }, []);

  useEffect(() => {
    onRecordRef.current = onRecord;
    onThresholdReachedRef.current = onThresholdReached;
  }, [onRecord, onThresholdReached]);

  useEffect(() => {
    const state = measurement.current;
    let thresholdTimer: ReturnType<typeof setTimeout> | undefined;
    let surveyTimer: ReturnType<typeof setTimeout> | undefined;

    const clearThresholdTimer = () => {
      clearTimeout(thresholdTimer);
      thresholdTimer = undefined;
    };

    const clearSurveyTimer = () => {
      clearTimeout(surveyTimer);
      surveyTimer = undefined;
    };

    const elapsedMs = () =>
      state.totalMs +
      (state.visibleSince === null
        ? 0
        : Math.max(0, performance.now() - state.visibleSince));

    const checkThreshold = () => {
      const elapsed = elapsedMs();
      if (
        !thresholdEnabled ||
        state.thresholdReached ||
        elapsed < INSIGHTS_DWELL_THRESHOLD_SECONDS * 1000
      )
        return;
      state.thresholdReached = true;
      clearThresholdTimer();
      onThresholdReachedRef.current?.(elapsed / 1000);
    };

    const checkSurveyThreshold = () => {
      const elapsed = elapsedMs();
      if (
        state.surveyThresholdReached ||
        elapsed < INSIGHTS_SHOW_SURVEY_THRESHOLD_SECONDS * 1000
      )
        return;
      state.surveyThresholdReached = true;
      clearSurveyTimer();
      state.lastReportedMs = elapsed;
      onRecordRef.current(elapsed / 1000);
    };

    const scheduleThreshold = () => {
      if (
        !thresholdEnabled ||
        state.thresholdReached ||
        state.visibleSince === null
      )
        return;
      clearThresholdTimer();
      const remaining = INSIGHTS_DWELL_THRESHOLD_SECONDS * 1000 - elapsedMs();
      if (remaining <= 0) {
        checkThreshold();
        return;
      }
      thresholdTimer = setTimeout(() => {
        thresholdTimer = undefined;
        checkThreshold();
        // Recheck the remaining time if the browser invokes the timer early.
        if (!state.thresholdReached) scheduleThreshold();
      }, remaining);
    };

    const scheduleSurvey = () => {
      if (state.surveyThresholdReached || state.visibleSince === null) return;
      clearSurveyTimer();
      const remaining =
        INSIGHTS_SHOW_SURVEY_THRESHOLD_SECONDS * 1000 - elapsedMs();
      if (remaining <= 0) {
        checkSurveyThreshold();
        return;
      }
      surveyTimer = setTimeout(() => {
        surveyTimer = undefined;
        checkSurveyThreshold();
        // Recheck the remaining time if the browser invokes the timer early.
        if (!state.surveyThresholdReached) scheduleSurvey();
      }, remaining);
    };

    const resume = () => {
      if (
        document.visibilityState === "visible" &&
        state.visibleSince === null
      ) {
        state.visibleSince = performance.now();
        scheduleThreshold();
        scheduleSurvey();
      }
    };

    const record = () => {
      clearThresholdTimer();
      clearSurveyTimer();
      if (state.visibleSince !== null) {
        state.totalMs += Math.max(0, performance.now() - state.visibleSince);
        state.visibleSince = null;
      }
      checkThreshold();
      checkSurveyThreshold();
      if (state.totalMs <= state.lastReportedMs) return;
      state.lastReportedMs = state.totalMs;
      onRecordRef.current(state.totalMs / 1000);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") resume();
      else record();
    };

    resume();
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", record);
    window.addEventListener("pageshow", resume);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", record);
      window.removeEventListener("pageshow", resume);
      record();
    };
  }, [thresholdEnabled]);

  return getElapsedSeconds;
}

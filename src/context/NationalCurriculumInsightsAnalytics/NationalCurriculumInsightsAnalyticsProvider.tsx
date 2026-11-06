"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { nanoid } from "nanoid";

import { getDownloadAnalyticsProperties } from "./getDownloadAnalyticsProperties";
import { type InsightsCtaProperties } from "./ctaTracking";
import {
  INSIGHTS_DWELL_THRESHOLD_SECONDS,
  useInsightsDwellTime,
} from "./useInsightsDwellTime";

import type { NCInsightsDownloadCompletedProperties } from "@/browser-lib/avo/Avo";
import {
  AnalyticsUseCase,
  EngagementIntent,
  EventVersion,
  MeasurementType,
  Platform,
  Product,
  ScrollMeasurementType,
} from "@/browser-lib/avo/Avo";
import useAnalytics from "@/context/Analytics/useAnalytics";

export type NationalCurriculumInsightsAnalyticsPage = Pick<
  NCInsightsDownloadCompletedProperties,
  | "subjectTitle"
  | "subjectSlug"
  | "phase"
  | "keyStageTitle"
  | "keyStageSlug"
  | "pageName"
  | "pageType"
>;

type NationalCurriculumInsightsAnalytics = {
  trackCtaClicked: (properties: InsightsCtaProperties) => void;
  trackScrolledTo: (sectionId: string) => void;
  trackDownloadCompleted: (
    properties: ReturnType<typeof getDownloadAnalyticsProperties>,
  ) => void;
};

export const nationalCurriculumInsightsAnalyticsContext =
  createContext<NationalCurriculumInsightsAnalytics | null>(null);

export function NationalCurriculumInsightsAnalyticsProvider({
  children,
  page,
}: {
  children: ReactNode;
  page: NationalCurriculumInsightsAnalyticsPage;
}) {
  const { track } = useAnalytics();
  const trackedMarkers = useRef(new Set<string>());
  const pageVisitId = useRef<string | null>(null);
  const completedAttempts = useRef(new Set<string>());
  const engagementTracked = useRef(false);
  const getPageVisitId = useCallback(() => {
    pageVisitId.current ??= nanoid(21);
    return pageVisitId.current;
  }, []);

  const trackCtaClicked = useCallback(
    (properties: InsightsCtaProperties) => {
      track.ncInsightsCtaClicked({
        ...page,
        ...properties,
        pageVisitId: getPageVisitId(),
        platform: Platform.OWA,
        product: Product.CURRICULUM_RESOURCES,
        engagementIntent: EngagementIntent.EXPLORE,
        eventVersion: EventVersion["2_0_0"],
        analyticsUseCase: AnalyticsUseCase.TEACHER,
      });
    },
    [getPageVisitId, page, track],
  );

  const trackEngagementCriteriaMet = useCallback(
    (timeElapsedSeconds: number) => {
      if (
        engagementTracked.current ||
        !trackedMarkers.current.has("teacher-checklist") ||
        timeElapsedSeconds < INSIGHTS_DWELL_THRESHOLD_SECONDS
      )
        return;
      const { subjectTitle, subjectSlug, phase, keyStageTitle, keyStageSlug } =
        page;
      // The engagement event currently requires key-stage page context in Avo.
      if (
        !subjectTitle ||
        !subjectSlug ||
        !phase ||
        !keyStageTitle ||
        !keyStageSlug
      )
        return;
      engagementTracked.current = true;
      track.ncInsightsEngagementCriteriaMet({
        ...page,
        subjectTitle,
        subjectSlug,
        phase,
        keyStageTitle,
        keyStageSlug,
        scrollMeasurementType: ScrollMeasurementType.SECTION_VISIBILITY,
        scrollThresholdPercent: null,
        dwellThresholdSeconds: INSIGHTS_DWELL_THRESHOLD_SECONDS,
        timeElapsedSeconds,
        pageVisitId: getPageVisitId(),
        platform: Platform.OWA,
        product: Product.CURRICULUM_RESOURCES,
        engagementIntent: EngagementIntent.EXPLORE,
        eventVersion: EventVersion["2_0_0"],
        analyticsUseCase: AnalyticsUseCase.TEACHER,
      });
    },
    [getPageVisitId, page, track],
  );

  const trackDownloadCompleted = useCallback(
    (properties: ReturnType<typeof getDownloadAnalyticsProperties>) => {
      if (completedAttempts.current.has(properties.downloadAttemptId)) return;
      completedAttempts.current.add(properties.downloadAttemptId);
      track.ncInsightsDownloadCompleted({
        ...page,
        ...properties,
        pageVisitId: getPageVisitId(),
        platform: Platform.OWA,
        product: Product.CURRICULUM_RESOURCES,
        engagementIntent: EngagementIntent.USE,
        componentType: "download_button",
        eventVersion: EventVersion["2_0_0"],
        analyticsUseCase: AnalyticsUseCase.TEACHER,
      });
    },
    [getPageVisitId, page, track],
  );

  const trackDwellTimeRecorded = useCallback(
    (timeElapsedSeconds: number) => {
      const { subjectTitle, subjectSlug, phase, keyStageTitle, keyStageSlug } =
        page;
      track.ncInsightsDwellTimeRecorded({
        ...page,
        subjectTitle,
        subjectSlug,
        phase,
        keyStageTitle,
        keyStageSlug,
        timeElapsedSeconds,
        measurementType: MeasurementType.VISIBLE_PAGE_TIME,
        pageVisitId: getPageVisitId(),
        platform: Platform.OWA,
        product: Product.CURRICULUM_RESOURCES,
        engagementIntent: EngagementIntent.EXPLORE,
        eventVersion: EventVersion["2_0_0"],
        analyticsUseCase: AnalyticsUseCase.TEACHER,
      });
    },
    [getPageVisitId, page, track],
  );

  const trackDwellThresholdReached = useCallback(
    (timeElapsedSeconds: number) => {
      const { subjectTitle, subjectSlug, phase, keyStageTitle, keyStageSlug } =
        page;
      // The threshold event's current Avo schema requires key-stage context.
      if (
        !subjectTitle ||
        !subjectSlug ||
        !phase ||
        !keyStageTitle ||
        !keyStageSlug
      )
        return;
      track.ncInsightsDwellThresholdReached({
        ...page,
        subjectTitle,
        subjectSlug,
        phase,
        keyStageTitle,
        keyStageSlug,
        dwellThresholdSeconds: INSIGHTS_DWELL_THRESHOLD_SECONDS,
        timeElapsedSeconds,
        measurementType: MeasurementType.VISIBLE_PAGE_TIME,
        pageVisitId: getPageVisitId(),
        platform: Platform.OWA,
        product: Product.CURRICULUM_RESOURCES,
        engagementIntent: EngagementIntent.EXPLORE,
        eventVersion: EventVersion["2_0_0"],
        analyticsUseCase: AnalyticsUseCase.TEACHER,
      });
      trackEngagementCriteriaMet(timeElapsedSeconds);
    },
    [getPageVisitId, page, track, trackEngagementCriteriaMet],
  );

  const getDwellTimeSeconds = useInsightsDwellTime(
    trackDwellTimeRecorded,
    trackDwellThresholdReached,
  );

  const trackScrolledTo = useCallback(
    (sectionId: string) => {
      const { subjectTitle, subjectSlug, phase, keyStageTitle, keyStageSlug } =
        page;
      // The scroll milestone remains limited to key-stage pages.
      if (
        !subjectTitle ||
        !subjectSlug ||
        !phase ||
        !keyStageTitle ||
        !keyStageSlug
      )
        return;
      if (trackedMarkers.current.has(sectionId)) return;
      trackedMarkers.current.add(sectionId);
      track.ncInsightsScrollMilestoneReached({
        ...page,
        subjectTitle,
        subjectSlug,
        phase,
        keyStageTitle,
        keyStageSlug,
        sectionId,
        measurementType: "section_visibility",
        pageVisitId: getPageVisitId(),
        platform: Platform.OWA,
        product: Product.CURRICULUM_RESOURCES,
        engagementIntent: EngagementIntent.EXPLORE,
        eventVersion: EventVersion["2_0_0"],
        analyticsUseCase: AnalyticsUseCase.TEACHER,
      });
      trackEngagementCriteriaMet(getDwellTimeSeconds());
    },
    [
      getDwellTimeSeconds,
      getPageVisitId,
      page,
      track,
      trackEngagementCriteriaMet,
    ],
  );

  const value = useMemo(
    () => ({ trackScrolledTo, trackDownloadCompleted, trackCtaClicked }),
    [trackScrolledTo, trackDownloadCompleted, trackCtaClicked],
  );

  return (
    <nationalCurriculumInsightsAnalyticsContext.Provider value={value}>
      {children}
    </nationalCurriculumInsightsAnalyticsContext.Provider>
  );
}

"use client";

import { createContext, useContext, type ContextType } from "react";

import { nationalCurriculumInsightsAnalyticsContext } from "./NationalCurriculumInsightsAnalyticsProvider";

export const insightsCtaSectionContext = createContext<{
  sectionType: string;
  sectionId?: string;
} | null>(null);

const previewAnalytics: NonNullable<
  ContextType<typeof nationalCurriculumInsightsAnalyticsContext>
> = {
  trackScrolledTo: () => undefined,
  trackDownloadCompleted: () => undefined,
  trackCtaClicked: () => undefined,
};

export function useNationalCurriculumInsightsAnalytics() {
  const analytics = useContext(nationalCurriculumInsightsAnalyticsContext);
  const section = useContext(insightsCtaSectionContext);
  if (!analytics && process.env.STORYBOOK)
    return { ...previewAnalytics, section };
  if (!analytics) {
    throw new Error(
      "useNationalCurriculumInsightsAnalytics must be used within NationalCurriculumInsightsAnalyticsProvider",
    );
  }
  return { ...analytics, section };
}

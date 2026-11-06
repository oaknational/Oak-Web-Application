"use client";

import { useFeatureFlagEnabled } from "posthog-js/react";
import { notFound } from "next/navigation";

import { ShortReadsView } from "./Components/ShortReadsView";

import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

const ShortReadsPage = () => {
  const featureFlagEnabled =
    useFeatureFlagEnabled("teachers-thinking-behind-oak-lessons") ?? false;
  if (!featureFlagEnabled) return notFound();

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="teach_with_oak"
    >
      <ShortReadsView />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

export default ShortReadsPage;

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { TeachWithOakDownloadSuccessView } from "./components/TeachWithOakDownloadSuccessView";

import withPageErrorHandling from "@/hocs/withPageErrorHandling";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getFeatureFlagValue } from "@/utils/featureFlags";
import { cacheData } from "@/node-lib/cache";
import { fetchSubjectPhasePickerData } from "@/pages-helpers/curriculum/docx/tab-helpers";

export const metadata: Metadata = {
  title: "",
  description: "",
  robots: {
    index: false,
    follow: false,
  },
};

const cachedCurriculumPhaseOptions = cache(
  cacheData(async () => {
    return fetchSubjectPhasePickerData();
  }, ["teach-with-oak-download-success"]),
);

const InnerTeachWithOakDownloadSuccessPage = async () => {
  const isEnabled = await getFeatureFlagValue(
    "teachers-teach-with-oak",
    "string",
  );

  if (!isEnabled) {
    return notFound();
  }

  const curriculumPhaseOptions = await cachedCurriculumPhaseOptions();

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="teach_with_oak"
    >
      <TeachWithOakDownloadSuccessView
        curriculumPhaseOptions={curriculumPhaseOptions}
      />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

const TeachWithOakDownloadSuccessPage = withPageErrorHandling(
  InnerTeachWithOakDownloadSuccessPage,
  "teach-with-oak-download-success::app",
);

export default TeachWithOakDownloadSuccessPage;

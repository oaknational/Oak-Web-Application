import { Metadata } from "next";
import { notFound } from "next/navigation";
import { OakFlex } from "@oaknational/oak-components";

import withPageErrorHandling from "@/hocs/withPageErrorHandling";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getFeatureFlagValue } from "@/utils/featureFlags";

export const metadata: Metadata = {
  title: "",
  description: "",
  robots: {
    index: false,
    follow: false,
  },
};

const InnerTeachWithOakDownloadPage = async () => {
  const isEnabled = await getFeatureFlagValue(
    "teachers-teach-with-oak",
    "string",
  );

  if (!isEnabled) {
    return notFound();
  }

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="teach_with_oak"
    >
      <OakFlex />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

const TeachWithOakDownloadPage = withPageErrorHandling(
  InnerTeachWithOakDownloadPage,
  "teach-with-oak::app",
);

export default TeachWithOakDownloadPage;

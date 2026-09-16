import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { TeachWithOakDownloadView } from "./TeachWithOakDownloadView";

import withPageErrorHandling from "@/hocs/withPageErrorHandling";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getFeatureFlagValue } from "@/utils/featureFlags";
import { getTeachWithOakDownloadFileExistence } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence";
import { cacheData } from "@/node-lib/cache";

export const metadata: Metadata = {
  title: "",
  description: "",
  robots: {
    index: false,
    follow: false,
  },
};

const cachedFileExistence = cache(
  cacheData(async () => {
    return getTeachWithOakDownloadFileExistence();
  }, ["teach-with-oak"]),
);

const InnerTeachWithOakDownloadPage = async () => {
  const isEnabled = await getFeatureFlagValue(
    "teachers-teach-with-oak",
    "string",
  );

  if (!isEnabled) {
    return notFound();
  }

  const data = await cachedFileExistence();

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="teach_with_oak"
    >
      <TeachWithOakDownloadView resources={data.resources} />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

const TeachWithOakDownloadPage = withPageErrorHandling(
  InnerTeachWithOakDownloadPage,
  "teach-with-oak::app",
);

export default TeachWithOakDownloadPage;

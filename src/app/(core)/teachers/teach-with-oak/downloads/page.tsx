import { Metadata } from "next";
import { cache } from "react";
import { cacheLife, cacheTag } from "next/cache";

import { parseReturnToLessonParams } from "../parseReturnToLessonParams";

import { TeachWithOakDownloadView } from "./components/TeachWithOakDownloadView";

import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getTeachWithOakDownloadFileExistence } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence";

// We use search params on the page so instant nav is not supported
export const instant = false;

export const metadata: Metadata = {
  title: "",
  description: "",
  robots: {
    index: false,
    follow: false,
  },
};

const cachedFileExistence = cache(async () => {
  "use cache";
  cacheLife("curriculum");
  cacheTag("teach-with-oak-download");

  return getTeachWithOakDownloadFileExistence();
});

const InnerTeachWithOakDownloadPage = async ({
  searchParams,
}: AppPageProps<Record<string, string>>) => {
  const data = await cachedFileExistence();
  const returnToLessonProps = parseReturnToLessonParams(
    (await searchParams) ?? {},
  );

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="teach_with_oak"
    >
      <TeachWithOakDownloadView
        resources={data.resources}
        returnToLessonProps={returnToLessonProps}
      />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

const TeachWithOakDownloadPage = withPageErrorHandling(
  InnerTeachWithOakDownloadPage,
  "teach-with-oak::app",
);

export default TeachWithOakDownloadPage;

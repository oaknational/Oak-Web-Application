import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { parseReturnToLessonParams } from "../../getReturnToLessonLink";

import { TeachWithOakDownloadSuccessView } from "./components/TeachWithOakDownloadSuccessView";

import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getFeatureFlagValue } from "@/utils/featureFlags";
import { cacheData } from "@/node-lib/cache";
import { filterValidCurriculumPhaseOptions } from "@/pages-helpers/curriculum/docx/tab-helpers";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

export const metadata: Metadata = {
  title: "",
  description: "",
  robots: {
    index: false,
    follow: false,
  },
};

const cachedCurriculumPhaseOptions = cache(
  cacheData(
    async () => curriculumApi2023.curriculumPhaseOptions(),
    ["teach-with-oak-download-success", "curriculum-phase-options"],
  ),
);

const InnerTeachWithOakDownloadSuccessPage = async ({
  searchParams,
}: AppPageProps<Record<string, string>>) => {
  const isEnabled = await getFeatureFlagValue(
    "teachers-teach-with-oak",
    "string",
  );

  if (!isEnabled) {
    return notFound();
  }

  // The picker is only rendered when the user has no lesson to return to
  const returnToLessonProps = parseReturnToLessonParams(
    (await searchParams) ?? {},
  );
  const curriculumPhaseOptions = returnToLessonProps
    ? null
    : {
        subjects: filterValidCurriculumPhaseOptions(
          await cachedCurriculumPhaseOptions(),
        ),
        tab: "units" as const,
      };

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

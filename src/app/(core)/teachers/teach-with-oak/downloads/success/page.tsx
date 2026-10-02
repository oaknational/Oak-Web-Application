import { Metadata } from "next";
import { cache } from "react";

import { parseReturnToLessonParams } from "../../parseReturnToLessonParams";

import { TeachWithOakDownloadSuccessView } from "./components/TeachWithOakDownloadSuccessView";

import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { applyCachePolicy } from "@/node-lib/cache";
import { filterValidCurriculumPhaseOptions } from "@/pages-helpers/curriculum/docx/tab-helpers";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

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

const cachedCurriculumPhaseOptions = cache(async () => {
  "use cache";
  applyCachePolicy();

  return curriculumApi2023.curriculumPhaseOptions();
});

const InnerTeachWithOakDownloadSuccessPage = async ({
  searchParams,
}: AppPageProps<Record<string, string>>) => {
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

import { Metadata } from "next";
import { cache } from "react";

import { Breadcrumbs } from "../../Components/Breadcrumbs/Breadcrumbs";

import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import { LessonDownloads } from "@/components/TeacherViews/LessonDownloads.view";
import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import { resolveOakHref } from "@/common-lib/urls";
import { getTeacherSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import { curriculumApiWithCache } from "@/node-lib/cache";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getProgrammeStateForLesson } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";

// We are using dynamic route segments so we can't enable instant navigation without
// prefetching all possible routes with generateStaticParams. Longer term we'd want to
// use Suspense boundaries to enable instant loading with data streaming
export const instant = false;

type LessonDownloadsPageParams = {
  slug: string;
  unitSlug: string;
  lessonSlug: string;
};

const getCachedLessonDownloadsData = cache(
  async (programmeSlug: string, unitSlug: string, lessonSlug: string) => {
    return curriculumApiWithCache({
      queryKey: "lessonDownloads",
      args: [{ programmeSlug, unitSlug, lessonSlug }],
    });
  },
);

export async function generateMetadata(
  props: AppPageProps<LessonDownloadsPageParams>,
): Promise<Metadata> {
  const { slug: programmeSlug, unitSlug, lessonSlug } = await props.params;

  try {
    const data = await getCachedLessonDownloadsData(
      programmeSlug,
      unitSlug,
      lessonSlug,
    );
    const title = `Lesson Download: ${data.lessonTitle} | ${data.keyStageSlug.toUpperCase()} ${data.subjectTitle}`;
    const description =
      "Select and download free lesson resources, including slide decks, worksheets and quizzes";

    return {
      title,
      description,
      robots: {
        index: false,
        follow: false,
      },
      openGraph: getOpenGraphMetadata({ title, description }),
      twitter: getTwitterMetadata({ title, description }),
    };
  } catch {
    return {};
  }
}

const InnerLessonDownloadsPage = async (
  props: AppPageProps<LessonDownloadsPageParams>,
) => {
  const { slug: programmeSlug, unitSlug, lessonSlug } = await props.params;
  const data = await getCachedLessonDownloadsData(
    programmeSlug,
    unitSlug,
    lessonSlug,
  );
  const breadcrumbsSubjectPhaseSlug = getTeacherSubjectPhaseSlug({
    subjectSlug: data.subjectSlug,
    phaseSlug: data.phaseSlug,
    subjectParentTitle: data.subjectParent,
    examboardSlug: data.examBoardSlug,
    pathwaySlug: data.pathwaySlug,
  });

  return (
    <TeacherBrowseAnalyticsStoreProvider
      accessLevel="lesson"
      programmeState={getProgrammeStateForLesson(data)}
    >
      <LessonDownloads
        lesson={data}
        breadcrumbsSlot={
          <Breadcrumbs
            key="lesson-downloads-breadcrumbs"
            subjectPhaseSlug={breadcrumbsSubjectPhaseSlug}
            mode="downloads"
          />
        }
        successRedirect={resolveOakHref({
          page: "lesson-downloads-success",
          programmeSlug,
          unitSlug,
          lessonSlug,
        })}
      />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

const LessonDownloadsPage = withPageErrorHandling(
  InnerLessonDownloadsPage,
  "lesson-downloads-page::app",
);

export default LessonDownloadsPage;

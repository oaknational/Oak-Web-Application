import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { Breadcrumbs } from "../../Components/Breadcrumbs/Breadcrumbs";

import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import { LessonShare } from "@/components/TeacherViews/LessonShare/LessonShare.view";
import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { getTeacherSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getProgrammeStateForLesson } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";
import { applyCachePolicy } from "@/node-lib/cache";

// We are using dynamic route segments so we can't enable instant navigation without
// prefetching all possible routes with generateStaticParams. Longer term we'd want to
// use Suspense boundaries to enable instant loading with data streaming
export const instant = false;

type LessonSharePageParams = {
  slug: string;
  unitSlug: string;
  lessonSlug: string;
};

const getCachedLessonShareData = cache(
  async (programmeSlug: string, unitSlug: string, lessonSlug: string) => {
    "use cache";
    applyCachePolicy();

    return curriculumApi2023.lessonShare({
      programmeSlug,
      unitSlug,
      lessonSlug,
    });
  },
);

export async function generateMetadata(
  props: AppPageProps<LessonSharePageParams>,
): Promise<Metadata> {
  const { slug, unitSlug, lessonSlug } = await props.params;

  try {
    const data = await getCachedLessonShareData(slug, unitSlug, lessonSlug);
    const title = `Lesson Share: ${data.lessonTitle} | ${data.keyStageSlug.toUpperCase()} ${data.subjectTitle}`;
    const description =
      "Share online lesson activities with your students, such as videos, worksheets and quizzes.";

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

const InnerLessonSharePage = async (
  props: AppPageProps<LessonSharePageParams>,
) => {
  const { slug: programmeSlug, unitSlug, lessonSlug } = await props.params;

  const data = await getCachedLessonShareData(
    programmeSlug,
    unitSlug,
    lessonSlug,
  );

  if (data.georestricted || data.loginRequired) {
    return notFound();
  }

  const breadcrumbsSubjectPhaseSlug = getTeacherSubjectPhaseSlug({
    subjectSlug: data.subjectSlug,
    phaseSlug: data.phaseSlug,
    subjectParentTitle: data.subjectParent,
    examboardSlug: data.examBoardSlug,
    pathwaySlug: data.pathwaySlug,
  });

  const programmeState = getProgrammeStateForLesson(data);

  return (
    <TeacherBrowseAnalyticsStoreProvider
      accessLevel="lesson"
      programmeState={programmeState}
    >
      <LessonShare
        lesson={data}
        breadcrumbsSlot={
          <Breadcrumbs
            key="lesson-share-breadcrumbs"
            subjectPhaseSlug={breadcrumbsSubjectPhaseSlug}
            mode="share"
          />
        }
      />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

const LessonSharePage = withPageErrorHandling(
  InnerLessonSharePage,
  "lesson-share-page::app",
);

export default LessonSharePage;

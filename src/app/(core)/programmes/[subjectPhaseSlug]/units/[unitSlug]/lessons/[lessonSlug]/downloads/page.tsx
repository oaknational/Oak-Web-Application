import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { Breadcrumbs } from "../../Components/Breadcrumbs/Breadcrumbs";

import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import { LessonDownloads } from "@/components/TeacherViews/LessonDownloads.view";
import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { getTeacherSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import { getFeatureFlagValue } from "@/utils/featureFlags";

type LessonDownloadsPageParams = {
  subjectPhaseSlug: string;
  unitSlug: string;
  lessonSlug: string;
};

const getCachedLessonDownloadsData = cache(
  async (
    programmeSlug: string,
    unitSlug: string,
    lessonSlug: string,
  ): Promise<LessonDownloadsPageData> => {
    return curriculumApi2023.lessonDownloads({
      programmeSlug,
      unitSlug,
      lessonSlug,
    });
  },
);

export async function generateMetadata(
  props: AppPageProps<LessonDownloadsPageParams>,
): Promise<Metadata> {
  const { subjectPhaseSlug, unitSlug, lessonSlug } = await props.params;

  try {
    const data = await getCachedLessonDownloadsData(
      subjectPhaseSlug,
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
  const isEnabled = await getFeatureFlagValue(
    "teachers-integrated-journey",
    "boolean",
  );

  if (!isEnabled) {
    return notFound();
  }

  const {
    subjectPhaseSlug: programmeSlug,
    unitSlug,
    lessonSlug,
  } = await props.params;
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
    <LessonDownloads
      lesson={data}
      breadcrumbsSlot={
        <Breadcrumbs
          key="lesson-downloads-breadcrumbs"
          data={data}
          subjectPhaseSlug={breadcrumbsSubjectPhaseSlug}
          mode="downloads"
        />
      }
    />
  );
};

const LessonDownloadsPage = withPageErrorHandling(
  InnerLessonDownloadsPage,
  "lesson-downloads-page::app",
);

export default LessonDownloadsPage;

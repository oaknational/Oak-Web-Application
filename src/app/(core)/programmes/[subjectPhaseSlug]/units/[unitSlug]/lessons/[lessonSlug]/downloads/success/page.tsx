import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { DownloadSuccessView } from "./Components/DownloadSuccessView";

import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

type LessonDownloadsSuccessPageParams = {
  subjectPhaseSlug: string;
  unitSlug: string;
  lessonSlug: string;
};

const getCachedSuccessData = cache(
  async (subjectPhaseSlug: string, unitSlug: string, lessonSlug: string) => {
    const unitData = await curriculumApi2023.teachersUnitOverview({
      programmeSlug: subjectPhaseSlug,
      unitSlug,
    });

    const lesson = unitData.lessons.find((l) => l.lessonSlug === lessonSlug);
    if (!lesson?.lessonReleaseDate) {
      return null;
    }

    return {
      lessonTitle: lesson.lessonTitle,
      lessonSlug: lesson.lessonSlug,
      programmeSlug: unitData.programmeSlug,
      unitSlug: unitData.unitSlug,
      unitTitle: unitData.unitTitle,
      unitDescription: unitData.unitDescription,
      lessons: unitData.lessons,
      unitvariantId: unitData.unitvariantId,
      keyStageSlug: unitData.keyStageSlug,
      keyStageTitle: unitData.keyStageTitle,
      subjectSlug: unitData.subjectSlug,
      subjectTitle: unitData.subjectTitle,
      lessonReleaseDate: lesson.lessonReleaseDate,
    };
  },
);

export async function generateMetadata(
  props: AppPageProps<LessonDownloadsSuccessPageParams>,
): Promise<Metadata> {
  const { subjectPhaseSlug, unitSlug, lessonSlug } = await props.params;

  try {
    const data = await getCachedSuccessData(
      subjectPhaseSlug,
      unitSlug,
      lessonSlug,
    );
    if (!data) {
      return {};
    }
    const title = `Thanks for downloading! ${data.lessonTitle} | ${data.keyStageSlug.toUpperCase()} ${data.subjectTitle}`;

    return {
      title,
      robots: {
        index: false,
        follow: false,
      },
    };
  } catch {
    return {};
  }
}

const InnerLessonDownloadsSuccessPage = async (
  props: AppPageProps<LessonDownloadsSuccessPageParams>,
) => {
  const { subjectPhaseSlug, unitSlug, lessonSlug } = await props.params;
  const data = await getCachedSuccessData(
    subjectPhaseSlug,
    unitSlug,
    lessonSlug,
  );
  if (!data) {
    return notFound();
  }

  return <DownloadSuccessView lesson={data} />;
};

const LessonDownloadsSuccessPage = withPageErrorHandling(
  InnerLessonDownloadsSuccessPage,
  "lesson-downloads-success-page::app",
);

export default LessonDownloadsSuccessPage;

import { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getCachedUnitData,
  getUnitDownloadExistence,
} from "../../../getCachedUnitData";

import { DownloadSuccessView } from "./Components/DownloadSuccessView";

import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getProgrammeStateForLesson } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";
import { getUnitDownloadFileId } from "@/utils/getUnitDownloadFileId";

// We are using dynamic route segments so we can't enable instant navigation without
// prefetching all possible routes with generateStaticParams. Longer term we'd want to
// use Suspense boundaries to enable instant loading with data streaming
export const instant = false;

type LessonDownloadsSuccessPageParams = {
  slug: string;
  unitSlug: string;
  lessonSlug: string;
};

const getSuccessData = async (
  programmeSlug: string,
  unitSlug: string,
  lessonSlug: string,
) => {
  const unitData = await getCachedUnitData(programmeSlug, unitSlug);

  const lesson = unitData.lessons.find((l) => l.lessonSlug === lessonSlug);
  if (!lesson?.lessonReleaseDate) {
    return null;
  }

  return {
    lessonTitle: lesson.lessonTitle,
    lessonSlug: lesson.lessonSlug,
    lessonReleaseDate: lesson.lessonReleaseDate,
    ...unitData,
  };
};

export async function generateMetadata(
  props: AppPageProps<LessonDownloadsSuccessPageParams>,
): Promise<Metadata> {
  const { slug: programmeSlug, unitSlug, lessonSlug } = await props.params;

  try {
    const data = await getSuccessData(programmeSlug, unitSlug, lessonSlug);
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
  const { slug: programmeSlug, unitSlug, lessonSlug } = await props.params;
  const data = await getSuccessData(programmeSlug, unitSlug, lessonSlug);
  if (!data) {
    return notFound();
  }

  const programmeState = getProgrammeStateForLesson(data);
  const unitDownloadExistence = await getUnitDownloadExistence(
    getUnitDownloadFileId(data.unitTitle, data.unitvariantId),
  );

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={programmeState}
      accessLevel="lesson"
    >
      <DownloadSuccessView
        lesson={data}
        unitDownloadExistence={unitDownloadExistence}
      />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

const LessonDownloadsSuccessPage = withPageErrorHandling(
  InnerLessonDownloadsSuccessPage,
  "lesson-downloads-success-page::app",
);

export default LessonDownloadsSuccessPage;

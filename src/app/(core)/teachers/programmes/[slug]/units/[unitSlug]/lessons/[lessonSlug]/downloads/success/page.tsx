import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCachedUnitData } from "../../../getCachedUnitData";

import { DownloadSuccessView } from "./Components/DownloadSuccessView";

import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import { getFeatureFlagValue } from "@/utils/featureFlags";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getProgrammeStateForLesson } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";

type LessonDownloadsSuccessPageParams = {
  slug: string;
  unitSlug: string;
  lessonSlug: string;
};

export const dynamic = "force-dynamic";

export const getSuccessData = async (
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

  const variantKey = await getFeatureFlagValue(
    "download-success-cta-experiment",
    "string",
  );
  const ctaVariant = variantKey === "test" ? "test" : "control";

  const programmeState = getProgrammeStateForLesson(data);

  return (
    <TeacherBrowseAnalyticsStoreProvider programmeState={{ programmeState }}>
      <DownloadSuccessView lesson={data} ctaVariant={ctaVariant} />
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

const LessonDownloadsSuccessPage = withPageErrorHandling(
  InnerLessonDownloadsSuccessPage,
  "lesson-downloads-success-page::app",
);

export default LessonDownloadsSuccessPage;

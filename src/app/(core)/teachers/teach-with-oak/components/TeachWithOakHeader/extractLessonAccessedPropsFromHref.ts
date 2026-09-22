import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { TeacherBrowseAnalyticsStore } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsStore";
import { getProgrammeFieldsFromProgrammeSlug } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeFieldsFromProgrammeSlug";

type LessonAccessedProps = Parameters<
  TeacherBrowseAnalyticsStore["track"]["lessonAccessed"]
>[0];

export const extractLessonAccessedPropsFromHref = ({
  returnTo,
  lessonName,
  unitName,
}: {
  returnTo: string;
  lessonName: string;
  unitName: string;
}): LessonAccessedProps | null => {
  const baseUrl = getBrowserConfig("clientAppBaseUrl");

  let pathname: string;

  try {
    pathname = new URL(returnTo, baseUrl).pathname;
  } catch {
    pathname = returnTo;
  }

  const segments = pathname.split("/").filter(Boolean);

  if (
    segments[0] !== "teachers" ||
    segments[1] !== "programmes" ||
    segments[3] !== "units" ||
    segments[5] !== "lessons"
  ) {
    return null;
  }

  const programmeSlug = segments[2];
  const unitSlug = segments[4];
  const lessonSlug = segments[6];

  if (!programmeSlug || !unitSlug || !lessonSlug) {
    return null;
  }

  const programmeFields = getProgrammeFieldsFromProgrammeSlug(programmeSlug);
  if (!programmeFields) {
    return null;
  }

  const { keyStageSlug, keyStageTitle, tierName, pathway, examBoard } =
    programmeFields;

  return {
    componentType: "teach_with_oak_back_to_lesson",
    unitSlug,
    unitName,
    lessonSlug,
    lessonName,
    lessonReleaseCohort: "2023-2026",
    lessonReleaseDate: "unknown",
    keyStageSlug,
    keyStageTitle,
    tierName,
    pathway,
    examBoard,
    yearGroupName: "",
    yearGroupSlug: "",
  };
};

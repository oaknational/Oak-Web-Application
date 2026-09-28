import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { matchOakHref } from "@/common-lib/urls";
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

  const lessonPath = matchOakHref(pathname, "lesson-overview");

  if (!lessonPath) {
    return null;
  }

  const { programmeSlug, unitSlug, lessonSlug } = lessonPath.params;

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

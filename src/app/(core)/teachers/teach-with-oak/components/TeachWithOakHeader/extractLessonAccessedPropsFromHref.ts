import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { matchOakHref } from "@/common-lib/urls";
import { TeacherBrowseAnalyticsStore } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsStore";
import {
  getExamboardTitleFromSlug,
  getKeyStageTitle,
  getTierTitleFromSlug,
} from "@/utils/curriculum/formatting";
import { getPathwayTitleFromSlug } from "@/utils/curriculum/pathways";
import { parseProgrammeSlug } from "@/utils/curriculum/slugs";

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

  const parsedProgrammeSlug = parseProgrammeSlug(programmeSlug);

  if (!parsedProgrammeSlug) {
    return null;
  }

  const { keystageSlug, tierSlug, pathwaySlug, examboardSlug } =
    parsedProgrammeSlug;

  if (!keystageSlug) {
    return null;
  }

  const examboardTitle = getExamboardTitleFromSlug(examboardSlug);

  return {
    componentType: "teach_with_oak_back_to_lesson",
    unitSlug,
    unitName,
    lessonSlug,
    lessonName,
    lessonReleaseCohort: "2023-2026",
    lessonReleaseDate: "unknown",
    keyStageSlug: keystageSlug,
    keyStageTitle: getKeyStageTitle(keystageSlug),
    tierName: getTierTitleFromSlug(tierSlug),
    pathway: getPathwayTitleFromSlug(pathwaySlug),
    examBoard: examboardTitle,
    yearGroupName: "",
    yearGroupSlug: "",
  };
};

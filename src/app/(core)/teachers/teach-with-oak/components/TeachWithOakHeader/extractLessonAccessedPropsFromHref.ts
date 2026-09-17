import getBrowserConfig from "@/browser-lib/getBrowserConfig";
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

export const extractLessonAccessedPropsFromHref = (
  href: string,
): LessonAccessedProps | null => {
  const baseUrl = getBrowserConfig("clientAppBaseUrl");

  let pathname: string;

  try {
    pathname = new URL(href, baseUrl).pathname;
  } catch {
    pathname = href;
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
    componentType: "about_curriculum", //todo
    unitSlug,
    unitName: "", //todo
    lessonSlug,
    lessonName: "", //todo
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

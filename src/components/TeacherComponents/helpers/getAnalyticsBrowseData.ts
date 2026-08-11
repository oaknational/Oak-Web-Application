import {
  ExamBoardValueType,
  KeyStageTitleValueType,
  PathwayValueType,
  PhaseValueType,
  TierNameValueType,
} from "@/browser-lib/avo/Avo";
import { AnalyticsBrowseData } from "@/components/TeacherComponents/types/lesson.types";

const getPhaseSlug = (keyStageSlug?: string | null): PhaseValueType | null => {
  if (!keyStageSlug) return null;
  if (["ks4", "ks3"].includes(keyStageSlug)) return "secondary";
  return "primary";
};

export type GetAnalyticsBrowseDataParams = {
  keyStageSlug?: string | null;
  keyStageTitle?: string | null;
  subjectSlug?: string | null;
  subjectTitle?: string | null;
  unitSlug?: string | null;
  unitTitle?: string | null;
  year?: string | null;
  yearTitle?: string | null;
  examBoardTitle?: string | null;
  tierTitle?: string | null;
  pathwayTitle?: string | null;
  lessonSlug: string;
  lessonName: string;
  lessonReleaseDate?: string | null;
  isLegacy: boolean;
};

/**
 * Builds AnalyticsBrowseData for video/analytics event tracking.
 * Used by LessonOverview and LessonMedia to ensure consistent pathway data.
 */
export const getAnalyticsBrowseData = (
  params: GetAnalyticsBrowseDataParams,
): AnalyticsBrowseData => {
  const {
    keyStageSlug,
    keyStageTitle,
    subjectSlug,
    subjectTitle,
    unitSlug,
    unitTitle,
    year,
    yearTitle,
    examBoardTitle,
    tierTitle,
    pathwayTitle,
    lessonSlug,
    lessonName,
    lessonReleaseDate,
    isLegacy,
  } = params;

  return {
    keyStageSlug: keyStageSlug ?? "",
    keyStageTitle: keyStageTitle as KeyStageTitleValueType,
    subjectSlug: subjectSlug ?? "",
    subjectTitle: subjectTitle ?? "",
    unitSlug: unitSlug ?? "",
    unitName: unitTitle ?? "",
    lessonSlug,
    lessonName,
    pathway: pathwayTitle as PathwayValueType,
    tierName: tierTitle as TierNameValueType,
    yearGroupName: yearTitle ?? "",
    yearGroupSlug: year ? `year-${year}` : "",
    examBoard: examBoardTitle as ExamBoardValueType,
    releaseGroup: isLegacy ? "legacy" : "2023",
    phase: getPhaseSlug(keyStageSlug),
    lessonReleaseCohort: isLegacy ? "2020-2023" : "2023-2026",
    lessonReleaseDate: lessonReleaseDate ?? "unreleased",
  };
};

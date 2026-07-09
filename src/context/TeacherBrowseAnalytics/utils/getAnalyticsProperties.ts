import {
  ProgrammeState,
  ProgrammePathwayData,
  ProgrammeStateUnit,
  UnitPathwayData,
  ProgrammeStateLesson,
  LessonPathwayData,
} from "../teacherBrowseAnalytics.types";

import {
  ExamBoardValueType,
  KeyStageTitleValueType,
  PathwayValueType,
  TierNameValueType,
} from "@/browser-lib/avo/Avo";

/**
 * Helper fns to transform curriculum data into the shape Avo expects
 * to be sent with events
 */

export const getProgrammeAnalyticsProperties = (
  programmeState: ProgrammeState,
): ProgrammePathwayData => {
  return {
    examBoard: programmeState.examBoardTitle as ExamBoardValueType,
    keyStageSlug: programmeState.keyStageSlug,
    keyStageTitle: programmeState.keyStageTitle as KeyStageTitleValueType,
    pathway: programmeState.pathwayTitle as PathwayValueType,
    subjectSlug: programmeState.subjectSlug,
    subjectTitle: programmeState.subjectTitle,
    tierName: programmeState.tierTitle as TierNameValueType,
  };
};

export const getUnitAnalyticsProperties = (
  programmeState: ProgrammeStateUnit,
): UnitPathwayData => {
  const programmePathwayData = getProgrammeAnalyticsProperties(programmeState);
  return {
    ...programmePathwayData,
    unitName: programmeState.unit.title,
    unitSlug: programmeState.unit.slug,
  };
};

export const getLessonAnalyticsProperties = (
  programmeState: ProgrammeStateLesson,
): LessonPathwayData => {
  const unitPathwayData = getUnitAnalyticsProperties(programmeState);
  return {
    ...unitPathwayData,
    lessonName: programmeState.lesson.title,
    lessonSlug: programmeState.lesson.slug,
    lessonReleaseDate: programmeState.lesson.lessonReleaseDate,
  };
};

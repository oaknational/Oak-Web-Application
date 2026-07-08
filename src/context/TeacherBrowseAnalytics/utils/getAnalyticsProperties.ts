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

export const getProgrammeAnalyticsProperties = (
  programmeState: ProgrammeState,
): ProgrammePathwayData => {
  return {
    examBoard: programmeState.examboard?.title as ExamBoardValueType,
    keyStageSlug: programmeState.keystage.slug,
    keyStageTitle: programmeState.keystage.title as KeyStageTitleValueType,
    pathway: programmeState.pathway?.title as PathwayValueType,
    subjectSlug: programmeState.subject.slug,
    subjectTitle: programmeState.subject.title,
    tierName: programmeState.tier?.title as TierNameValueType,
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

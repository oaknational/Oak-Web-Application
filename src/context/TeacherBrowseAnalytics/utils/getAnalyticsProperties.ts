import { ProgrammeFields } from "@oaknational/oak-curriculum-schema";

import {
  ProgrammeState,
  ProgrammePathwayData,
  ProgrammeStateUnit,
  UnitPathwayData,
  ProgrammeStateLesson,
  LessonPathwayData,
} from "../teacherBrowseAnalytics.types";

import { KeyStageTitleValueType, PhaseValueType } from "@/browser-lib/avo/Avo";

/**
 * Helper fns to transform curriculum data into the shape Avo expects
 * to be sent with events
 */

const convertKsTitle = (ks: ProgrammeFields["keystage_description"]) => {
  const sentenceCase = ks.charAt(0).toUpperCase() + ks.slice(1).toLowerCase();
  return sentenceCase as KeyStageTitleValueType;
};

export const getProgrammeAnalyticsProperties = (
  programmeState: ProgrammeState,
): ProgrammePathwayData => {
  return {
    phase: programmeState.phaseSlug as PhaseValueType,
    subjectSlug: programmeState.subjectSlug,
    subjectTitle: programmeState.subjectTitle,
  };
};

export const getUnitAnalyticsProperties = (
  programmeState: ProgrammeStateUnit,
): UnitPathwayData => {
  return {
    phase: programmeState.phaseSlug as PhaseValueType,
    examBoard: programmeState.examBoardTitle,
    keyStageSlug: programmeState.keyStageSlug,
    keyStageTitle: convertKsTitle(programmeState.keyStageTitle),
    pathway: programmeState.pathwayTitle,
    subjectSlug: programmeState.subjectSlug,
    subjectTitle: programmeState.subjectTitle,
    tierName: programmeState.tierTitle,
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
    lessonReleaseCohort: "2023-2026",
    releaseGroup: "2023",
    yearGroupName: programmeState.yearGroupTitle,
    yearGroupSlug: `year-${programmeState.year}`,
  };
};

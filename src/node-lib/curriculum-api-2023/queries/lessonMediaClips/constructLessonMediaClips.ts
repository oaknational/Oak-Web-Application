import { LessonPathway } from "../../shared.schema";
import { LessonBrowseDataByKs } from "../lessonOverview/lessonOverview.schema";

export const constructLessonMediaData = (
  browseData: LessonBrowseDataByKs,
  pathways?: LessonPathway[] | [],
) => {
  const unitTitle =
    browseData.programmeFields.optionality ?? browseData.unitData.title;
  const result = {
    lessonSlug: browseData.lessonSlug,
    lessonTitle: browseData.lessonData.title,
    keyStageTitle: browseData.programmeFields.keystageDescription,
    mediaClips: browseData.lessonData.mediaClips,
    lessonOutline: browseData.lessonData.lessonOutline ?? null,
    actions: browseData.actions ?? null,
    lessonReleaseDate: browseData.lessonData.lessonReleaseDate,
    geoRestricted: browseData.features?.agfGeoRestricted ?? false,
    loginRequired: browseData.features?.agfLoginRequired ?? false,
  };
  if (pathways) {
    return { ...result, pathways };
  }
  return {
    ...result,
    programmeSlug: browseData.programmeSlug,
    unitSlug: browseData.unitSlug,
    unitTitle,
    keyStageSlug: browseData.programmeFields.keystageSlug,
    subjectSlug: browseData.programmeFields.subjectSlug,
    subjectTitle: browseData.programmeFields.subject,
    subjectParent: browseData.programmeFields.subjectParent,
    phaseSlug: browseData.programmeFields.phaseSlug,
    phaseTitle: browseData.programmeFields.phaseDescription,
    pathwaySlug: browseData.programmeFields.pathwaySlug,
    pathwayTitle: browseData.programmeFields.pathwayDescription,
    tierSlug: browseData.programmeFields.tierSlug,
    tierTitle: browseData.programmeFields.tierDescription,
    yearTitle: browseData.programmeFields.yearDescription,
    yearGroupTitle: browseData.programmeFields.yearDescription,
    examBoardSlug: browseData.programmeFields.examboardSlug,
    examBoardTitle: browseData.programmeFields.examboard,
    lessonCohort: browseData.lessonData._cohort,
    updatedAt: browseData.lessonData.updatedAt,
  };
};

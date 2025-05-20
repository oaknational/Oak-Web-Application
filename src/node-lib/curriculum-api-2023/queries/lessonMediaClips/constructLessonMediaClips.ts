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
    tierSlug: browseData.programmeFields.tierSlug,
    tierTitle: browseData.programmeFields.tier,
    yearTitle: browseData.programmeFields.yearDescription,
    examBoardTitle: browseData.programmeFields.examboard,
    updatedAt: browseData.lessonData.updatedAt,
  };
};

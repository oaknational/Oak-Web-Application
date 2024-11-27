import { toSentenceCase } from "../../helpers";
import { LessonPathway } from "../../shared.schema";
import { LessonBrowseDataByKsOld } from "../lessonOverview/lessonOverview.schema";

export const constructLessonMediaData = (
  browseData: LessonBrowseDataByKsOld,
  pathways?: LessonPathway[] | [],
) => {
  const unitTitle =
    browseData.programmeFields.optionality ?? browseData.unitData.title;
  const result = {
    programmeSlug: browseData.programmeSlug,
    unitSlug: browseData.unitSlug,
    unitTitle,
    keyStageSlug: browseData.programmeFields.keystageSlug,
    keyStageTitle: toSentenceCase(
      browseData.programmeFields.keystageDescription,
    ),
    subjectSlug: browseData.programmeFields.subjectSlug,
    subjectTitle: browseData.programmeFields.subject,
    yearTitle: browseData.programmeFields.yearDescription,
    examBoardTitle: browseData.programmeFields.examboard,
    updatedAt: browseData.lessonData.updatedAt,
    lessonSlug: browseData.lessonSlug,
    lessonTitle: browseData.lessonData.title,
    tierTitle: browseData.programmeFields.tierDescription,
    tierSlug: browseData.programmeFields.tierSlug,
  };

  if (pathways) {
    return { ...result, pathways };
  }

  return result;
};

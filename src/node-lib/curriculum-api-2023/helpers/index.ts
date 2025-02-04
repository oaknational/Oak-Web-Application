import {
  InputMaybe,
  Published_Mv_Synthetic_Unitvariant_Lessons_By_Keystage_13_1_0_Bool_Exp,
} from "../generated/sdk";
import { RawSyntheticUVLesson } from "../queries/lessonDownloads/rawSyntheticUVLesson.schema";
import { lessonPathwaySchema } from "../shared.schema";

export const toSentenceCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/* When including Core on the MV it returns on all subjects even if they do not have Core tier data,
 this function removes core from programmes that shouldn't have Core as an option*/
const hasCoreTierSet = new Set(["maths-ks4"]);
export const isTierValid = (
  legacy: boolean,
  tierSlug: string,
  subjectSlug?: string | null,
  keyStageSlug?: string | null,
) => {
  const key = `${subjectSlug}-${keyStageSlug}`;
  if (!hasCoreTierSet.has(key) || !legacy) {
    return tierSlug !== "core";
  } else {
    return true;
  }
};

/**
 * Used in canonical lesson pages to construct the pathways for a lesson
 */
export const constructPathwayLesson = (lesson: RawSyntheticUVLesson) => {
  return lessonPathwaySchema.parse({
    programmeSlug: lesson.programme_slug,
    unitSlug: lesson.unit_slug,
    unitTitle: lesson.programme_fields.optionality ?? lesson.unit_data.title,
    keyStageSlug: lesson.programme_fields.keystage_slug,
    keyStageTitle: toSentenceCase(lesson.programme_fields.keystage_description),
    subjectSlug: lesson.programme_fields.subject_slug,
    subjectTitle: lesson.programme_fields.subject,
    lessonCohort: lesson.lesson_data._cohort,
    examBoardSlug: lesson.programme_fields.examboard_slug,
    examBoardTitle: lesson.programme_fields.examboard,
    lessonSlug: lesson.lesson_slug,
    lessonTitle: lesson.lesson_data.title,
    tierSlug: lesson.programme_fields.tier_slug,
    tierTitle: lesson.programme_fields.tier_description,
  });
};

/** Used by canonical lesson share and download queries */
export const constructLessonBrowseQuery = ({
  unitSlug,
  programmeSlug,
  lessonSlug,
}: {
  unitSlug?: string;
  programmeSlug?: string;
  lessonSlug?: string;
}) => {
  const browseDataWhere: InputMaybe<Published_Mv_Synthetic_Unitvariant_Lessons_By_Keystage_13_1_0_Bool_Exp> =
    {};

  browseDataWhere["lesson_slug"] = { _eq: lessonSlug };

  if (unitSlug) {
    browseDataWhere["unit_slug"] = { _eq: unitSlug };
  }

  if (programmeSlug) {
    browseDataWhere["programme_slug"] = { _eq: programmeSlug };
  }

  return browseDataWhere;
};

import {
  ProgrammeFactorState,
  ProgrammeStateLesson,
  ProgrammeStateUnit,
  ProgrammeStateProgramme,
  CoreProgrammeState,
  isProgrammeFactorState,
} from "../teacherBrowseAnalytics.types";

import { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";
import { TeachersUnitOverviewData } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";

/**
 * Helper fns to transform curriculum data into the shape required for
 * the Teacher Browse store
 */

// Overload function to sanitise either Core or ProgrammeFactor state from query input
function getSharedProgrammeState(
  data: ProgrammeFactorState,
): ProgrammeFactorState;
function getSharedProgrammeState(data: CoreProgrammeState): CoreProgrammeState;
function getSharedProgrammeState(
  data: ProgrammeFactorState | CoreProgrammeState,
) {
  const coreState = {
    programmeSlug: data.programmeSlug,
    subjectSlug: data.subjectSlug,
    subjectTitle: data.subjectTitle,
    phaseSlug: data.phaseSlug,
    phaseTitle: data.phaseTitle,
  };

  if (isProgrammeFactorState(data)) {
    return {
      ...coreState,
      year: data.year,
      yearGroupTitle: data.yearGroupTitle,
      keyStageSlug: data.keyStageSlug,
      keyStageTitle: data.keyStageTitle,
      tierSlug: data.tierSlug,
      tierTitle: data.tierTitle,
      examBoardSlug: data.examBoardSlug,
      examBoardTitle: data.examBoardTitle,
      pathwaySlug: data.pathwaySlug,
      pathwayTitle: data.pathwayTitle,
    };
  }

  return coreState;
}

export const getProgrammeStateForProgramme = (
  data: CoreProgrammeState,
): ProgrammeStateProgramme => {
  return {
    browseLevel: "programme",
    ...getSharedProgrammeState(data),
  };
};

export const getProgrammeStateForUnit = (
  data: ProgrammeFactorState &
    Pick<TeachersUnitOverviewData, "unitSlug" | "unitTitle">,
): ProgrammeStateUnit => {
  return {
    browseLevel: "unit",
    ...getSharedProgrammeState(data),
    unit: {
      slug: data.unitSlug,
      title: data.unitTitle,
    },
  };
};

export const getProgrammeStateForLesson = (
  data: ProgrammeFactorState &
    Pick<
      TeachersLessonOverviewPageData,
      | "unitSlug"
      | "unitTitle"
      | "lessonSlug"
      | "lessonTitle"
      | "lessonReleaseDate"
    >,
): ProgrammeStateLesson => {
  return {
    browseLevel: "lesson",
    ...getSharedProgrammeState(data),
    unit: {
      slug: data.unitSlug,
      title: data.unitTitle,
    },
    lesson: {
      slug: data.lessonSlug,
      title: data.lessonTitle,
      lessonReleaseDate: data.lessonReleaseDate ?? "unpublished",
    },
  };
};

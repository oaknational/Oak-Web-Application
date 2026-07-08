import {
  ProgrammeStateLesson,
  ProgrammeStateUnit,
} from "../teacherBrowseAnalytics.types";

import { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";
import { TeachersUnitOverviewData } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";

export const getProgrammeStateForUnit = (
  data: TeachersUnitOverviewData,
): ProgrammeStateUnit => {
  return {
    browseLevel: "unit",
    subject: {
      slug: data.subjectSlug,
      title: data.subjectTitle,
    },
    phase: {
      slug: data.phaseSlug,
      title: data.phaseTitle,
    },
    year: {
      slug: data.year,
      title: data.yearGroupTitle,
    },
    keystage: {
      slug: data.keyStageSlug,
      title: data.keyStageTitle,
    },
    tier:
      data.tierTitle && data.tierSlug
        ? {
            slug: data.tierSlug,
            title: data.tierTitle,
          }
        : null,
    examboard: data.examBoardTitle
      ? {
          slug: data.examBoardSlug,
          title: data.examBoardTitle,
        }
      : null,
    pathway: data.pathwayTitle
      ? {
          slug: data.pathwaySlug,
          title: data.pathwayTitle,
        }
      : null,
    unit: {
      slug: data.unitSlug,
      title: data.unitTitle,
    },
  };
};

export const getProgrammeStateForLesson = (
  data: TeachersLessonOverviewPageData,
): ProgrammeStateLesson => {
  return {
    browseLevel: "lesson",
    subject: {
      slug: data.subjectSlug,
      title: data.subjectTitle,
    },
    phase: {
      slug: data.phaseSlug,
      title: data.phaseTitle,
    },
    year: {
      slug: data.year,
      title: data.yearGroupTitle,
    },
    keystage: {
      slug: data.keyStageSlug,
      title: data.keyStageTitle,
    },
    tier:
      data.tierTitle && data.tierSlug
        ? {
            slug: data.tierSlug,
            title: data.tierTitle,
          }
        : null,
    examboard: data.examBoardTitle
      ? {
          slug: data.examBoardSlug,
          title: data.examBoardTitle,
        }
      : null,
    pathway: data.pathwayTitle
      ? {
          slug: data.pathwaySlug,
          title: data.pathwayTitle,
        }
      : null,
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

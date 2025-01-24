import { getCommonPathway } from "../helpers/lessonHelpers/lesson.helpers";

import { MediaClipListCamelCase } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import { SpecialistLessonOverviewData } from "@/node-lib/curriculum-api-2023/queries/specialistLessonOverview/specialistLessonOverview.schema";
import { LessonBase } from "@/node-lib/curriculum-api-2023/shared.schema";
export type { LessonBase } from "@/node-lib/curriculum-api-2023/shared.schema";

export type LessonPathway = {
  keyStageTitle?: string;
  keyStageSlug?: string;
  subjectTitle: string;
  subjectSlug: string;
  unitTitle: string;
  unitSlug: string;
  programmeSlug: string;
  yearSlug?: string | null;
  yearTitle?: string | null;
  tierTitle?: string | null;
  tierSlug?: string | null;
  examBoardTitle?: string | null;
  examBoardSlug?: string | null;
  lessonCohort?: string | null;
};

export type SpecialistLessonPathway = {
  lessonSlug: string;
  lessonTitle: string;
  programmeSlug: string;
  unitSlug: string;
  unitTitle: string;
  disabled?: boolean;
  subjectTitle: string;
  subjectSlug: string;
  developmentStageTitle?: string | null;
  disable?: boolean;
  keyStageSlug: null;
  keyStageTitle: null;
};

export const getPathway = (lesson: LessonOverviewAll) => {
  if (lessonIsSpecialist(lesson)) {
    return {
      lessonSlug: lesson.lessonSlug,
      lessonTitle: lesson.lessonTitle,
      unitSlug: lesson.unitSlug,
      programmeSlug: lesson.programmeSlug,
      unitTitle: lesson.unitTitle,
      subjectTitle: lesson.subjectTitle,
      subjectSlug: lesson.subjectSlug,
      developmentStageTitle: lesson.developmentStageTitle,
      disabled: true,
      keyStageSlug: null,
      keyStageTitle: null,
    } as SpecialistLessonPathway;
  } else {
    return getCommonPathway(lesson.isCanonical ? lesson.pathways : [lesson]);
  }
};

export type LessonOverviewCanonical = LessonBase & {
  isCanonical: true;
  pathways: LessonPathway[];
  lessonMediaClips?: MediaClipListCamelCase | null;
};

export type LessonOverviewInPathway = LessonBase & {
  isCanonical: false;
  keyStageTitle: string;
  keyStageSlug: string;
  subjectTitle: string;
  subjectSlug: string;
  unitTitle: string;
  unitSlug: string;
  programmeSlug: string;
  updatedAt: string;
  lessonMediaClips?: MediaClipListCamelCase | null;
};

export type LessonOverviewAll = { isSpecialist: boolean } & (
  | LessonOverviewCanonical
  | LessonOverviewInPathway
  | SpecialistLessonOverviewData
);

export const lessonIsSpecialist = (
  u: unknown,
): u is SpecialistLessonOverviewData => {
  return (
    typeof u === "object" &&
    u !== null &&
    Object.prototype.hasOwnProperty.call(u, "isSpecialist") &&
    (u as { isSpecialist: boolean }).isSpecialist === true
  );
};

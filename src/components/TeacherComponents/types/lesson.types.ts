import { MediaClipListCamelCase } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import { SpecialistLessonOverviewData } from "@/node-lib/curriculum-api-2023/queries/specialistLessonOverview/specialistLessonOverview.schema";
import { LessonBase } from "@/node-lib/curriculum-api-2023/shared.schema";
export type { LessonBase } from "@/node-lib/curriculum-api-2023/shared.schema";

export type LessonPathway = {
  keyStageTitle?: string;
  keyStageSlug?: string;
  subjectTitle: string;
  subjectSlug: string;
  subjectParent?: string | null;
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
  pathwayTitle?: string | null;
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
  yearTitle: null;
  examBoardSlug: null;
  examBoardTitle: null;
  tierTitle: null;
  subjectParent: null;
  pathwayTitle: null;
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
  subjectParent?: string | null;
  unitTitle: string;
  unitSlug: string;
  programmeSlug: string;
  updatedAt: string;
  lessonMediaClips?: MediaClipListCamelCase | null;
  pathwayTitle?: string | null;
  examBoardTitle?: string | null;
};

export type LessonOverviewAll = { isSpecialist: boolean } & (
  | LessonOverviewCanonical
  | LessonOverviewInPathway
  | SpecialistLessonOverviewData
);

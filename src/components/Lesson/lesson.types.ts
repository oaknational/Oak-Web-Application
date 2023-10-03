import { LessonBase } from "@/node-lib/curriculum-api-2023/shared.schema";
export type { LessonBase } from "@/node-lib/curriculum-api-2023/shared.schema";

export type LessonPathway = {
  keyStageTitle: string;
  keyStageSlug: string;
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
};

export type LessonOverviewCanonical = LessonBase & {
  isCanonical: true;
  pathways: LessonPathway[];
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
};

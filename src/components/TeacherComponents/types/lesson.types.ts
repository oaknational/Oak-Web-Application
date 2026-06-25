import {
  KeyStageTitleValueType,
  PhaseValueType,
  TierNameValueType,
  PathwayValueType,
  ExamBoardValueType,
  LessonReleaseCohortValueType,
} from "@/browser-lib/avo/Avo";
import { MediaClipListCamelCase } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
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
  year?: string | null;
  yearTitle?: string | null;
  tierTitle?: string | null;
  tierSlug?: string | null;
  examBoardTitle?: string | null;
  examBoardSlug?: string | null;
  lessonCohort?: string | null;
  pathwayTitle?: string | null;
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

export type LessonOverviewAll =
  | LessonOverviewCanonical
  | LessonOverviewInPathway;

export type AnalyticsBrowseData = {
  unitName: string;
  unitSlug: string;
  lessonSlug: string;
  lessonName: string;
  keyStageSlug: string;
  keyStageTitle: KeyStageTitleValueType;
  subjectTitle: string;
  subjectSlug: string;
  yearGroupName: string;
  yearGroupSlug: string;
  phase: PhaseValueType | undefined | null;
  tierName: TierNameValueType | null | undefined;
  pathway: PathwayValueType | null | undefined;
  examBoard: ExamBoardValueType | null | undefined;
  releaseGroup: string;
  lessonReleaseCohort: LessonReleaseCohortValueType;
  lessonReleaseDate: string;
};

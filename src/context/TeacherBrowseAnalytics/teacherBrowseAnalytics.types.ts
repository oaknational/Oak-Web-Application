import { ProgrammeFields } from "@oaknational/oak-curriculum-schema";

import {
  KeyStageTitleValueType,
  TierNameValueType,
  ExamBoardValueType,
  PathwayValueType,
} from "@/browser-lib/avo/Avo";

// Core programme properties used at all browse levels
export type SharedProgrammeState = {
  subjectSlug: ProgrammeFields["subject_slug"];
  subjectTitle: ProgrammeFields["subject"];
  phaseSlug: ProgrammeFields["phase_slug"];
  phaseTitle: ProgrammeFields["phase_description"];
  year: ProgrammeFields["year"];
  yearGroupTitle: ProgrammeFields["year_description"];
  keyStageSlug: ProgrammeFields["keystage_slug"];
  keyStageTitle: ProgrammeFields["keystage_description"];
  tierSlug: ProgrammeFields["tier_slug"];
  tierTitle: ProgrammeFields["tier_description"];
  examBoardSlug: ProgrammeFields["examboard_slug"];
  examBoardTitle: ProgrammeFields["examboard"];
  pathwaySlug: ProgrammeFields["pathway_slug"];
  pathwayTitle: ProgrammeFields["pathway_description"];
};

export type ProgrammeState = SharedProgrammeState &
  (
    | { browseLevel: "programme" }
    | { browseLevel: "unit"; unit: UnitState }
    | { browseLevel: "lesson"; unit: UnitState; lesson: LessonState }
  );

export type ProgrammeStateUnit = Extract<
  ProgrammeState,
  { browseLevel: "unit" | "lesson" }
>;

export type ProgrammeStateLesson = Extract<
  ProgrammeState,
  { browseLevel: "lesson" }
>;

export type UnitState = {
  slug: string;
  title: string;
};
export type LessonState = {
  slug: string;
  title: string;
  lessonReleaseDate: string;
};

export type ProgrammePathwayData = {
  keyStageTitle: KeyStageTitleValueType;
  keyStageSlug: string;
  subjectTitle: string;
  subjectSlug: string;
  tierName: TierNameValueType | null;
  examBoard: ExamBoardValueType | null;
  pathway: PathwayValueType | null;
};
export type UnitPathwayData = ProgrammePathwayData & {
  unitName: string;
  unitSlug: string;
};
export type LessonPathwayData = ProgrammePathwayData &
  UnitPathwayData & {
    lessonName: string;
    lessonSlug: string;
    lessonReleaseDate: string;
  };

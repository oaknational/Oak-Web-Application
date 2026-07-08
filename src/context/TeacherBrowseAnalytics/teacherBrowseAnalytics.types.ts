import { ProgrammeFields } from "@oaknational/oak-curriculum-schema";

import {
  KeyStageTitleValueType,
  TierNameValueType,
  ExamBoardValueType,
  PathwayValueType,
} from "@/browser-lib/avo/Avo";

export type ProgrammeState = {
  subject: {
    slug: ProgrammeFields["subject_slug"];
    title: ProgrammeFields["subject"];
  };
  phase: {
    slug: ProgrammeFields["phase_slug"];
    title: ProgrammeFields["phase_description"];
  };
  year: {
    slug: ProgrammeFields["year"];
    title: ProgrammeFields["year_description"];
  };
  keystage: {
    slug: ProgrammeFields["keystage_slug"];
    title: ProgrammeFields["keystage_description"];
  };
  tier: {
    slug: ProgrammeFields["tier_slug"];
    title: ProgrammeFields["tier_description"];
  } | null;
  examboard: {
    slug: ProgrammeFields["examboard_slug"];
    title: ProgrammeFields["examboard"];
  } | null;
  pathway: {
    slug: ProgrammeFields["pathway_slug"];
    title: ProgrammeFields["pathway_description"];
  } | null;
} & (
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

type UnitState = {
  slug: string;
  title: string;
};
type LessonState = {
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

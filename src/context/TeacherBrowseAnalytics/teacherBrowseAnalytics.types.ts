import {
  subjectSlugs,
  subjects,
  phaseSlugs,
  phaseDescriptions,
} from "@oaknational/oak-curriculum-schema";
import z from "zod";

import {
  KeyStageTitleValueType,
  TierNameValueType,
  ExamBoardValueType,
  PathwayValueType,
} from "@/browser-lib/avo/Avo";

type ItemState = {
  slug: string;
  title: string;
};

export type ProgrammeState = {
  subject: {
    slug: z.infer<typeof subjectSlugs>;
    title: z.infer<typeof subjects>;
  };
  phase: {
    slug: z.infer<typeof phaseSlugs>;
    title: z.infer<typeof phaseDescriptions>;
  };
  year: ItemState; // TODO: use proper types for each value
  keystage: ItemState;
  tier: ItemState | null;
  examboard: ItemState | null;
  pathway: ItemState | null;
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

export type UnitState = ItemState;

export type LessonState = ItemState & {
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
export type lessonPathwayData = ProgrammePathwayData &
  UnitPathwayData & {
    lessonName: string;
    lessonSlug: string;
    lessonReleaseDate: string;
  };

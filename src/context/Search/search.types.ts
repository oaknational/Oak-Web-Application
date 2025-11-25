import { z } from "zod";

import {
  lessonSearchHitSchema,
  unitSearchHitSchema,
  searchResultsHitSchema,
  pathwaySchema,
} from "./search.schema";

import { SearchPageData } from "@/node-lib/curriculum-api-2023";
import { SnakeToCamel } from "@/utils/util.types";
import { SearchFilterMatchTypeValueType } from "@/browser-lib/avo/Avo";
import { SearchIntent } from "@/common-lib/schemas/search-intent";

export type SearchQuery = {
  term: string;
  keyStages?: string[];
  yearGroups?: string[];
  subjects?: string[];
  contentTypes?: ("unit" | "lesson")[];
  examBoards?: string[];
  legacy?: "filterOutAll" | "filterOutLegacyIncludeEYFS" | "filterOutEYFS";
  curriculum?: string[];
};

export type SetSearchQuery = (
  arg: Partial<SearchQuery> | ((oldQuery: SearchQuery) => Partial<SearchQuery>),
) => void;

export type KeyStage = SearchPageData["keyStages"][number];
export type Subject = SearchPageData["subjects"][number];
export type ContentType = {
  slug: "lesson" | "unit";
  title: "Lessons" | "Units";
};
export type ExamBoard = SearchPageData["examBoards"][number];
export type YearGroup = SearchPageData["yearGroups"][number];

export type UseSearchFiltersProps = {
  allKeyStages: KeyStage[];
  allYearGroups: YearGroup[];
  allSubjects: SearchPageData["subjects"];
  allContentTypes: ContentType[];
  allExamBoards: ExamBoard[];
  setQuery: SetSearchQuery;
  query: SearchQuery;
};

export type SearchCheckBoxProps = {
  onChange: () => void;
  checked: boolean;
};

export type UseSearchFiltersReturnType = {
  subjectFilters: (Subject & SearchCheckBoxProps)[];
  keyStageFilters: (KeyStage & SearchCheckBoxProps)[];
  yearGroupFilters: (YearGroup & SearchCheckBoxProps)[];
  contentTypeFilters: (ContentType & SearchCheckBoxProps)[];
  examBoardFilters: (ExamBoard & SearchCheckBoxProps)[];
  legacyFilter: { slug: string; title: string } & SearchCheckBoxProps;
};

export type LessonSearchHit = z.infer<typeof lessonSearchHitSchema>;
export type UnitSearchHit = z.infer<typeof unitSearchHitSchema>;
export type SearchHit = z.infer<typeof searchResultsHitSchema>;

export type PathwaySchema = z.infer<typeof pathwaySchema>;
export type PathwaySchemaCamel = SnakeToCamel<PathwaySchema>;

export type SuggestedFilters = {
  searchFilters: SuggestedSearchFilter[] | undefined;
  status: "idle" | "loading" | "success" | "error";
  error?: string;
  data?: SearchIntent;
};

export type SuggestedSearchFilter = {
  type: "subject" | "key-stage" | "year" | "exam-board";
  value: string;
  slug: string;
  source: SearchFilterMatchTypeValueType;
};

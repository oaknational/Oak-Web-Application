import { z } from "zod";

import {
  lessonSearchHitSchema,
  unitSearchHitSchema,
  searchResultsHitSchema,
  pathwaySchema,
} from "./search.schema";

import { SearchPageData } from "@/node-lib/curriculum-api-2023";
import { SnakeToCamel } from "@/utils/util.types";

export type SearchQuery = {
  term: string;
  keyStages?: string[];
  subjects?: string[];
  contentTypes?: ("unit" | "lesson")[];
  examBoards?: string[];
  legacy?: "filterOutAll" | "filterOutLegacyIncludeEYFS";
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

export type UseSearchFiltersProps = {
  allKeyStages: KeyStage[];
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
  contentTypeFilters: (ContentType & SearchCheckBoxProps)[];
  examBoardFilters: (ExamBoard & SearchCheckBoxProps)[];
};

export type LessonSearchHit = z.infer<typeof lessonSearchHitSchema>;
export type UnitSearchHit = z.infer<typeof unitSearchHitSchema>;
export type SearchHit = z.infer<typeof searchResultsHitSchema>;

export type PathwaySchema = z.infer<typeof pathwaySchema>;
export type PathwaySchemaCamel = SnakeToCamel<PathwaySchema>;

import { z } from "zod";

import {
  lessonSearchHitSchema,
  unitSearchHitSchema,
  searchResultsHitSchema,
  pathwaySchema,
} from "./search.schema";

import { SearchPageData } from "@/node-lib/curriculum-api-2023";
import { SnakeToCamel } from "@/utils/util.types";

export const searchPageParamsSchema = z.object({
  term: z.string().optional(),
  keyStages: z.string().optional(),
  yearGroups: z.string().optional(),
  subjects: z.string().optional(),
  contentTypes: z.string().optional(),
  examBoards: z.string().optional(),
  curriculum: z.string().optional(),
});

export type SearchPageQueryParams = z.infer<typeof searchPageParamsSchema>;
export type SearchFilterKey = Exclude<keyof SearchPageQueryParams, "term">;

export type SearchQuery = {
  term: string;
  keyStages?: string[];
  yearGroups?: string[];
  subjects?: string[];
  contentTypes?: ("unit" | "lesson")[];
  examBoards?: string[];
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

export type GetSearchFiltersProps = {
  allKeyStages: KeyStage[];
  allYearGroups: YearGroup[];
  allSubjects: SearchPageData["subjects"];
  allContentTypes: ContentType[];
  allExamBoards: ExamBoard[];
  query: SearchQuery;
};

export type SearchCheckBoxProps = {
  checked: boolean;
  filterKey: SearchFilterKey;
};

export type GetSearchFiltersReturnType = {
  subjectFilters: (Subject & SearchCheckBoxProps)[];
  keyStageFilters: (KeyStage & SearchCheckBoxProps)[];
  yearGroupFilters: (YearGroup & SearchCheckBoxProps)[];
  contentTypeFilters: (ContentType & SearchCheckBoxProps)[];
  examBoardFilters: (ExamBoard & SearchCheckBoxProps)[];
};

export type LessonSearchHit = z.infer<typeof lessonSearchHitSchema>;
export type UnitSearchHit = z.infer<typeof unitSearchHitSchema>;
export type SearchHit = z.infer<typeof searchResultsHitSchema>;

export type PathwaySchema = z.infer<typeof pathwaySchema>;
export type PathwaySchemaCamel = SnakeToCamel<PathwaySchema>;

export type RequestStatus = "not-asked" | "fail" | "success";

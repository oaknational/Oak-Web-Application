import { z } from "zod";

import {
  lessonSearchHitSchema,
  unitSearchHitSchema,
  searchResultsHitSchema,
} from "./search.schema";

import { SearchPageData } from "@/node-lib/curriculum-api-2023";

export type SearchQuery = {
  term: string;
  keyStages?: string[];
  subjects?: string[];
  contentTypes?: ("unit" | "lesson")[];
};

export type SetSearchQuery = (
  arg: Partial<SearchQuery> | ((oldQuery: SearchQuery) => Partial<SearchQuery>)
) => void;

export type KeyStage = SearchPageData["keyStages"][number];
export type Subject = SearchPageData["subjects"][number];
export type ContentType = {
  slug: "lesson" | "unit";
  title: "Lessons" | "Units";
};

export type UseSearchFiltersProps = {
  allKeyStages: KeyStage[];
  allSubjects: SearchPageData["subjects"];
  allContentTypes: ContentType[];
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
};

export type LessonSearchHit = z.infer<typeof lessonSearchHitSchema>;
export type UnitSearchHit = z.infer<typeof unitSearchHitSchema>;

export type SearchHit = z.infer<typeof searchResultsHitSchema>;

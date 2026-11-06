import z from "zod";

import { getFilterForQuery } from ".";

import {
  searchPageParamsSchema,
  SearchQuery,
} from "@/context/Search/search.types";
import { SearchPageData } from "@/node-lib/curriculum-api-2023";

export const constructSearchQuery = ({
  searchParams,
  data,
}: {
  data?: SearchPageData;
  searchParams: z.infer<typeof searchPageParamsSchema>;
}): SearchQuery => {
  const {
    subjects: allSubjects,
    keyStages: allKeyStages,
    contentTypes: allContentTypes,
    examBoards: allExamBoards,
    yearGroups: allYearGroups,
  } = data ?? {};

  const query = {
    term: searchParams?.term,
    keyStages:
      allKeyStages && searchParams?.keyStages
        ? getFilterForQuery(searchParams?.keyStages, allKeyStages)
        : [],
    yearGroups:
      allYearGroups && searchParams?.yearGroups
        ? getFilterForQuery(searchParams?.yearGroups, allYearGroups)
        : [],
    subjects:
      allSubjects && searchParams?.subjects
        ? getFilterForQuery(searchParams?.subjects, allSubjects)
        : [],
    contentTypes:
      allContentTypes && searchParams?.contentTypes
        ? getFilterForQuery(searchParams?.contentTypes, allContentTypes).filter(
            (type): type is "lesson" | "unit" =>
              type === "lesson" || type === "unit",
          )
        : [],
    examBoards:
      allExamBoards && searchParams?.examBoards
        ? getFilterForQuery(searchParams?.examBoards, allExamBoards)
        : [],
    curriculum: [],
    legacy: "filterOutAll" as const,
  };

  return query;
};

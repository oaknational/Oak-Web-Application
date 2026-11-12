import { getFilterForQuery } from ".";

import {
  SearchPageQueryParams,
  SearchQuery,
} from "@/context/Search/search.types";
import { SearchPageData } from "@/node-lib/curriculum-api-2023";

export const constructSearchQuery = ({
  searchQuery,
  data,
}: {
  data?: SearchPageData;
  searchQuery: SearchPageQueryParams;
}): SearchQuery => {
  const {
    subjects: allSubjects,
    keyStages: allKeyStages,
    contentTypes: allContentTypes,
    examBoards: allExamBoards,
    yearGroups: allYearGroups,
  } = data ?? {};

  const query = {
    term: searchQuery?.term ?? "",
    keyStages:
      allKeyStages && searchQuery?.keyStages
        ? getFilterForQuery(searchQuery?.keyStages, allKeyStages)
        : [],
    yearGroups:
      allYearGroups && searchQuery?.yearGroups
        ? getFilterForQuery(searchQuery?.yearGroups, allYearGroups)
        : [],
    subjects:
      allSubjects && searchQuery?.subjects
        ? getFilterForQuery(searchQuery?.subjects, allSubjects)
        : [],
    contentTypes:
      allContentTypes && searchQuery?.contentTypes
        ? getFilterForQuery(searchQuery?.contentTypes, allContentTypes).filter(
            (type): type is "lesson" | "unit" =>
              type === "lesson" || type === "unit",
          )
        : [],
    examBoards:
      allExamBoards && searchQuery?.examBoards
        ? getFilterForQuery(searchQuery?.examBoards, allExamBoards)
        : [],
  };

  return query;
};

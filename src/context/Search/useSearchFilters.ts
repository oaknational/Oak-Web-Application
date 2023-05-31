import { SearchPageData } from "../../node-lib/curriculum-api";

import { SearchQuery, SetSearchQuery } from "./useSearch";

export type KeyStage = SearchPageData["keyStages"][number];
export type Subject = SearchPageData["subjects"][number];
export type SearchType = {
  slug: "lesson" | "unit";
  title: "Lessons" | "Units";
};

export type UseSearchFiltersProps = {
  allKeyStages: KeyStage[];
  allSubjects: SearchPageData["subjects"];
  allSearchTypes: SearchType[];
  setQuery: SetSearchQuery;
  query: SearchQuery;
};

export type CheckBoxProps = {
  onChange: () => void;
  checked: boolean;
};

export type UseSearchFiltersReturnType = {
  subjectFilters: (Subject & CheckBoxProps)[];
  keyStageFilters: (KeyStage & CheckBoxProps)[];
  searchTypeFilters: (SearchType & CheckBoxProps)[];
};

const getCheckboxFilters = <T extends { slug: string }>(
  filterProps: T,
  filterQueryItems: string[],
  setQuery: SetSearchQuery,
  name: "keyStages" | "subjects" | "searchTypes"
) => {
  const { slug } = filterProps;
  const checked = filterQueryItems.includes(slug);
  const onChange = () => {
    const partialSearchQuery: Partial<SearchQuery> = {
      [name]: checked
        ? filterQueryItems.filter((filterItem) => filterItem !== slug)
        : [filterQueryItems, slug].flat(),
    };

    setQuery((oldQuery) => ({ ...oldQuery, ...partialSearchQuery }));
  };
  return {
    ...filterProps,
    checked,
    onChange,
  };
};

const useSearchFilters = (
  props: UseSearchFiltersProps
): UseSearchFiltersReturnType => {
  const { allKeyStages, allSubjects, allSearchTypes, query, setQuery } = props;

  const keyStageCheckboxFilters = allKeyStages.map((keyStage) => {
    const filters = getCheckboxFilters(
      keyStage,
      query.keyStages || [],
      setQuery,
      "keyStages"
    );
    return filters;
  });

  const subjectCheckboxFilters = allSubjects.map((subject) => {
    const filters = getCheckboxFilters(
      subject,
      query.subjects || [],
      setQuery,
      "subjects"
    );
    return filters;
  });

  const searchTypeCheckboxFilters = allSearchTypes.map((searchType) => {
    const filters = getCheckboxFilters(
      searchType,
      query.searchTypes || [],
      setQuery,
      "searchTypes"
    );
    return filters;
  });

  return {
    subjectFilters: subjectCheckboxFilters,
    keyStageFilters: keyStageCheckboxFilters,
    searchTypeFilters: searchTypeCheckboxFilters,
  };
};

export default useSearchFilters;

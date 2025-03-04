import {
  SetSearchQuery,
  SearchQuery,
  UseSearchFiltersProps,
  UseSearchFiltersReturnType,
} from "./search.types";

const getCheckboxFilters = <T extends { slug: string }>(
  filterProps: T,
  filterQueryItems: string[],
  setQuery: SetSearchQuery,
  name:
    | "keyStages"
    | "subjects"
    | "contentTypes"
    | "examBoards"
    | "curriculum"
    | "yearGroups",
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
  props: UseSearchFiltersProps,
): UseSearchFiltersReturnType => {
  const {
    allKeyStages,
    allYearGroups,
    allSubjects,
    allContentTypes,
    allExamBoards,
    query,
    setQuery,
  } = props;
  const legacyFilter = getCheckboxFilters(
    { slug: "new", title: "Show new only" },
    query.curriculum || [],
    setQuery,
    "curriculum",
  );

  const keyStageCheckboxFilters = allKeyStages.map((keyStage) => {
    const filters = getCheckboxFilters(
      keyStage,
      query.keyStages || [],
      setQuery,
      "keyStages",
    );
    return filters;
  });

  const yearGroupCheckboxFilters = allYearGroups.map((yearGroup) => {
    const filters = getCheckboxFilters(
      yearGroup,
      query.yearGroups || [],
      setQuery,
      "yearGroups",
    );
    return filters;
  });

  const subjectCheckboxFilters = allSubjects.map((subject) => {
    const filters = getCheckboxFilters(
      subject,
      query.subjects || [],
      setQuery,
      "subjects",
    );
    return filters;
  });

  const contentTypeCheckboxFilters = allContentTypes.map((contentType) => {
    const filters = getCheckboxFilters(
      contentType,
      query.contentTypes || [],
      setQuery,
      "contentTypes",
    );
    return filters;
  });

  const examBoardCheckboxFilters = allExamBoards?.map((examBoard) => {
    const filters = getCheckboxFilters(
      examBoard,
      query.examBoards || [],
      setQuery,
      "examBoards",
    );
    return filters;
  });

  return {
    subjectFilters: subjectCheckboxFilters,
    keyStageFilters: keyStageCheckboxFilters,
    yearGroupFilters: yearGroupCheckboxFilters,
    contentTypeFilters: contentTypeCheckboxFilters,
    examBoardFilters: examBoardCheckboxFilters,
    legacyFilter,
  };
};

export default useSearchFilters;

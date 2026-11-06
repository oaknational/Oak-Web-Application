import {
  GetSearchFiltersProps,
  GetSearchFiltersReturnType,
  SearchFilterKey,
} from "./search.types";

const buildCheckboxFilters = <
  T extends { slug: string; filterKey: SearchFilterKey },
>(
  filterProps: T,
  filterQueryItems: string[],
) => {
  const { slug } = filterProps;
  const checked = filterQueryItems.includes(slug);

  const result = {
    ...filterProps,
    checked,
  };

  return result;
};

export const getSearchFilters = (
  props: GetSearchFiltersProps,
): GetSearchFiltersReturnType => {
  const {
    allKeyStages,
    allYearGroups,
    allSubjects,
    allContentTypes,
    allExamBoards,
    query,
  } = props;

  const legacyFilter = buildCheckboxFilters(
    { slug: "new", title: "Show new only", filterKey: "curriculum" },
    query.curriculum || [],
  );

  const keyStageCheckboxFilters = allKeyStages.map((keyStage) => {
    return buildCheckboxFilters(
      { ...keyStage, filterKey: "keyStages" },
      query.keyStages || [],
    );
  });

  const yearGroupCheckboxFilters = allYearGroups.map((yearGroup) => {
    return buildCheckboxFilters(
      { ...yearGroup, filterKey: "yearGroups" },
      query.yearGroups || [],
    );
  });

  const subjectCheckboxFilters = allSubjects.map((subject) => {
    return buildCheckboxFilters(
      { ...subject, filterKey: "subjects" },
      query.subjects || [],
    );
  });

  const contentTypeCheckboxFilters = allContentTypes.map((contentType) => {
    return buildCheckboxFilters(
      { ...contentType, filterKey: "contentTypes" },
      query.contentTypes || [],
    );
  });

  const examBoardCheckboxFilters = allExamBoards?.map((examBoard) => {
    return buildCheckboxFilters(
      { ...examBoard, filterKey: "examBoards" },
      query.examBoards || [],
    );
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

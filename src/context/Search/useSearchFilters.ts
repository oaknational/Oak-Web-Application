import { SearchPageData } from "../../node-lib/curriculum-api";

import { SearchQuery, SetSearchQuery } from "./useSearch";

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

export type CheckBoxProps = {
  onChange: () => void;
  checked: boolean;
};

export type UseSearchFiltersReturnType = {
  subjectFilters: (Subject & CheckBoxProps)[];
  keyStageFilters: (KeyStage & CheckBoxProps)[];
  contentTypeFilters: (ContentType & CheckBoxProps)[];
};

const getCheckboxFilters = <T extends { slug: string }>(
  filterProps: T,
  filterQueryItems: string[],
  setQuery: SetSearchQuery,
  name: "keyStages" | "subjects" | "contentTypes"
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
  const { allKeyStages, allSubjects, allContentTypes, query, setQuery } = props;

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

  const ContentTypeCheckboxFilters = allContentTypes.map((ContentType) => {
    const filters = getCheckboxFilters(
      ContentType,
      query.contentTypes || [],
      setQuery,
      "contentTypes"
    );
    return filters;
  });

  return {
    subjectFilters: subjectCheckboxFilters,
    keyStageFilters: keyStageCheckboxFilters,
    contentTypeFilters: ContentTypeCheckboxFilters,
  };
};

export default useSearchFilters;

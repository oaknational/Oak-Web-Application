import { SearchPageData } from "../../node-lib/curriculum-api";

import { SearchQuery, SetSearchQuery } from "./useSearch";

export type KeyStage = SearchPageData["keyStages"][number];
export type Subject = SearchPageData["subjects"][number];
export type UseSearchFiltersProps = {
  allKeyStages: KeyStage[];
  allSubjects: SearchPageData["subjects"];
  setQuery: SetSearchQuery;
  query: SearchQuery;
};

type CheckBoxProps = {
  onChange: () => void;
  checked: boolean;
};

export type UseSearchFiltersReturnType = {
  subjectFilters: (Subject & CheckBoxProps)[];
  keyStageFilters: (KeyStage & CheckBoxProps)[];
};

const getCheckboxFilters = <T extends { slug: string }>(
  filterProps: T,
  searchQuery: string[],
  setQuery: SetSearchQuery,
  title: "keyStages" | "subjects"
) => {
  const { slug } = filterProps;
  const checked = searchQuery.includes(slug);
  const onChange = () => {
    const partialSearchQuery = {
      [title]: checked
        ? searchQuery.filter((filterItem) => filterItem !== slug)
        : [searchQuery, slug],
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
  const { allKeyStages, allSubjects, query, setQuery } = props;

  const keyStageCheckboxFilters = allKeyStages.map((keyStage) => {
    const filters = getCheckboxFilters(
      keyStage,
      query.keyStages,
      setQuery,
      "keyStages"
    );
    return filters;

    // const checked = getCheckedStatus(keyStage.slug, query.keyStages);
    //   const keyStages = checked
    //     ? query.keyStages.filter((ks) => ks !== slug)
    //     : [...query.keyStages, slug];
    //   setQuery((oldQuery) => ({ ...oldQuery, keyStages }));
    // // };

    // return {
    //   ...keyStage,
    //   checked,
    //   onChange,
    // };

    // const { slug } = keyStage;
    // const checked = query.keyStages.includes(slug);
    // const onChange = () => {
    //   console.log("************************", query.keyStages);
    //   const keyStages = checked
    //     ? query.keyStages.filter((ks) => ks !== slug)
    //     : [...query.keyStages, slug];
    //   setQuery((oldQuery) => ({ ...oldQuery, keyStages }));
    // };

    // return {
    //   ...keyStage,
    //   checked,
    //   onChange,
    // };
  });

  const subjectCheckboxFilters = allSubjects.map((subject) => {
    const filters = getCheckboxFilters(
      subject,
      query.subjects,
      setQuery,
      "subjects"
    );
    return filters;
    // const { slug } = subject;
    // const checked = query.subjects.includes(slug);
    // const onChange = () => {
    //   const subjects = checked
    //     ? query.subjects.filter((ks) => ks !== slug)
    //     : [...query.subjects, slug];
    //   setQuery((oldQuery) => ({ ...oldQuery, subjects }));
    // };

    // return {
    //   ...subject,
    //   checked,
    //   onChange,
    // };
  });

  return {
    subjectFilters: subjectCheckboxFilters,
    keyStageFilters: keyStageCheckboxFilters,
  };
};

export default useSearchFilters;

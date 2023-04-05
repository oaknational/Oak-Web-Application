import { SearchPageData } from "../../node-lib/curriculum-api";

import { SearchQuery, SetSearchQuery } from "./useSearch";

export type KeyStage = SearchPageData["keyStages"][number];
export type UseKeyStageFiltersProps = {
  allKeyStages: KeyStage[];
  setQuery: SetSearchQuery;
  query: SearchQuery;
};
export type UseKeyStageFiltersReturnType = (KeyStage & {
  onChange: () => void;
  checked: boolean;
})[];
const useKeyStageFilters = (
  props: UseKeyStageFiltersProps
): UseKeyStageFiltersReturnType => {
  const { allKeyStages, query, setQuery } = props;

  const filters = allKeyStages.map((keyStage) => {
    const { slug } = keyStage;
    const checked = query.keyStages.includes(slug);
    const onChange = () => {
      const keyStages = checked
        ? query.keyStages.filter((ks) => ks !== slug)
        : [...query.keyStages, slug];
      setQuery((oldQuery) => ({ ...oldQuery, keyStages }));
    };

    return {
      ...keyStage,
      checked,
      onChange,
    };
  });

  return filters;
};

export default useKeyStageFilters;

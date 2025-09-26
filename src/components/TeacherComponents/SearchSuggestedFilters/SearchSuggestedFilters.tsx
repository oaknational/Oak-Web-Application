import { FC } from "react";
import {
  OakBox,
  OakFieldset,
  OakFlex,
  OakP,
  OakSearchFilterCheckBox,
} from "@oaknational/oak-components";

import { SetSearchQuery, SearchQuery } from "@/context/Search/search.types";
import { SuggestedSearchFilter } from "@/context/Search/useSuggestedFilters";

export type SuggestedFiltersProps = {
  setQuery: SetSearchQuery;
  query: SearchQuery;
  searchFilters?: SuggestedSearchFilter[];
};

function toggleArrayValue(arr: string[] | undefined, value: string): string[] {
  const set = new Set(arr ?? []);
  if (set.has(value)) {
    set.delete(value);
  } else {
    set.add(value);
  }
  return Array.from(set);
}

// Map filter types to their corresponding query properties
const FILTER_TYPE_MAP = {
  subject: "subjects",
  "key-stage": "keyStages",
  year: "yearGroups",
  "exam-board": "examBoards",
} as const;

const SuggestedFilters: FC<SuggestedFiltersProps> = ({
  setQuery,
  query,
  searchFilters,
}) => {
  if (searchFilters === undefined || searchFilters.length === 0) {
    return null;
  }

  const getCheckedState = (item: SuggestedSearchFilter): boolean => {
    const queryProperty = FILTER_TYPE_MAP[item.type];
    return queryProperty
      ? (query[queryProperty] ?? []).includes(item.slug)
      : false;
  };

  const handleFilterChange = (item: SuggestedSearchFilter) => {
    const queryProperty = FILTER_TYPE_MAP[item.type];
    if (!queryProperty) return;

    setQuery((q) => ({
      ...q,
      [queryProperty]: toggleArrayValue(q[queryProperty], item.slug),
    }));
  };

  return (
    <OakBox
      $mb="space-between-m2"
      $bb={"border-solid-s"}
      $borderColor={"grey40"}
    >
      <OakFieldset>
        <OakP as={"legend"} $mb="space-between-m" $font={"heading-7"}>
          Suggested filters
        </OakP>
        <OakFlex
          $gap={"space-between-xs"}
          $mb="space-between-m2"
          $flexDirection={"row"}
          $flexWrap={"wrap"}
        >
          {searchFilters.map((item) => {
            const checked = getCheckedState(item);
            const id = `ai-suggested-${item.type}-${item.slug}`;

            return (
              <OakSearchFilterCheckBox
                key={id}
                id={id}
                name={`ai-${item.type}-suggested-filters`}
                aria-label={`${item.value} suggested filter`}
                displayValue={item.value}
                checked={checked}
                onChange={() => handleFilterChange(item)}
                value={"Suggested filter"}
              />
            );
          })}
        </OakFlex>
      </OakFieldset>
    </OakBox>
  );
};

export default SuggestedFilters;

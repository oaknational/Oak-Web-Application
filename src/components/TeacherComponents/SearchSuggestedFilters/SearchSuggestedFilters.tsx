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

const SuggestedFilters: FC<SuggestedFiltersProps> = ({
  setQuery,
  query,
  searchFilters,
}) => {
  if (searchFilters === undefined || searchFilters.length === 0) {
    return null;
  }

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
            const getCheckedState = () => {
              switch (item.type) {
                case "subject":
                  return (query.subjects ?? []).includes(item.slug);
                case "key-stage":
                  return (query.keyStages ?? []).includes(item.slug);
                case "year":
                  return (query.yearGroups ?? []).includes(item.slug);
                case "exam-board":
                  return (query.examBoards ?? []).includes(item.slug);
                default:
                  return false;
              }
            };

            const checked = getCheckedState();
            const id = `ai-suggested-${item.type}-${item.slug}`;

            return (
              <OakSearchFilterCheckBox
                key={id}
                id={id}
                name={`ai-${item.type}-filters`}
                aria-label={`${item.value} filter`}
                displayValue={item.value}
                checked={checked}
                onChange={() => {
                  switch (item.type) {
                    case "subject":
                      setQuery((q) => ({
                        ...q,
                        subjects: toggleArrayValue(q.subjects, item.slug),
                      }));
                      break;
                    case "key-stage":
                      setQuery((q) => ({
                        ...q,
                        keyStages: toggleArrayValue(q.keyStages, item.slug),
                      }));
                      break;
                    case "year":
                      setQuery((q) => ({
                        ...q,
                        yearGroups: toggleArrayValue(q.yearGroups, item.slug),
                      }));
                      break;
                    case "exam-board":
                      setQuery((q) => ({
                        ...q,
                        examBoards: toggleArrayValue(q.examBoards, item.slug),
                      }));
                      break;
                  }
                }}
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

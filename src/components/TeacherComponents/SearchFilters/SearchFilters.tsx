import { FC } from "react";
import {
  OakP,
  OakFlex,
  OakSearchFilterCheckBox,
  OakSearchFilterCheckBoxProps,
  oakDefaultTheme,
  OakThemeProvider,
  isValidIconName,
  OakBox,
} from "@oaknational/oak-components";

import { UseSearchFiltersReturnType } from "@/context/Search/search.types";
import { FilterTypeValueType } from "@/browser-lib/avo/Avo";
import { toSentenceCase } from "@/node-lib/curriculum-api-2023/helpers";

type SearchFiltersProps = {
  searchRefined: (filterType: FilterTypeValueType, filterValue: string) => void;
} & UseSearchFiltersReturnType;

const SearchFilters: FC<SearchFiltersProps> = (props) => {
  const { keyStageFilters, subjectFilters, examBoardFilters, searchRefined } =
    props;

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakBox>
        <OakBox
          $mb="space-between-m2"
          $bb={"border-solid-s"}
          $borderColor={"grey40"}
          $mt={["space-between-l", null]}
        >
          <OakP $mb="space-between-m" $font={"heading-7"}>
            Key stages
          </OakP>
          <OakFlex
            $gap={"space-between-xs"}
            $mb="space-between-m2"
            $flexDirection={"row"}
            $flexWrap={"wrap"}
          >
            {keyStageFilters.map((keyStageFilter) => (
              <OakSearchFilterCheckBox
                name={"keyStageFilters"}
                displayValue={
                  keyStageFilter.shortCode === "EYFS"
                    ? keyStageFilter.shortCode
                    : toSentenceCase(keyStageFilter.title)
                }
                key={`search-filters-keyStage-${keyStageFilter.slug}`}
                id={`search-filters-keyStage-${keyStageFilter.slug}`}
                value="Key stage filter"
                aria-label={`${keyStageFilter.title} filter`}
                {...keyStageFilter}
                onChange={() => {
                  keyStageFilter.onChange();
                  searchRefined("Key stage filter", keyStageFilter.title);
                }}
              />
            ))}
          </OakFlex>
        </OakBox>
        <OakBox
          $mb="space-between-m2"
          $bb={"border-solid-s"}
          $borderColor={"grey40"}
        >
          <OakP $mb="space-between-m" $font={"heading-7"}>
            Exam boards
          </OakP>
          <OakFlex
            $gap={"space-between-xs"}
            $mb="space-between-m2"
            $flexWrap={"wrap"}
          >
            {examBoardFilters.map((examBoardFilter) => (
              <OakSearchFilterCheckBox
                value={"examBoardFilters"}
                key={`search-filters-examBoard-${examBoardFilter.slug}`}
                displayValue={examBoardFilter.title}
                id={`search-filters-examBoard-${examBoardFilter.slug}`}
                aria-label={`${examBoardFilter.title} filter`}
                {...examBoardFilter}
                onChange={() => {
                  examBoardFilter.onChange();
                  searchRefined("Subject filter", examBoardFilter.title);
                }}
              />
            ))}
          </OakFlex>
        </OakBox>
        <OakBox $bb={"border-solid-s"} $borderColor={"grey40"}>
          <OakP $mb="space-between-m" $font={"heading-7"}>
            Subjects
          </OakP>
          <OakFlex $gap={"space-between-xs"} $flexWrap={"wrap"}>
            {subjectFilters.map((subjectFilter) => {
              const icon = isValidIconName(`subject-${subjectFilter.slug}`)
                ? (`subject-${subjectFilter.slug}` as OakSearchFilterCheckBoxProps["icon"])
                : undefined;

              return (
                <OakSearchFilterCheckBox
                  value={"subjectFilters"}
                  key={`search-filters-subject-${subjectFilter.slug}`}
                  id={`search-filters-subject-${subjectFilter.slug}`}
                  displayValue={subjectFilter.title}
                  icon={icon}
                  aria-label={`${subjectFilter.title} filter`}
                  {...subjectFilter}
                  onChange={() => {
                    subjectFilter.onChange();
                    searchRefined("Subject filter", subjectFilter.title);
                  }}
                />
              );
            })}
          </OakFlex>
        </OakBox>
      </OakBox>
    </OakThemeProvider>
  );
};

export default SearchFilters;

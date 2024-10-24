import { FC } from "react";
import {
  OakP,
  OakFlex,
  OakSearchFilterCheckBox,
  oakDefaultTheme,
  OakThemeProvider,
  OakBox,
  OakFieldset,
} from "@oaknational/oak-components";

import { UseSearchFiltersReturnType } from "@/context/Search/search.types";
import { toSentenceCase } from "@/node-lib/curriculum-api-2023/helpers";
import TagPromotional from "@/components/SharedComponents/TagPromotional";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";

type SearchFiltersProps = UseSearchFiltersReturnType & {
  isMobileFilter?: boolean;
};

const SearchFilters: FC<SearchFiltersProps> = (props) => {
  const {
    keyStageFilters,
    yearGroupFilters,
    subjectFilters,
    examBoardFilters,
    isMobileFilter,
    legacyFilter,
  } = props;

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakBox
        $mb="space-between-m2"
        $bb={"border-solid-s"}
        $borderColor={"grey40"}
      >
        <OakFieldset>
          <OakP as={"legend"} $mb="space-between-m" $font={"heading-7"}>
            Curriculum
          </OakP>
          <OakFlex
            $gap={"space-between-s"}
            $mb="space-between-m2"
            $flexDirection={"column"}
            $flexWrap={"wrap"}
          >
            <OakSearchFilterCheckBox
              name={"new"}
              displayValue={"Show new only"}
              key={`search-filters-curriculum-filter`}
              aria-label={`Show new content filter`}
              {...legacyFilter}
              id={`search-filters-showNewContent:mobile:${isMobileFilter}`}
              value="new"
              onChange={() => {
                legacyFilter.onChange();
              }}
            />
            <OakFlex $alignItems={"flex-start"}>
              <OakBox>
                <TagPromotional size={"small"} />
              </OakBox>
              <OakP
                $font={"body-3"}
                $wordWrap={"normal"}
                $color={"text-subdued"}
              >
                Resources designed for the classroom
              </OakP>
            </OakFlex>
          </OakFlex>
        </OakFieldset>
      </OakBox>
      <OakBox
        $mb="space-between-m2"
        $bb={"border-solid-s"}
        $borderColor={"grey40"}
      >
        <OakFieldset>
          <OakP as={"legend"} $mb="space-between-m" $font={"heading-7"}>
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
                aria-label={`${keyStageFilter.title} filter`}
                id={`search-filters-keyStage-${keyStageFilter.slug}:mobile:${isMobileFilter}`}
                value="Key stage filter"
                {...keyStageFilter}
                onChange={() => {
                  keyStageFilter.onChange();
                }}
              />
            ))}
          </OakFlex>
        </OakFieldset>
      </OakBox>
      <OakBox
        $mb="space-between-m2"
        $bb={"border-solid-s"}
        $borderColor={"grey40"}
      >
        <OakFieldset>
          <OakP as={"legend"} $mb="space-between-m" $font={"heading-7"}>
            Years
          </OakP>
          <OakFlex
            $gap={"space-between-xs"}
            $mb="space-between-m2"
            $flexDirection={"row"}
            $flexWrap={"wrap"}
          >
            {yearGroupFilters.map((yearGroupFilter) => (
              <OakSearchFilterCheckBox
                name={"yearGroupFilters"}
                displayValue={yearGroupFilter.title}
                key={`search-filters-yearGroup-${yearGroupFilter.slug}`}
                aria-label={`${yearGroupFilter.title} filter`}
                id={`search-filters-keyStage-${yearGroupFilter.slug}:mobile:${isMobileFilter}`}
                value="Year group filter"
                {...yearGroupFilter}
                onChange={() => {
                  yearGroupFilter.onChange();
                }}
              />
            ))}
          </OakFlex>
        </OakFieldset>
      </OakBox>
      <OakBox
        $mb="space-between-m2"
        $bb={"border-solid-s"}
        $borderColor={"grey40"}
      >
        <OakFieldset>
          <OakP as={"legend"} $mb="space-between-m" $font={"heading-7"}>
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
                aria-label={`${examBoardFilter.title} filter`}
                displayValue={examBoardFilter.title}
                id={`search-filters-examBoard-${examBoardFilter.slug}:mobile:${isMobileFilter}`}
                {...examBoardFilter}
                onChange={() => {
                  examBoardFilter.onChange();
                }}
              />
            ))}
          </OakFlex>
        </OakFieldset>
      </OakBox>
      <OakBox>
        <OakFieldset>
          <OakP as={"legend"} $mb="space-between-m" $font={"heading-7"}>
            Subjects
          </OakP>
          <OakFlex $gap={"space-between-xs"} $flexWrap={"wrap"}>
            {subjectFilters.map((subjectFilter) => {
              return (
                <OakSearchFilterCheckBox
                  value={"subjectFilters"}
                  key={`search-filters-subject-${subjectFilter.slug}`}
                  aria-label={`${subjectFilter.title} filter`}
                  id={`search-filters-subject-${subjectFilter.slug}:mobile:${isMobileFilter}`}
                  displayValue={subjectFilter.title}
                  icon={getValidSubjectIconName(subjectFilter.slug)}
                  {...subjectFilter}
                  onChange={() => {
                    subjectFilter.onChange();
                  }}
                />
              );
            })}
          </OakFlex>
        </OakFieldset>
      </OakBox>
    </OakThemeProvider>
  );
};

export default SearchFilters;

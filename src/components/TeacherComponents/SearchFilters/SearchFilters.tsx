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
import styled from "styled-components";

import { UseSearchFiltersReturnType } from "@/context/Search/search.types";
import { toSentenceCase } from "@/node-lib/curriculum-api-2023/helpers";
import TagPromotional from "@/components/SharedComponents/TagPromotional";

type SearchFiltersProps = UseSearchFiltersReturnType & {
  isMobileFilter?: boolean;
};

const StyledFieldset = styled.fieldset`
  border: 0px;
  margin: 0;
  padding: 0;
`;

const SearchFilters: FC<SearchFiltersProps> = (props) => {
  const {
    keyStageFilters,
    subjectFilters,
    examBoardFilters,
    isMobileFilter,
    legacyFilter,
  } = props;

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakBox>
        <StyledFieldset>
          <OakBox
            $mb="space-between-m2"
            $bb={"border-solid-s"}
            $borderColor={"grey40"}
          >
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
          </OakBox>
        </StyledFieldset>
        <OakBox
          $mb="space-between-m2"
          $bb={"border-solid-s"}
          $borderColor={"grey40"}
        >
          <StyledFieldset>
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
          </StyledFieldset>
        </OakBox>
        <OakBox
          $mb="space-between-m2"
          $bb={"border-solid-s"}
          $borderColor={"grey40"}
        >
          <StyledFieldset>
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
          </StyledFieldset>
        </OakBox>
        <OakBox>
          <StyledFieldset>
            <OakP as={"legend"} $mb="space-between-m" $font={"heading-7"}>
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
                    aria-label={`${subjectFilter.title} filter`}
                    id={`search-filters-subject-${subjectFilter.slug}:mobile:${isMobileFilter}`}
                    displayValue={subjectFilter.title}
                    icon={icon}
                    {...subjectFilter}
                    onChange={() => {
                      subjectFilter.onChange();
                    }}
                  />
                );
              })}
            </OakFlex>
          </StyledFieldset>
        </OakBox>
      </OakBox>
    </OakThemeProvider>
  );
};

export default SearchFilters;

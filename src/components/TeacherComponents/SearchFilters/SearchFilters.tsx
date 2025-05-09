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

import {
  ExamBoard,
  SearchCheckBoxProps,
  Subject,
  UseSearchFiltersReturnType,
  YearGroup,
} from "@/context/Search/search.types";
import { toSentenceCase } from "@/node-lib/curriculum-api-2023/helpers";
import TagPromotional from "@/components/SharedComponents/TagPromotional";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import { TrackSearchModifiedProps } from "@/components/TeacherViews/Search/helpers";
import { FilterTypeValueType } from "@/browser-lib/avo/Avo";

type SearchFiltersProps = UseSearchFiltersReturnType & {
  isMobileFilter?: boolean;
  trackSearchModified: (props: TrackSearchModifiedProps) => void;
};

const renderFilterSection = (
  title: string,
  filters: ((ExamBoard | YearGroup | Subject) & SearchCheckBoxProps)[],
  hasIcon: boolean,
  isLast: boolean,
  trackSeachModified: (props: TrackSearchModifiedProps) => void,
  filterType: FilterTypeValueType,
  isMobileFilter?: boolean,
) => (
  <OakBox
    $mb="space-between-m2"
    $bb={!isLast ? "border-solid-s" : null}
    $borderColor={!isLast ? "grey40" : null}
  >
    <OakFieldset>
      <OakP as={"legend"} $mb="space-between-m" $font={"heading-7"}>
        {title}
      </OakP>
      <OakFlex
        $gap={"space-between-xs"}
        $mb="space-between-m2"
        $flexDirection={"row"}
        $flexWrap={"wrap"}
      >
        {filters.map((filter) => (
          <OakSearchFilterCheckBox
            name={`${title.toLowerCase()}Filters`}
            displayValue={filter.title}
            key={`search-filters-${title.toLowerCase()}-${filter.slug}`}
            aria-label={`${filter.title} filter`}
            id={`search-filters-${title.toLowerCase()}-${
              filter.slug
            }:mobile:${isMobileFilter}`}
            value={`${title} filter`}
            {...filter}
            icon={hasIcon ? getValidSubjectIconName(filter.slug) : undefined}
            onChange={() => {
              trackSeachModified({
                checked: filter.checked,
                filterType,
                filterValue: filter.title,
              });
              filter.onChange();
            }}
          />
        ))}
      </OakFlex>
    </OakFieldset>
  </OakBox>
);

const SearchFilters: FC<SearchFiltersProps> = (props) => {
  const {
    keyStageFilters,
    yearGroupFilters,
    subjectFilters,
    examBoardFilters,
    isMobileFilter,
    legacyFilter,
    trackSearchModified,
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
                trackSearchModified({
                  checked: legacyFilter.checked,
                  filterType: "Lesson Cohort filter",
                  filterValue: "2023-2026",
                });
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
                checked={keyStageFilter.checked}
                onChange={() => {
                  trackSearchModified({
                    checked: keyStageFilter.checked,
                    filterType: "Key stage filter",
                    filterValue: keyStageFilter.title,
                  });
                  keyStageFilter.onChange();
                }}
              />
            ))}
          </OakFlex>
        </OakFieldset>
      </OakBox>
      <>
        {renderFilterSection(
          "Years",
          yearGroupFilters,
          false,
          false,
          trackSearchModified,
          "Year filter",
          isMobileFilter,
        )}
        {renderFilterSection(
          "Exam Boards",
          examBoardFilters,
          false,
          false,
          trackSearchModified,
          "Exam board filter",
          isMobileFilter,
        )}
        {renderFilterSection(
          "Subjects",
          subjectFilters,
          false,
          true,
          trackSearchModified,
          "Subject filter",
          isMobileFilter,
        )}
      </>
    </OakThemeProvider>
  );
};

export default SearchFilters;

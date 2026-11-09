import { title } from "process";

import { FC } from "react";
import {
  OakP,
  OakFlex,
  OakSearchFilterCheckBox,
  OakBox,
  OakFieldset,
} from "@oaknational/oak-components";

import {
  ExamBoard,
  GetSearchFiltersReturnType,
  SearchCheckBoxProps,
  SearchFilterKey,
  Subject,
  YearGroup,
} from "@/context/Search/search.types";
import { toSentenceCase } from "@/node-lib/curriculum-api-2023/helpers";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import { TrackSearchModifiedProps } from "@/app/(core)/teachers/search/helpers/index";
import { FilterTypeValueType } from "@/browser-lib/avo/Avo";
import { useUpdateSearchQuery } from "@/app/(core)/teachers/search/helpers/updateSearchQuery";

type SearchFiltersProps = GetSearchFiltersReturnType & {
  isMobileFilter?: boolean;
  trackSearchModified: (props: TrackSearchModifiedProps) => void;
};

const renderFilterSection = ({
  isLast,
  filterKey,
  filterType,
  filters,
  hasIcon,
  trackSeachModified,
  isMobileFilter,
  updateSearchFilters,
}: {
  title: string;
  filterKey: SearchFilterKey;
  filters: ((ExamBoard | YearGroup | Subject) & SearchCheckBoxProps)[];
  hasIcon: boolean;
  isLast: boolean;
  trackSeachModified: (props: TrackSearchModifiedProps) => void;
  filterType: FilterTypeValueType;
  updateSearchFilters: (props: {
    filterSlug: string;
    filterType: SearchFilterKey;
  }) => void;
  isMobileFilter?: boolean;
}) => (
  <OakBox
    $mb="spacing-32"
    $bb={!isLast ? "border-solid-s" : null}
    $borderColor={!isLast ? "border-neutral-lighter" : null}
  >
    <OakFieldset>
      <OakP as={"legend"} $mb="spacing-24" $font={"heading-7"}>
        {title}
      </OakP>
      <OakFlex
        $gap={"spacing-12"}
        $mb="spacing-32"
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
            checked={filter.checked}
            icon={hasIcon ? getValidSubjectIconName(filter.slug) : undefined}
            onChange={() => {
              trackSeachModified({
                checked: filter.checked,
                filterType,
                filterValue: filter.title,
                searchFilterMatchType: "default",
              });
              updateSearchFilters({
                filterSlug: filter.slug,
                filterType: filterKey,
              });
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
    trackSearchModified,
  } = props;

  const { updateSearchFilters } = useUpdateSearchQuery();

  return (
    <>
      <OakBox
        $mb="spacing-32"
        $bb={"border-solid-s"}
        $borderColor={"border-neutral-lighter"}
      >
        <OakFieldset>
          <OakP as={"legend"} $mb="spacing-24" $font={"heading-7"}>
            Key stages
          </OakP>
          <OakFlex
            $gap={"spacing-12"}
            $mb="spacing-32"
            $flexDirection={"row"}
            $flexWrap={"wrap"}
          >
            {keyStageFilters.map((keyStageFilter) => (
              <OakSearchFilterCheckBox
                name={"keyStageFilters"}
                displayValue={toSentenceCase(keyStageFilter.title)}
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
                    searchFilterMatchType: "default",
                  });
                  updateSearchFilters({
                    filterType: "keyStages",
                    filterSlug: keyStageFilter.slug,
                  });
                }}
              />
            ))}
          </OakFlex>
        </OakFieldset>
      </OakBox>
      <>
        {renderFilterSection({
          title: "Years",
          filterKey: "yearGroups",
          filters: yearGroupFilters,
          hasIcon: false,
          isLast: false,
          trackSeachModified: trackSearchModified,
          filterType: "Year filter",
          updateSearchFilters,
          isMobileFilter,
        })}
        {renderFilterSection({
          title: "Exam Boards",
          filterKey: "examBoards",
          filters: examBoardFilters,
          hasIcon: false,
          isLast: false,
          trackSeachModified: trackSearchModified,
          filterType: "Exam board filter",
          updateSearchFilters,
          isMobileFilter,
        })}
        {renderFilterSection({
          title: "Subjects",
          filterKey: "subjects",
          filters: subjectFilters,
          hasIcon: true,
          isLast: true,
          trackSeachModified: trackSearchModified,
          filterType: "Subject filter",
          updateSearchFilters,
          isMobileFilter,
        })}
      </>
    </>
  );
};

export default SearchFilters;

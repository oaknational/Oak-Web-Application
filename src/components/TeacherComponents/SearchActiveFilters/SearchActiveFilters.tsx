import { FC } from "react";
import {
  OakSpan,
  OakFlex,
  OakSmallTertiaryInvertedButton,
} from "@oaknational/oak-components";

import { GetSearchFiltersReturnType } from "@/context/Search/search.types";
import {
  getFilterType,
  TrackSearchModifiedProps,
} from "@/app/(core)/teachers/search/helpers/index";
import { useUpdateSearchQuery } from "@/app/(core)/teachers/search/helpers/updateSearchQuery";

type SearchActiveFiltersProps = {
  searchFilters: GetSearchFiltersReturnType;
  trackSearchModified: (props: TrackSearchModifiedProps) => void;
};

const SearchActiveFilters: FC<SearchActiveFiltersProps> = (props) => {
  const { searchFilters, trackSearchModified } = props;
  const { updateSearchFilters } = useUpdateSearchQuery();
  const {
    keyStageFilters,
    subjectFilters,
    contentTypeFilters,
    yearGroupFilters,
    examBoardFilters,
    legacyFilter,
  } = searchFilters;

  const activeFilters = [
    ...keyStageFilters.filter((keyStage) => keyStage.checked),
    ...yearGroupFilters.filter((yearGroup) => yearGroup.checked),
    ...subjectFilters.filter((subject) => subject.checked),
    ...contentTypeFilters.filter((contentType) => contentType.checked),
    ...examBoardFilters.filter((examBoard) => examBoard.checked),
    ...[legacyFilter].filter((legacy) => legacy.checked),
  ];

  const maxActiveFilters = 4;
  const slicedActiveFilters = activeFilters.slice(0, maxActiveFilters);

  return (
    <OakFlex
      $alignItems={"center"}
      $flexDirection={"row"}
      $alignContent={"center"}
      $display={activeFilters.length ? "flex" : "none"}
    >
      <OakSpan $font="heading-light-7" $mr="spacing-16">
        Active filters:
      </OakSpan>
      <OakFlex $flexWrap={"wrap"} $alignItems={"center"}>
        {slicedActiveFilters.map(({ slug, title, filterKey, ...props }) => (
          <OakSmallTertiaryInvertedButton
            $mr={["spacing-0", "spacing-12", "spacing-12"]}
            aria-label={`Remove ${title} filter`}
            key={`active-filter-${title}-${slug}`}
            onClick={() => {
              trackSearchModified({
                checked: true,
                filterType: getFilterType(slug),
                filterValue: title,
                searchFilterMatchType: "default",
              });
              updateSearchFilters({ filterType: filterKey, filterSlug: slug });
            }}
            iconName="cross"
            $font={"heading-7"}
            isTrailingIcon
          >
            {"shortCode" in props ? (props.shortCode as string) : title}{" "}
          </OakSmallTertiaryInvertedButton>
        ))}
        {activeFilters.length > maxActiveFilters && (
          <OakSpan $font="body-1-bold">...</OakSpan>
        )}
      </OakFlex>
    </OakFlex>
  );
};

export default SearchActiveFilters;

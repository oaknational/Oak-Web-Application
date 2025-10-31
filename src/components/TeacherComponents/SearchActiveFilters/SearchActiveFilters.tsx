import { FC } from "react";
import {
  OakSpan,
  OakFlex,
  OakSmallTertiaryInvertedButton,
} from "@oaknational/oak-components";

import {
  UseSearchFiltersReturnType,
  KeyStage,
  Subject,
  ContentType,
  SearchCheckBoxProps,
} from "@/context/Search/search.types";
import {
  getFilterType,
  TrackSearchModifiedProps,
} from "@/components/TeacherViews/Search/helpers";

type SearchActiveFiltersProps = {
  searchFilters: UseSearchFiltersReturnType;
  trackSearchModified: (props: TrackSearchModifiedProps) => void;
};

const SearchActiveFilters: FC<SearchActiveFiltersProps> = (props) => {
  const { searchFilters, trackSearchModified } = props;
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
  const slicedActiveFilters: ((
    | Subject
    | KeyStage
    | ContentType
    | { slug: string; title: string }
  ) &
    SearchCheckBoxProps)[] = activeFilters.slice(0, maxActiveFilters);

  return (
    <OakFlex
      $alignItems={"center"}
      $flexDirection={"row"}
      $alignContent={"center"}
      $display={activeFilters.length ? "flex" : "none"}
    >
      <OakSpan $font="heading-light-7" $mr="space-between-s">
        Active filters:
      </OakSpan>
      <OakFlex $flexWrap={"wrap"} $alignItems={"center"}>
        {slicedActiveFilters.map(({ slug, title, onChange, ...props }) => (
          <OakSmallTertiaryInvertedButton
            $mr={["space-between-none", "space-between-xs", "space-between-xs"]}
            aria-label={`Remove ${title} filter`}
            key={`active-filter-${title}-${slug}`}
            onClick={() => {
              trackSearchModified({
                checked: true,
                filterType: getFilterType(slug),
                filterValue: title,
                searchFilterMatchType: "default",
              });
              onChange();
            }}
            iconName="cross"
            $font={"heading-7"}
            isTrailingIcon
          >
            {"shortCode" in props ? props.shortCode : title}
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

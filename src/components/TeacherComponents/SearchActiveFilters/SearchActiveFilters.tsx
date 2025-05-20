import { FC } from "react";
import { OakSpan, OakFlex } from "@oaknational/oak-components";
import {
  examboardSlugs,
  keystageSlugs,
  subjectSlugs,
  yearSlugs,
} from "@oaknational/oak-curriculum-schema";

import Button from "@/components/SharedComponents/Button";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import {
  UseSearchFiltersReturnType,
  KeyStage,
  Subject,
  ContentType,
  SearchCheckBoxProps,
} from "@/context/Search/search.types";
import { TrackSearchModifiedProps } from "@/components/TeacherViews/Search/helpers";
import { FilterTypeValueType } from "@/browser-lib/avo/Avo";

type SearchActiveFiltersProps = {
  searchFilters: UseSearchFiltersReturnType;
  trackSearchModified: (props: TrackSearchModifiedProps) => void;
};

const getFilterType = (slug: string) => {
  const isKeystageFilter = keystageSlugs.safeParse(slug).success;
  const isYearFilter = yearSlugs.safeParse(slug).success;
  const isSubjectFilter = subjectSlugs.safeParse(slug).success;
  const isContentTypeFilter = slug === "lesson" || slug === "unit";
  const isExamBoardFilter = examboardSlugs.safeParse(slug).success;

  if (isKeystageFilter) {
    return "Key stage filter" as FilterTypeValueType;
  } else if (isYearFilter) {
    return "Year filter" as FilterTypeValueType;
  } else if (isSubjectFilter) {
    return "Subject filter" as FilterTypeValueType;
  } else if (isContentTypeFilter) {
    return "Content type filter" as FilterTypeValueType;
  } else if (isExamBoardFilter) {
    return "Exam board filter" as FilterTypeValueType;
  } else if (slug === "new") {
    return "Lesson Cohort filter" as FilterTypeValueType;
  } else {
    return "Unknown filter" as FilterTypeValueType;
  }
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
    <Flex
      $alignItems={["flex-start", "center"]}
      $flexDirection={["column", "row"]}
      $minHeight={44}
      $display={activeFilters.length ? "flex" : "none"}
    >
      <OakSpan $font="heading-light-7" $mr="space-between-s">
        Active filters:
      </OakSpan>
      <OakFlex $flexWrap={"wrap"} $alignItems={"center"}>
        {slicedActiveFilters.map(({ slug, title, onChange, ...props }) => (
          <Button
            label={"shortCode" in props ? props.shortCode : title}
            aria-label={`Remove ${title} filter`}
            key={`active-filter-${title}-${slug}`}
            onClick={() => {
              trackSearchModified({
                checked: true,
                filterType: getFilterType(slug),
                filterValue: title,
              });
              onChange();
            }}
            variant="buttonStyledAsLink"
            icon="cross"
            $font={"heading-7"}
            $color={"grey70"}
            $iconPosition="trailing"
            $mr={16}
          />
        ))}
        {activeFilters.length > maxActiveFilters && (
          <OakSpan $font="body-1-bold">...</OakSpan>
        )}
      </OakFlex>
    </Flex>
  );
};

export default SearchActiveFilters;

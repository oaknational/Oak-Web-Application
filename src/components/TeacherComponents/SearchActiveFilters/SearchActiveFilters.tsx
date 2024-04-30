import { FC } from "react";
import { OakSpan, OakFlex } from "@oaknational/oak-components";

import Button from "@/components/SharedComponents/Button";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import {
  UseSearchFiltersReturnType,
  KeyStage,
  Subject,
  ContentType,
  SearchCheckBoxProps,
} from "@/context/Search/search.types";

type SearchActiveFiltersProps = {
  searchFilters: UseSearchFiltersReturnType;
};
const SearchActiveFilters: FC<SearchActiveFiltersProps> = (props) => {
  const { searchFilters } = props;
  const {
    keyStageFilters,
    subjectFilters,
    contentTypeFilters,
    examBoardFilters,
  } = searchFilters;

  const activeFilters = [
    ...keyStageFilters.filter((keyStage) => keyStage.checked),
    ...subjectFilters.filter((subject) => subject.checked),
    ...contentTypeFilters.filter((contentType) => contentType.checked),
    ...examBoardFilters.filter((examBoard) => examBoard.checked),
  ];

  const maxActiveFilters = 4;
  const slicedActiveFilters: ((Subject | KeyStage | ContentType) &
    SearchCheckBoxProps)[] = activeFilters.slice(0, maxActiveFilters);

  return (
    <Flex
      $alignItems={["flex-start", "center"]}
      $flexDirection={["column", "row"]}
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
            onClick={onChange}
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

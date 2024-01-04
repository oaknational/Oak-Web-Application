import { FC } from "react";

import Button from "../Button";
import { Span } from "../Typography";

import Flex from "@/components/SharedComponents/Flex";
import {
  UseSearchFiltersReturnType,
  KeyStage,
  Subject,
  ContentType,
  SearchCheckBoxProps,
} from "@/context/Search/search.types";

type ActiveFiltersProps = {
  searchFilters: UseSearchFiltersReturnType;
};
const ActiveFilters: FC<ActiveFiltersProps> = (props) => {
  const { searchFilters } = props;
  const { keyStageFilters, subjectFilters, contentTypeFilters } = searchFilters;

  const activeFilters = [
    ...keyStageFilters.filter((keyStage) => keyStage.checked),
    ...subjectFilters.filter((subject) => subject.checked),
    ...contentTypeFilters.filter((contentType) => contentType.checked),
  ];

  const maxActiveFilters = 4;
  const slicedActiveFilters: ((Subject | KeyStage | ContentType) &
    SearchCheckBoxProps)[] = activeFilters.slice(0, maxActiveFilters);

  return (
    <Flex
      $alignItems={["flex-start", "center"]}
      $flexDirection={["column", "row"]}
      $minHeight={44}
      $display={activeFilters.length ? "flex" : "none"}
    >
      <Flex $flexWrap={"wrap"} $alignItems={"center"}>
        {slicedActiveFilters.map(({ slug, title, onChange, ...props }) => (
          <Button
            label={"shortCode" in props ? props.shortCode : title}
            aria-label={`Remove ${title} filter`}
            key={`active-filter-${title}-${slug}`}
            onClick={onChange}
            variant="buttonStyledAsLink"
            icon="cross"
            $iconPosition="trailing"
            $mr={16}
          />
        ))}
        {activeFilters.length > maxActiveFilters && (
          <Span $font="body-1-bold">...</Span>
        )}
      </Flex>
    </Flex>
  );
};

export default ActiveFilters;

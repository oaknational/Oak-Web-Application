import { FC } from "react";

import { P } from "../Typography";

import SearchFilterCheckbox from "./SearchFilterCheckbox";

import Flex from "@/components/SharedComponents/Flex";
import { UseSearchFiltersReturnType } from "@/context/Search/search.types";

const SearchFilters: FC<UseSearchFiltersReturnType> = (props) => {
  const { keyStageFilters, subjectFilters, contentTypeFilters } = props;
  return (
    <>
      <P $mb={16} $font={"heading-7"}>
        Type
      </P>
      <Flex $mb={36} $flexWrap={"wrap"}>
        {contentTypeFilters.map((contentType) => (
          <SearchFilterCheckbox
            name={"typeFilters"}
            label={contentType.title}
            key={`search-filters-type-${contentType.slug}`}
            width={"50%"}
            {...contentType}
          />
        ))}
      </Flex>
      <P $mb={16} $font={"heading-7"}>
        Key stage
      </P>
      <Flex $mb={36} $flexDirection={"row"} $flexWrap={"wrap"}>
        {keyStageFilters.map((keyStageFilter) => (
          <SearchFilterCheckbox
            name={"keyStageFilters"}
            label={keyStageFilter.shortCode}
            key={`search-filters-keyStage-${keyStageFilter.slug}`}
            {...keyStageFilter}
          />
        ))}
      </Flex>
      <P $mb={16} $font={"heading-7"}>
        Subjects
      </P>
      <Flex $flexDirection={"column"}>
        {subjectFilters.map((subjectFilter) => (
          <SearchFilterCheckbox
            width={"100%"}
            name={"subjectFilters"}
            label={subjectFilter.title}
            key={`search-filters-subject-${subjectFilter.slug}`}
            {...subjectFilter}
          />
        ))}
      </Flex>
    </>
  );
};

export default SearchFilters;

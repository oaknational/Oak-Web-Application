import { FC } from "react";

import { UseSearchFiltersReturnType } from "../../context/Search/useSearchFilters";
import Flex from "../Flex";
import { P } from "../Typography";

import SearchFilterCheckbox from "./SearchFilterCheckbox";

const SearchFilters: FC<UseSearchFiltersReturnType> = (props) => {
  const { keyStageFilters, subjectFilters } = props;

  return (
    <>
      <P $mb={16}>Key stage</P>
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
      <P $mb={16}>Subjects</P>
      <Flex $flexDirection={"column"}>
        {subjectFilters.map((subjectFilter) => (
          <SearchFilterCheckbox
            width={"100%"}
            name={"keyStageFilters"}
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

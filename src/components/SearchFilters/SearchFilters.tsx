import { FC } from "react";

import { UseSearchFiltersReturnType } from "../../context/Search/useSearchFilters";
import Flex from "../Flex";
import { P } from "../Typography";

import SearchFilterCheckbox from "./SearchFilterCheckbox";

type SearchFiltersProps = {
  searchFilters: UseSearchFiltersReturnType;
};
const SearchFilters: FC<SearchFiltersProps> = (props) => {
  const { searchFilters } = props;
  const { keyStageFilters, subjectFilters } = searchFilters;

  return (
    <>
      <P $mb={16}>Key stage</P>
      <Flex $flexDirection={"row"} $flexWrap={"wrap"}>
        {keyStageFilters.map((keyStageFilter) => (
          <SearchFilterCheckbox
            name={"keyStageFilters"}
            label={keyStageFilter.shortCode}
            key={`search-filters-keystage-${keyStageFilter.slug}`}
            {...keyStageFilter}
          />
        ))}
      </Flex>
      <P $mb={16}>Subjects</P>
      <Flex $flexDirection={"row"} $flexWrap={"wrap"}>
        {subjectFilters.map((subjectFilter) => (
          <SearchFilterCheckbox
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

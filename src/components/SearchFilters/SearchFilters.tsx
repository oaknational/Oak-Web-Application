import { FC } from "react";

import KeyStageFilter from "../SearchFilters/KeyStageFilter";
import Flex from "../Flex";
import { P } from "../Typography";
import { UseKeyStageFiltersReturnType } from "../../context/Search/useKeyStageFilters";

type SearchFiltersProps = {
  keyStageFilters: UseKeyStageFiltersReturnType;
};
const SearchFilters: FC<SearchFiltersProps> = (props) => {
  const { keyStageFilters } = props;

  return (
    <>
      <P $mb={16}>Key stage</P>
      <Flex $flexDirection={"row"} $flexWrap={"wrap"}>
        {keyStageFilters.map((keyStageFilter) => (
          <KeyStageFilter
            key={`search-filters-keystage-${keyStageFilter.slug}`}
            {...keyStageFilter}
          />
        ))}
      </Flex>
    </>
  );
};

export default SearchFilters;

import { FC } from "react";

import { ALL_KEY_STAGES } from "../../context/Search/SearchContext";
import KeyStageFilter from "../SearchFilters/KeyStageFilter";
import Flex from "../Flex";
import { P } from "../Typography";

const SearchFilters: FC = () => {
  return (
    <>
      <P $mb={16}>Key stage</P>
      <Flex $flexDirection={"row"} $flexWrap={"wrap"}>
        {ALL_KEY_STAGES.map((ks) => (
          <KeyStageFilter key={`search-filters-keystage-${ks}`} ks={ks} />
        ))}
      </Flex>
    </>
  );
};

export default SearchFilters;

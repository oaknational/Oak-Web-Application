import { LI, UL } from "../Typography";
import Pagination from "../Pagination";
import usePagination from "../Pagination/usePagination";
import SearchResultsItem, {
  SearchResultsItemProps,
} from "../SearchResultsItem/SearchResultsItem";

import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";
import { getSearchHitObject } from "@/context/Search/search.helpers";
import { KeyStage, SearchHit } from "@/context/Search/search.types";

interface SearchResultsProps {
  hits: Array<SearchHit>;
  allKeyStages: KeyStage[];
  searchResultClicked: (
    searchHit: SearchResultsItemProps,
    searchRank: number,
  ) => void;
}

export const RESULTS_PER_PAGE = 20;

const SearchResults = (props: SearchResultsProps) => {
  const { hits, allKeyStages, searchResultClicked } = props;
  const hitCount = hits.length;
  const paginationProps = usePagination({
    totalResults: hitCount,
    pageSize: RESULTS_PER_PAGE,
    items: hits,
  });
  const { currentPageItems, currentPage, firstItemRef } = paginationProps;
  const searchRank = (index: number) => {
    return (currentPage - 1) * 20 + index + 1;
  };

  return (
    <Flex $background={"white"} $flexDirection="column">
      {hitCount ? (
        <>
          <UL $reset>
            {currentPageItems.map((hit, index) => {
              const searchHitObject = getSearchHitObject(hit, allKeyStages);
              if (!searchHitObject) {
                return null;
              }
              return (
                <LI
                  key={`SearchList-SearchListItem-${index}${hit._source.slug}`}
                >
                  <SearchResultsItem
                    {...searchHitObject}
                    firstItemRef={index === 0 ? firstItemRef : null} // this is for pagination focus
                    onClick={(props) => {
                      searchResultClicked(props, searchRank(index));
                    }}
                  />
                </LI>
              );
            })}
          </UL>
        </>
      ) : null}

      {hits.length > RESULTS_PER_PAGE && (
        <Box $width="100%" $mt={[0, "auto"]} $pb={72} $pt={48}>
          <Pagination pageName="Search" {...paginationProps} />
        </Box>
      )}
    </Flex>
  );
};

export default SearchResults;

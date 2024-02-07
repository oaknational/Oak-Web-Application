import { OakLI, OakUL, OakFlex } from "@oaknational/oak-components";

import SearchResultsItem, {
  SearchResultsItemProps,
} from "@/components/TeacherComponents/SearchResultsItem";
import Pagination from "@/components/SharedComponents/Pagination";
import usePagination from "@/components/SharedComponents/Pagination/usePagination";
import Box from "@/components/SharedComponents/Box";
import { getSearchHitObject } from "@/context/Search/search.helpers";
import { KeyStage, SearchHit } from "@/context/Search/search.types";

interface SearchResultsProps {
  hits: Array<SearchHit>;
  allKeyStages: KeyStage[];
  searchResultOpened: (
    searchHit: SearchResultsItemProps,
    searchRank: number,
  ) => void;
  searchResultExpanded: (
    searchHit: SearchResultsItemProps,
    searchRank: number,
  ) => void;
}

export const RESULTS_PER_PAGE = 20;

const SearchResults = (props: SearchResultsProps) => {
  const { hits, allKeyStages, searchResultOpened, searchResultExpanded } =
    props;
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
    <OakFlex $background={"white"} $flexDirection="column">
      {hitCount ? (
        <>
          <OakUL $reset>
            {currentPageItems.map((hit, index) => {
              const searchHitObject = getSearchHitObject(hit, allKeyStages);
              if (!searchHitObject) {
                return null;
              }
              return (
                <OakLI
                  key={`SearchList-SearchListItem-${index}${hit._source.slug}`}
                >
                  <SearchResultsItem
                    {...searchHitObject}
                    firstItemRef={index === 0 ? firstItemRef : null} // this is for pagination focus
                    onClick={(props) => {
                      searchResultOpened(props, searchRank(index));
                    }}
                    onToggleClick={(props) => {
                      searchResultExpanded(props, searchRank(index));
                    }}
                  />
                </OakLI>
              );
            })}
          </OakUL>
        </>
      ) : null}

      {hits.length > RESULTS_PER_PAGE && (
        <Box $width="100%" $mt={[0, "auto"]} $pb={72} $pt={48}>
          <Pagination pageName="Search" {...paginationProps} />
        </Box>
      )}
    </OakFlex>
  );
};

export default SearchResults;

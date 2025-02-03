import {
  OakLI,
  OakUL,
  OakFlex,
  OakPagination,
  OakBox,
} from "@oaknational/oak-components";

import SignPostToAila from "../NoSearchResults/SignPostToAila";

import usePagination from "@/components/SharedComponents/Pagination/usePagination";
import {
  KeyStage,
  SearchHit,
  SearchQuery,
} from "@/context/Search/search.types";
import SearchResultsItem, {
  SearchResultsItemProps,
} from "@/components/TeacherComponents/SearchResultsItem";
import { getSearchHitObject } from "@/context/Search/search.helpers";

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
  query?: SearchQuery;
}

export const RESULTS_PER_PAGE = 20;

const SearchResults = (props: SearchResultsProps) => {
  const {
    query,
    hits,
    allKeyStages,
    searchResultOpened,
    searchResultExpanded,
  } = props;
  const hitCount = hits.length;
  const paginationProps = usePagination({
    totalResults: hitCount,
    pageSize: RESULTS_PER_PAGE,
    items: hits,
  });

  const { currentPageItems, currentPage, firstItemRef, paginationRoute } =
    paginationProps;
  const currentPageItemsWithSignPost = [
    ...currentPageItems.slice(0, 3),
    "aila-sign-post",
    ...currentPageItems.slice(3),
  ];
  const searchRank = (index: number) => {
    return (currentPage - 1) * 20 + index + 1;
  };

  return (
    <OakFlex $background={"white"} $flexDirection="column" id="search-results">
      {hitCount ? (
        <OakUL $reset>
          {currentPageItemsWithSignPost.map((hit, index) => {
            if (typeof hit !== "string") {
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
                    onToggleClick={(props) =>
                      searchResultExpanded(props, searchRank(index))
                    }
                  />
                </OakLI>
              );
            }
            return (
              <SignPostToAila
                title="Can't find what you need?"
                text="Create a tailor-made lesson plan and resources on any topic with Alia, our free AI-powered lesson assistant. Entirely adaptable to your class and context."
                searchExpression={query?.term}
                keyStage={
                  query?.keyStages?.length === 1 ? query.keyStages[0] : ""
                }
                subject={query?.subjects?.length === 1 ? query.subjects[0] : ""}
              />
            );
          })}
        </OakUL>
      ) : null}

      {hits.length > RESULTS_PER_PAGE && (
        <OakBox
          $width="100%"
          $mt={["space-between-none", "auto"]}
          $pb="inner-padding-xl7"
          $pt="inner-padding-xl4"
        >
          <OakPagination
            {...paginationProps}
            pageName={"Search"}
            paginationHref={paginationRoute}
          />
        </OakBox>
      )}
    </OakFlex>
  );
};

export default SearchResults;

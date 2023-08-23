import { RefObject } from "react";

import Flex from "../Flex";
import LessonListItem from "../UnitAndLessonLists/LessonList/LessonListItem";
import { LI, UL } from "../Typography";
import UnitListItem from "../UnitAndLessonLists/UnitList/UnitListItem";
import Box from "../Box";
import Pagination from "../Pagination";
import usePagination from "../Pagination/usePagination";

import {
  isLessonSearchHit,
  getLessonObject,
  getUnitObject,
} from "@/context/Search/search.helpers";
import {
  KeyStage,
  LessonSearchHit,
  SearchHit,
  UnitSearchHit,
} from "@/context/Search/search.types";

function SearchResult({
  hit,
  index,
  hitCount,
  currentPage,
  firstItemRef,
  allKeyStages,
}: {
  hit: LessonSearchHit | UnitSearchHit;
  index: number;
  hitCount: number;
  currentPage: number;
  firstItemRef: RefObject<HTMLAnchorElement> | null | undefined;
  allKeyStages: KeyStage[];
}) {
  if (isLessonSearchHit(hit)) {
    const lessonObject = getLessonObject({
      hit,
      allKeyStages,
    });

    if (!lessonObject) {
      return null;
    }
    return (
      <LessonListItem
        {...lessonObject}
        index={index}
        hitCount={hitCount}
        fromSearchPage
        currentPage={currentPage}
        firstItemRef={index === 0 ? firstItemRef : null}
      />
    );
  }

  // is unit
  const unitObject = getUnitObject({
    hit,
    allKeyStages,
  });

  if (!unitObject) {
    return null;
  }

  return (
    <UnitListItem
      {...unitObject}
      expiredLessonCount={null}
      index={index}
      hitCount={hitCount}
      fromSearchPage
      currentPage={currentPage}
      firstItemRef={index === 0 ? firstItemRef : null}
    />
  );
}
interface SearchResultsProps {
  hits: Array<SearchHit>;
  allKeyStages: KeyStage[];
}

export const RESULTS_PER_PAGE = 20;

const SearchResults = (props: SearchResultsProps) => {
  const { hits, allKeyStages } = props;
  const hitCount = hits.length;
  const paginationProps = usePagination({
    totalResults: hitCount,
    pageSize: RESULTS_PER_PAGE,
    items: hits,
  });
  const { currentPageItems, currentPage, firstItemRef } = paginationProps;
  return (
    <Flex $background={"white"} $flexDirection="column">
      {hitCount ? (
        <>
          <UL $reset>
            {currentPageItems.map((hit, index) => {
              return (
                <LI key={`SearchList-SearchListItem-${hit._source.slug}`}>
                  <SearchResult
                    hit={hit}
                    index={index}
                    currentPage={currentPage}
                    hitCount={hitCount}
                    firstItemRef={firstItemRef}
                    allKeyStages={allKeyStages}
                  />
                </LI>
              );
            })}
          </UL>
        </>
      ) : null}

      {hits.length > RESULTS_PER_PAGE && (
        <Box $width="100%" $mt={[0, "auto"]} $pt={48}>
          <Pagination {...paginationProps} />
        </Box>
      )}
    </Flex>
  );
};

export default SearchResults;

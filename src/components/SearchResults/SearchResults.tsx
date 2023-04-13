import Flex from "../Flex";
import LessonListItem from "../UnitAndLessonLists/LessonList/LessonListItem";
import { LI, UL } from "../Typography";
import UnitListItem from "../UnitAndLessonLists/UnitList/UnitListItem";
import Box from "../Box";
import Pagination from "../Pagination";
import usePagination from "../Pagination/usePagination";
import {
  getLessonObject,
  getUnitObject,
  isLessonSearchHit,
  SearchHit,
} from "../../context/Search/helpers";
import { KeyStage } from "../../context/Search/useKeyStageFilters";

interface SearchResultsProps {
  hits: Array<SearchHit>;
  allKeyStages: KeyStage[];
}

export const RESULTS_PER_PAGE = 20;

const SearchResults = (props: SearchResultsProps) => {
  const { hits, allKeyStages } = props;
  const paginationProps = usePagination({
    totalResults: hits.length,
    pageSize: RESULTS_PER_PAGE,
    items: hits,
  });
  const { currentPageItems } = paginationProps;

  return (
    <Flex $background={"white"} $flexDirection="column">
      {hits.length ? (
        <>
          <UL $reset>
            {currentPageItems.map((hit) => {
              const { _source } = hit;

              return (
                <LI key={`SearchList-SearchListItem-${_source.slug}`}>
                  {isLessonSearchHit(hit) ? (
                    <LessonListItem
                      {...getLessonObject({ hit, allKeyStages })}
                    />
                  ) : (
                    <UnitListItem
                      expiredLessonCount={null}
                      {...getUnitObject({ hit, allKeyStages })}
                      index={null}
                    />
                  )}
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

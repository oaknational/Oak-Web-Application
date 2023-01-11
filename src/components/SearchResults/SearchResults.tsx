import { SearchHit } from "../../pages/beta/teachers/search";
import OakLink from "../OakLink";
import Box from "../Box";
import Pagination from "../Pagination";
import usePagination from "../Pagination/usePagination";

interface SearchResultsProps {
  hits: Array<SearchHit>;
}

const RESULTS_PER_PAGE = 20;

const SearchResults = (props: SearchResultsProps) => {
  const { hits } = props;

  const paginationProps = usePagination({
    totalResults: hits.length,
    pageSize: RESULTS_PER_PAGE,
    items: hits,
  });

  const { currentPageItems } = paginationProps;

  const resultElements: Array<JSX.Element> = currentPageItems.map(
    (hit: SearchHit) => {
      const { _source } = hit;
      const { title, id, key_stage_title, slug } = _source;
      return (
        <li key={id}>
          <OakLink page={null} href={`/beta/lessons/${slug}`}>
            {title} - <i>{key_stage_title}</i>
          </OakLink>
        </li>
      );
    }
  );

  return (
    <div>
      <ul data-testid="search-results">{resultElements}</ul>
      {hits.length > RESULTS_PER_PAGE && (
        <Box $width="100%" $mt={[0, "auto"]} $pt={48}>
          <Pagination {...paginationProps} />
        </Box>
      )}
    </div>
  );
};

export default SearchResults;

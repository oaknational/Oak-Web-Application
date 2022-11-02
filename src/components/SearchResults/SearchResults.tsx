import { SearchHit } from "../../pages/beta/search";
import OakLink from "../OakLink";

interface SearchResultsProps {
  hits: Array<SearchHit>;
}

const SearchResults = (props: SearchResultsProps) => {
  const { hits } = props;
  const resultElements: Array<JSX.Element> = hits.map((hit: SearchHit) => {
    const { _source } = hit;
    const { title, id, key_stage_title, slug } = _source;
    return (
      <li key={id}>
        <OakLink page={null} href={`/beta/lessons/${slug}`}>
          {title} - <i>{key_stage_title}</i>
        </OakLink>
      </li>
    );
  });

  return <ul data-testid="search-results">{resultElements}</ul>;
};

export default SearchResults;

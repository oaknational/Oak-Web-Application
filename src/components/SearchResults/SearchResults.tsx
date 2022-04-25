import { SearchHit } from "../../pages/search";

interface SearchResultsProps {
  hits: Array<SearchHit>;
}

const SearchResults = (props: SearchResultsProps) => {
  const { hits } = props;
  const resultElements: Array<JSX.Element> = hits.map((hit: SearchHit) => {
    const { _source } = hit;
    const { title, id, key_stage_title } = _source;
    return (
      <li key={id}>
        {title} - <i>{key_stage_title}</i>
      </li>
    );
  });

  return <ul data-testid="search-results">{resultElements}</ul>;
};

export default SearchResults;

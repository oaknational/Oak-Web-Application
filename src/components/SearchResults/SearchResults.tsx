import Link from "next/link";

import { SearchHit } from "../../pages/search";

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
        <Link href={`/lessons/${slug}`}>
          <a>
            {title} - <i>{key_stage_title}</i>
          </a>
        </Link>
      </li>
    );
  });

  return <ul data-testid="search-results">{resultElements}</ul>;
};

export default SearchResults;

import { SearchHit } from "../../pages/search";

interface IProps {
  hits: Array<SearchHit>;
}

const SearchResults = (props: IProps) => {
  const { hits } = props;
  const resultElements: Array<JSX.Element> = hits.map((hit: SearchHit) => {
    const { _source } = hit;
    const { title, id } = _source;
    return <li key={id}>{title}</li>;
  });

  return <ul>{resultElements}</ul>;
};

export default SearchResults;

import { searchResultsSchema } from "../../search.schema";
import { SearchQuery } from "../../search.types";

import constructElasticQuery from "./constructElasticQuery";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import handleFetchError from "@/utils/handleFetchError";

export async function fetchResults(query: SearchQuery) {
  const options: RequestInit = {
    method: "POST",
    redirect: "follow",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(constructElasticQuery(query)),
  };

  const response = await fetch(getBrowserConfig("searchApiUrl"), options);

  handleFetchError(response);

  const unparsedData = await response.json();

  const data = searchResultsSchema.parse(unparsedData);

  const { hits } = data;
  const hitList = hits.hits;

  return hitList;
}

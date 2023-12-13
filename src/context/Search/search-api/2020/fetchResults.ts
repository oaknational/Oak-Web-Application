import { searchResultsSchema } from "../../search.schema";
import { SearchHit, SearchQuery } from "../../search.types";

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

  const response = await fetch(getBrowserConfig("searchApiUrl2020"), options);

  handleFetchError(response);

  const unparsedData = await response.json();
  const unparsedDataWithLegacyFlag = {
    ...unparsedData,
    hits: {
      ...unparsedData.hits,
      hits: unparsedData.hits.hits.map((hit: SearchHit) => {
        return {
          ...hit,
          _source: { ...hit._source, pathways: [] },
          legacy: true,
        };
      }),
    },
  };

  const data = searchResultsSchema.parse(unparsedDataWithLegacyFlag);

  const { hits } = data;
  const hitList = hits.hits;

  return hitList;
}

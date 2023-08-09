import constructElasticQuery from "../constructElasticQuery";
import { searchResultsSchema } from "../search.schema";
import { SearchHit, SearchQuery } from "../search.types";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import OakError from "@/errors/OakError";
import handleFetchError from "@/utils/handleFetchError";

export async function performSearch({
  query,
  onStart,
  onSuccess,
  onFail,
}: {
  query: SearchQuery;
  onStart: () => void;
  onSuccess: (hits: SearchHit[]) => void;
  onFail: () => void;
}) {
  try {
    onStart();
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
    onSuccess(hitList);
  } catch (error) {
    const oakError = new OakError({
      code: "search/unknown",
      originalError: error,
    });

    reportError(oakError);
    onFail();
  }
}

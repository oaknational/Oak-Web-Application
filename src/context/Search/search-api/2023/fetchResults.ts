import snakecaseKeys from "snakecase-keys";

import {
  RawSearchResponseData,
  rawSearchResponseSchema,
  searchResultsSchema,
} from "../../search.schema";
import { SearchQuery } from "../../search.types";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import handleFetchError from "@/utils/handleFetchError";

export const transformAndParseSearchResponseData = (
  rawData: RawSearchResponseData,
) => {
  const transformedData = {
    ...rawData,
    hits: {
      ...rawData.hits,
      hits: rawData.hits.hits.map((hit) => {
        const source = hit._source;
        const title =
          source.type === "lesson" ? source.lessonTitle : source.unitTitle;
        const slug =
          source.type === "lesson" ? source.lessonSlug : source.unitSlug;
        return {
          ...hit,

          _source: {
            ...source,
            title,
            slug,
          },
        };
      }),
    },
  };
  const snakeaseData = snakecaseKeys(transformedData, {
    deep: true,
    exclude: ["_id", "_index", "_score", "_source"],
  });

  const data = searchResultsSchema.parse(snakeaseData);

  return data;
};

export async function fetchResults(query: SearchQuery) {
  const options: RequestInit = {
    method: "POST",
    mode: "cors",
    redirect: "follow",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(query),
  };

  const response = await fetch(getBrowserConfig("searchApiUrl2023"), options);

  handleFetchError(response);

  const unparsedData = await response.json();

  const rawData = rawSearchResponseSchema.parse(unparsedData);

  const data = transformAndParseSearchResponseData(rawData);
  const { hits } = data;
  const hitList = hits.hits;
  return hitList;
}

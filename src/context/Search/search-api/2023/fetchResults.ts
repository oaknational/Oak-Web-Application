import snakecaseKeys from "snakecase-keys";

import { searchResultsSchema } from "../../search.schema";
import { SearchQuery } from "../../search.types";

import { constructElasticQuery } from "./constructElasticQuery";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import handleFetchError from "@/utils/handleFetchError";

export async function fetchResults(query: SearchQuery) {
  const options: RequestInit = {
    method: "POST",
    mode: "cors",
    redirect: "follow",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(constructElasticQuery(query)),
  };

  const response = await fetch(getBrowserConfig("searchApiUrl2023"), options);

  handleFetchError(response);

  const unparsedData = await response.json();

  const transformedData = {
    ...unparsedData,
    hits: {
      ...unparsedData.hits,
      hits: unparsedData.hits.hits.map(
        (hit: {
          _source: {
            type: "lesson" | "unit";
            lessonTitle?: string;
            lessonSlug?: string;
            unitTitle?: string;
            unitSlug?: string;
          };
        }) => {
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
        },
      ),
    },
  };

  const snakeaseData = snakecaseKeys(transformedData, {
    deep: true,
    exclude: ["_id", "_index", "_score", "_source"],
  });

  const data = searchResultsSchema.parse(snakeaseData);

  const { hits } = data;
  const hitList = hits.hits;

  return hitList;
}

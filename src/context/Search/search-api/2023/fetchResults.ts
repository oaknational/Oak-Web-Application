import snakecaseKeys from "snakecase-keys";
import { cache } from "react";

import {
  RawSearchResponseData,
  rawSearchResponseSchema,
  searchResultsSchema,
} from "../../search.schema";
import { SearchQuery } from "../../search.types";

import { getHighlightFromAllFields } from "@/app/(core)/teachers/search/helpers";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import OakError from "@/errors/OakError";
import { cacheData } from "@/node-lib/cache";

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
        const highlight = getHighlightFromAllFields(
          hit.highlight,
          hit._source.pupilLessonOutcome,
        );
        return {
          ...hit,
          highlight,
          _source: {
            ...source,
            title,
            slug,
          },
        };
      }),
    },
  };
  const snakecaseData = snakecaseKeys(transformedData, {
    deep: true,
    exclude: ["_id", "_index", "_score", "_source"],
  });

  const data = searchResultsSchema.parse(snakecaseData);

  return data;
};

async function fetchResults(query: SearchQuery) {
  const baseUrl = getBrowserConfig("clientAppBaseUrl");
  const origin = new URL(
    /^https?:\/\//i.test(baseUrl) ? baseUrl : `https://${baseUrl}`,
  ).origin;
  const options: RequestInit = {
    method: "POST",
    redirect: "follow",
    headers: new Headers({
      "Content-Type": "application/json",
      Origin: origin,
    }),
    body: JSON.stringify({ ...query, legacy: "filterOutAll" }),
  };

  const response = await fetch(getBrowserConfig("searchApiUrl2023"), options);

  if (!response.ok) {
    throw new OakError({
      code: "search/unknown",
      originalError: response.status,
      meta: { body: await response.clone().text() },
    });
  }

  const unparsedData = await response.json();

  const rawData = rawSearchResponseSchema.parse(unparsedData);
  const data = transformAndParseSearchResponseData(rawData);
  const { hits, took } = data;
  const hitList = hits.hits;
  // took is the time taken in milliseconds to retrieve results
  return { hitList, took };
}

// Cache results for queries with the same search params
// "page" param excluded as pagination is done client side and this prevents duplicate requests for same query
export const fetchResultsWithCache = cache(cacheData(fetchResults, ["search"]));

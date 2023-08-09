import snakecaseKeys from "snakecase-keys";

import { searchResultsSchema } from "../search.schema";
import { SearchHit, SearchQuery } from "../search.types";

import { constructQuery } from "./constructQuery";

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
      mode: "cors",
      redirect: "follow",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(constructQuery(query)),
    };

    const response = await fetch(
      "http://localhost:9200/units,lessons/_search",
      options
    );

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

            if (slug === "") {
              console.log(source);
            }
            return {
              ...hit,
              _source: {
                ...source,
                title,
                slug,
              },
            };
          }
        ),
      },
    };

    const snakeaseData = snakecaseKeys(transformedData, {
      deep: true,
      exclude: ["_id", "_index", "_score", "_source"],
    });
    console.log(snakeaseData);

    const data = searchResultsSchema.parse(snakeaseData);

    const { hits } = data;
    const hitList = hits.hits;
    onSuccess(hitList);
  } catch (error) {
    console.log(error);

    const oakError = new OakError({
      code: "search/unknown",
      originalError: error,
    });

    reportError(oakError);
    onFail();
  }
}

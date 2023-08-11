import { SearchHit, SearchQuery } from "../search.types";

import { fetchResults as fetchResults2020 } from "./2020/fetchResults";
import { fetchResults as fetchResults2023 } from "./2023/fetchResults";

import OakError from "@/errors/OakError";
import errorReporter from "@/common-lib/error-reporter/errorReporter";

const reportError = errorReporter("search");

export async function performSearch({
  query,
  apiVersion,
  onStart,
  onSuccess,
  onFail,
}: {
  query: SearchQuery;
  apiVersion: "2020" | "2023";
  onStart: () => void;
  onSuccess: (hits: SearchHit[]) => void;
  onFail: () => void;
}) {
  try {
    onStart();

    /**
     * Caution, if one search endpoint fails, then the whole search fails.
     */
    const [results2023, results2020] = await Promise.all([
      fetchResults2023(query),
      fetchResults2020(query),
    ]);

    /**
     * Depending on the designs, we may want to merge the results here.
     */
    // console.log({ results2023, results2020 });

    /**
     * Hack to show results depending on [viewType]
     */
    const results = apiVersion === "2023" ? results2023 : results2020;

    onSuccess(results);
  } catch (error) {
    const oakError = new OakError({
      code: "search/unknown",
      originalError: error,
    });

    reportError(oakError);

    onFail();
  }
}

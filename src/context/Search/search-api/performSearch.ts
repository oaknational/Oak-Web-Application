import { SearchHit, SearchQuery } from "../search.types";

import { fetchResults as fetchResults2020 } from "./2020/fetchResults";
import { fetchResults as fetchResults2023 } from "./2023/fetchResults";

import OakError from "@/errors/OakError";
import errorReporter from "@/common-lib/error-reporter/errorReporter";

const reportError = errorReporter("search");

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

    const results = [
      ...(await fetchResults2023(query)),
      ...(await fetchResults2020(query)),
    ];

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

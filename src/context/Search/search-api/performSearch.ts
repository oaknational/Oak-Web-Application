import { SearchHit, SearchQuery } from "../search.types";
import { SearchSuggestion } from "../useSearch";

import { fetchResults as fetchResults2023 } from "./2023/fetchResults";
import { findSuggestion } from "./suggestions/findSuggestion";

import OakError from "@/errors/OakError";
import errorReporter from "@/common-lib/error-reporter/errorReporter";

const reportError = errorReporter("search");
// comment to build the branch
export async function performSearch({
  query,
  onStart,
  onSuccess,
  onFail,
}: {
  query: SearchQuery;
  onStart: () => void;
  onSuccess: (hits: SearchHit[], suggestion: SearchSuggestion | null) => void;
  onFail: () => void;
}) {
  try {
    onStart();
    const searchResults = await fetchResults2023(query);
    const suggestion = findSuggestion(query.term);

    onSuccess(searchResults, suggestion);
  } catch (error) {
    const oakError = new OakError({
      code: "search/unknown",
      originalError: error,
    });

    reportError(oakError);

    onFail();
  }
}

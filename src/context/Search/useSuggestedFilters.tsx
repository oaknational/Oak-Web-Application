import { useMemo } from "react";
import useSWR from "swr";

import { convertSearchIntentToFilters, normalizeTerm } from "./search.helpers";
import { SuggestedFilters } from "./search.types";

import { searchIntentSchema } from "@/common-lib/schemas/search-intent";
import errorReporter from "@/common-lib/error-reporter";

const reportError = errorReporter("useSuggestedFilters");

const fetcher = async (url: string) => {
  const resp = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!resp.ok) {
    throw new Error(`HTTP error! status: ${resp.status}`);
  }

  const json = await resp.json();
  return searchIntentSchema.parse(json);
};

export function useSuggestedFilters({
  term,
  enabled,
}: {
  term: string;
  enabled: boolean;
}): SuggestedFilters {
  const params = useMemo(
    () =>
      new URLSearchParams({
        v: "1",
        searchTerm: normalizeTerm(term),
      }).toString(),
    [term],
  );

  const swrKey =
    enabled && term.length >= 2 ? `/api/search/intent?${params}` : null;

  const { data, error, isLoading } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  if (!enabled || term.length < 2) {
    return {
      searchFilters: undefined,
      status: "idle",
    };
  }

  if (isLoading) {
    return {
      searchFilters: undefined,
      status: "loading",
    };
  }

  if (error) {
    reportError(error);
    return {
      searchFilters: [],
      status: "error",
      error: `${error}`,
    };
  }

  if (data) {
    return {
      searchFilters: convertSearchIntentToFilters(data),
      status: "success",
      data,
    };
  }

  return {
    searchFilters: undefined,
    status: "idle",
  };
}

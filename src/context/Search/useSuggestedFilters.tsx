import { useEffect, useMemo, useRef, useState } from "react";

import { convertSearchIntentToFilters, normalizeTerm } from "./search.helpers";
import { SuggestedFilters } from "./search.types";

import { searchIntentSchema } from "@/common-lib/schemas/search-intent";

const initial: SuggestedFilters = {
  searchFilters: undefined,
  status: "idle",
};

export function useSuggestedFilters({
  term,
  enabled = true,
}: {
  term: string;
  enabled?: boolean;
}): SuggestedFilters {
  const norm = useMemo(() => normalizeTerm(term), [term]);
  const [state, setState] = useState<SuggestedFilters>(initial);
  const lastKeyRef = useRef<string>("");

  useEffect(() => {
    const key = norm;
    lastKeyRef.current = key;

    if (!enabled || key.length < 2) {
      setState(initial);
      return;
    }

    setState((s) => ({ ...s, status: "loading", error: undefined }));
    (async () => {
      try {
        const resp = await fetch(`/api/search/intent?searchTerm=${key}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const json = await resp.json();
        const parsed = searchIntentSchema.parse(json);

        setState({
          searchFilters: convertSearchIntentToFilters(parsed),
          status: "success",
          error: undefined,
        });
      } catch (e: unknown) {
        setState({ searchFilters: [], status: "error", error: `${e}` });
      }
    })();
  }, [norm, enabled]);

  return state;
}

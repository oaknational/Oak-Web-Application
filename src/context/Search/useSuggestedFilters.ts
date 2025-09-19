import { useEffect, useMemo, useRef, useState } from "react";

import { normalizeTerm } from "@/context/Search/ai-suggested-filters.schema";

// ASF-3 Step 1: Hook with 2+ char guard (skeleton)

export type SuggestedFilters = {
  intentSubject?: string;
  intentKeyStage?: string;
  relatedSubjectSlugs: string[];
  status: "idle" | "loading" | "success" | "error";
  error?: string;
};

const initial: SuggestedFilters = {
  relatedSubjectSlugs: [],
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
      setState({ relatedSubjectSlugs: [], status: "idle" });
      return;
    }

    // Further steps will add cache/fetch/validation
    setState((s) => ({ ...s, status: "loading", error: undefined }));
  }, [norm, enabled]);

  return state;
}

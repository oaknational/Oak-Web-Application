import { useEffect, useMemo, useRef, useState } from "react";

import {
  normalizeTerm,
  intentResponseSchema,
} from "@/context/Search/ai-suggested-filters.schema";
import type { IntentResponse } from "@/context/Search/ai-suggested-filters.schema";

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

// ASF-3 Step 2: In-memory cache for this session (by normalized term)
const cache = new Map<string, IntentResponse>();

// Placeholder mapper; fleshed out in Step 4
function mapToSuggested(resp: IntentResponse): SuggestedFilters {
  // Placeholder mapping (Step 4 will fill this): use data to satisfy linter
  const slugs: string[] = resp.relatedSubjects.slice(0, 0).map((s) => s.slug);
  return { relatedSubjectSlugs: slugs, status: "success" };
}

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

    // Serve from cache if present
    const cached = cache.get(key);
    if (cached) {
      setState(mapToSuggested(cached));
      return;
    }

    // Fetch + validate
    let cancelled = false;
    setState((s) => ({ ...s, status: "loading", error: undefined }));
    (async () => {
      try {
        const resp = await fetch("/api/search/intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ term: key }),
        });
        const json = await resp.json();
        const parsed = intentResponseSchema.parse(json);
        if (cancelled || lastKeyRef.current !== key) return;
        cache.set(key, parsed);
        setState(mapToSuggested(parsed));
      } catch (e: unknown) {
        if (cancelled || lastKeyRef.current !== key) return;
        setState({ relatedSubjectSlugs: [], status: "error", error: `${e}` });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [norm, enabled]);

  return state;
}

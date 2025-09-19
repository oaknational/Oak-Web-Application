import { useEffect, useMemo, useRef, useState } from "react";

/**
 * useSuggestedFilters — AI suggested filters hook (spike)
 *
 * - Guard: no-op when normalized term length < 2 or disabled.
 * - Cache: in-memory Map keyed by normalized term for session reuse.
 * - Fetches POST /api/search/intent and validates with shared schema.
 * - Maps to `{ intentSubject?, intentKeyStage?, relatedSubjectSlugs[] }`.
 * - Status: `idle | loading | success | error` (UI remains silent on error).
 *
 * Example
 *  const { intentSubject, intentKeyStage, relatedSubjectSlugs, status } =
 *    useSuggestedFilters({ term: query.term, enabled: submitted });
 */

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
  let intentSubject: string | undefined;
  let intentKeyStage: string | undefined;
  if (resp.intent) {
    if (resp.intent.type === "subject") {
      intentSubject = resp.intent.subject;
    } else if (resp.intent.type === "subject-keystage") {
      intentSubject = resp.intent.subject;
      intentKeyStage = resp.intent.keyStage;
    }
  }
  const relatedSubjectSlugs = resp.relatedSubjects
    .map((r) => r.slug)
    .filter((s) => s !== intentSubject)
    .slice(0, 3);
  return {
    intentSubject,
    intentKeyStage,
    relatedSubjectSlugs,
    status: "success",
    error: undefined,
  };
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

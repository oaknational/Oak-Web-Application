import { FC, useMemo } from "react";
import {
  OakBox,
  OakFieldset,
  OakFlex,
  OakP,
  OakSearchFilterCheckBox,
} from "@oaknational/oak-components";

import { SetSearchQuery, SearchQuery } from "@/context/Search/search.types";
import { toSentenceCase } from "@/node-lib/curriculum-api-2023/helpers";

/**
 * AISuggestedFilters — Desktop-only suggested filters section (spike)
 * - Renders only when suggestions exist; silent on loading/error.
 * - Mirrors existing filter behavior by toggling slugs in query via setQuery.
 * - Removal: safe to delete alongside `useSuggestedFilters` wiring in Search.view.tsx.
 */
export type AISuggestedFiltersProps = {
  intentSubject?: string;
  intentKeyStage?: string;
  relatedSubjectSlugs: string[];
  setQuery: SetSearchQuery;
  query: SearchQuery;
};

function toggleArrayValue(arr: string[] | undefined, value: string): string[] {
  const set = new Set(arr ?? []);
  if (set.has(value)) {
    set.delete(value);
  } else {
    set.add(value);
  }
  return Array.from(set);
}

const AISuggestedFilters: FC<AISuggestedFiltersProps> = ({
  intentSubject,
  intentKeyStage,
  relatedSubjectSlugs,
  setQuery,
  query,
}) => {
  const items = useMemo(() => {
    // Render subject + key stage suggestions first, followed by related subjects
    const list: { kind: "subject" | "keyStage"; slug: string }[] = [];
    if (intentSubject) list.push({ kind: "subject", slug: intentSubject });
    if (intentKeyStage) list.push({ kind: "keyStage", slug: intentKeyStage });
    for (const s of relatedSubjectSlugs.slice(0, 3)) {
      if (s !== intentSubject) list.push({ kind: "subject", slug: s });
    }
    return list;
  }, [intentSubject, intentKeyStage, relatedSubjectSlugs]);

  if (items.length === 0) return null;

  return (
    <OakBox
      $mb="space-between-m2"
      $bb={"border-solid-s"}
      $borderColor={"grey40"}
    >
      <OakFieldset>
        <OakP as={"legend"} $mb="space-between-m" $font={"heading-7"}>
          Suggested filters
        </OakP>
        <OakFlex
          $gap={"space-between-xs"}
          $mb="space-between-m2"
          $flexDirection={"row"}
          $flexWrap={"wrap"}
        >
          {items.map((item) => {
            const checked =
              item.kind === "subject"
                ? (query.subjects ?? []).includes(item.slug)
                : (query.keyStages ?? []).includes(item.slug);
            const title = toSentenceCase(item.slug);
            const id = `ai-suggested-${item.kind}-${item.slug}`;
            return (
              <OakSearchFilterCheckBox
                key={id}
                id={id}
                name={`ai-${item.kind}-filters`}
                aria-label={`${title} filter`}
                displayValue={title}
                checked={checked}
                onChange={() => {
                  if (item.kind === "subject") {
                    setQuery((q) => ({
                      ...q,
                      subjects: toggleArrayValue(q.subjects, item.slug),
                    }));
                  } else {
                    setQuery((q) => ({
                      ...q,
                      keyStages: toggleArrayValue(q.keyStages, item.slug),
                    }));
                  }
                }}
              />
            );
          })}
        </OakFlex>
      </OakFieldset>
    </OakBox>
  );
};

export default AISuggestedFilters;

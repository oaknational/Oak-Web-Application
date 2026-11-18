import { CanonicalLessonHubProps } from "./CanonicalLessonHub";

import { resolveOakHref } from "@/common-lib/urls";
import { CanonicalLessonHubData } from "@/node-lib/curriculum-api-2023/queries/canonicalLessonOverview/canonicalLessonOverview.schema";

export function getSortedPathways(
  pathways: CanonicalLessonHubData["pathways"],
  lessonSlug: string,
): CanonicalLessonHubProps["programmesForLesson"] {
  return pathways
    .map((pathway) => ({
      subject: pathway.subjectTitle,
      unitTitle: pathway.unitTitle,
      examboard: pathway.examBoardTitle,
      tier: pathway.tierTitle,
      year: pathway.yearGroupTitle,
      pathway: pathway.pathwayTitle,
      href: resolveOakHref({
        page: "lesson-overview",
        lessonSlug,
        unitSlug: pathway.unitSlug,
        programmeSlug: pathway.programmeSlug,
      }),
    }))
    .sort(
      (a, b) =>
        compareValues(a.subject, b.subject) ||
        compareValues(a.year, b.year) ||
        compareValues(a.examboard, b.examboard) ||
        compareValues(a.tier, b.tier) ||
        compareValues(a.pathway, b.pathway),
    );
}

function compareValues(
  valueA: string | null | undefined,
  valueB: string | null | undefined,
): number {
  // Missing values sort after populated values at each level.
  if (!valueA && !valueB) return 0;
  if (!valueA) return 1;
  if (!valueB) return -1;

  return valueA.localeCompare(valueB, "en", {
    sensitivity: "base",
    numeric: true,
  });
}

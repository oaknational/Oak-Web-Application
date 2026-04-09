import { createTeacherProgrammeSlug } from "./slugs";
import { YearData } from "./types";
import { findUnitOrOptionBySlug } from "./units";
import { areLessonsAvailable } from "./lessons";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { resolveOakHref } from "@/common-lib/urls";

export function getUnitSeoFromYearData({
  yearData,
  slug,
  ks4OptionSlug,
  tier,
}: {
  yearData: YearData;
  slug?: string;
  ks4OptionSlug?: string;
  tier?: string;
}) {
  if (!slug) {
    return;
  }
  const { unit: unitData } = findUnitOrOptionBySlug(yearData, slug);
  if (unitData) {
    const programmeSlug = createTeacherProgrammeSlug(
      unitData,
      ks4OptionSlug,
      tier,
      unitData?.pathway_slug ?? undefined,
    );

    const lessonsAvailable = areLessonsAvailable(
      unitData?.lessons ?? unitData?.lessons ?? [],
    );

    const href =
      lessonsAvailable && programmeSlug && slug
        ? resolveOakHref({
            page: "lesson-index",
            unitSlug: slug,
            programmeSlug,
          })
        : null;

    if (href) {
      return {
        canonicalURL: `${getBrowserConfig("seoAppUrl")}${href}`,
        noIndex: true,
      };
    }
  }

  return {
    noIndex: true,
  };
}

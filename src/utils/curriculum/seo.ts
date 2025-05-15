import { createTeacherProgrammeSlug } from "./slugs";
import { YearData } from "./types";
import { findUnitOrOptionBySlug } from "./units";
import { areLessonsAvailable } from "./lessons";

import { transformOwaLinkProps } from "@/components/SharedComponents/OwaLink";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

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

    const lessonPageProps =
      lessonsAvailable && programmeSlug && slug
        ? transformOwaLinkProps({
            page: "lesson-index",
            unitSlug: slug,
            programmeSlug,
          })
        : null;

    if (lessonPageProps?.nextLinkProps?.href) {
      return {
        canonicalURL: `${getBrowserConfig("seoAppUrl")}${lessonPageProps?.nextLinkProps?.href}`,
        noIndex: true,
      };
    } else {
      return {
        noIndex: true,
      };
    }
  }
}

import { PortableTextBlock } from "@portabletext/types";
import { capitalize } from "lodash";
import { format } from "date-fns";

import { CurriculumFilters, YearData } from "./types";
import { keystageFromYear } from "./keystage";
import { sortYears } from "./sorting";

import { Actions } from "@/node-lib/curriculum-api-2023/shared.schema";
import { Phase } from "@/node-lib/curriculum-api-2023";
import { DownloadCategory } from "@/node-lib/curriculum-api-2023/fixtures/curriculumPreviousDownloads.fixture";

export function getYearGroupTitle(
  yearData: YearData,
  year: string,
  suffix?: string,
) {
  const suffixStr = suffix ? ` ${suffix}` : "";
  if (year in yearData) {
    const { groupAs } = yearData[year]!;
    if (groupAs && year === "all-years") {
      return `${groupAs}${suffixStr} (all years)`;
    }
  }
  return `Year ${year}${suffixStr}`;
}

function hasKs(keystages: { slug: string }[], num: number) {
  return keystages.find((k) => k.slug === `ks${num}`);
}

export function getPhaseText(
  phase: Pick<Phase, "slug">,
  keystages: { slug: string }[],
) {
  return buildPhaseText(phase, keystages, false);
}
export function getShortPhaseText(
  phase: Pick<Phase, "slug">,
  keystages: { slug: string }[],
) {
  return buildPhaseText(phase, keystages, true);
}

function buildPhaseText(
  phase: Pick<Phase, "slug">,
  keystages: { slug: string }[],
  isShortPhase: boolean,
) {
  if (phase.slug === "primary") {
    const hasKs1 = hasKs(keystages, 1);
    const hasKs2 = hasKs(keystages, 2);
    if (hasKs1 && hasKs2) {
      return isShortPhase ? "KS1 & KS2" : "Key stage 1 and 2";
    } else if (hasKs1) {
      return isShortPhase ? "KS1" : "Key stage 1";
    } else if (hasKs2) {
      return isShortPhase ? "KS2" : "Key stage 2";
    }
  }
  if (phase.slug === "secondary") {
    const hasKs3 = hasKs(keystages, 3);
    const hasKs4 = hasKs(keystages, 4);
    if (hasKs3 && hasKs4) {
      return isShortPhase ? "KS3 & KS4" : "Key stage 3 and 4";
    } else if (hasKs3) {
      return isShortPhase ? "KS3" : "Key stage 3";
    } else if (hasKs4) {
      return isShortPhase ? "KS4" : "Key stage 4";
    }
  }
  return "";
}

const KEYSTAGES_PRIMARY = ["ks1", "ks2"];
const KEYSTAGES_SECONDARY = ["ks3", "ks4"];

export function formatKeystagesShort(keyStages: string[]) {
  const keyStagesItems: string[] = [];
  const isOnlyPrimary = keyStages.every((ks) => KEYSTAGES_PRIMARY.includes(ks));
  const isOnlySecondary = keyStages.every((ks) =>
    KEYSTAGES_SECONDARY.includes(ks),
  );
  if (isOnlyPrimary && keyStages.includes("ks1")) keyStagesItems.push("1");
  if (isOnlyPrimary && keyStages.includes("ks2")) keyStagesItems.push("2");
  if (isOnlySecondary && keyStages.includes("ks3")) keyStagesItems.push("3");
  if (isOnlySecondary && keyStages.includes("ks4")) keyStagesItems.push("4");
  return keyStagesItems.length > 0 ? `KS${keyStagesItems.join("-")}` : ``;
}

export function subjectTitleWithCase(title: string) {
  if (
    ["english", "french", "spanish", "german"].includes(title.toLowerCase())
  ) {
    return [title.slice(0, 1).toUpperCase(), title.slice(1).toLowerCase()].join(
      "",
    );
  }
  return title.toLowerCase();
}

export function buildPageTitle(
  keyStages: string[],
  subject: { title: string; slug: string },
  phase: { title: string; slug: string },
) {
  let pageTitle: string = "";
  const keyStageStrings: string[] = [];
  if (keyStages.includes("ks1")) keyStageStrings.push("KS1");
  if (keyStages.includes("ks2")) keyStageStrings.push("KS2");
  if (keyStages.includes("ks3")) keyStageStrings.push("KS3");
  if (keyStages.includes("ks4")) keyStageStrings.push("KS4");
  const keyStageString = keyStageStrings.join(" & ");

  if (["primary", "secondary"].includes(phase.slug)) {
    pageTitle = `${keyStageString} ${subjectTitleWithCase(subject.title)} curriculum`;
  }
  return pageTitle;
}

export function joinWords(str: (number | string)[]) {
  return str.filter((str) => str !== "").join(" ");
}

export function getYearSubheadingText(
  yearData: YearData,
  year: string,
  filters: Pick<
    CurriculumFilters,
    "childSubjects" | "subjectCategories" | "tiers"
  >,
  type: "core" | "non_core" | "all" | null,
  actions?: Actions,
): string | null {
  // Don't show subheading for "All" years view
  if (year === "all") {
    return null;
  }

  const parts: string[] = [];

  // Add subject from programme_field_overrides if it exists
  if (actions?.programme_field_overrides?.subject) {
    parts.push(actions.programme_field_overrides.subject);
  }

  const isKs4Year = keystageFromYear(year) === "ks4";

  if (keystageFromYear(year) === "ks4") {
    if (type === "core") {
      parts.push("Core");
    } else if (type === "non_core") {
      parts.push("GCSE");
    }
  }

  // Handle subject categories (KS1-KS3)
  if (
    filters.subjectCategories.length > 0 &&
    !filters.subjectCategories.includes("all") && // Skip if "All" is selected
    (!isKs4Year || filters.childSubjects.length === 0)
  ) {
    const subjectCategoryTitles = filters.subjectCategories
      .map((slug) => {
        // Try to find subject category in current year
        const subjectCategory = yearData[year]?.subjectCategories.find((sc) => {
          return sc.slug === slug;
        });
        return subjectCategory?.title;
      })
      .filter(Boolean);

    if (subjectCategoryTitles.length > 0) {
      parts.push(subjectCategoryTitles.join(", "));
    }
  }

  // Handle child subjects (KS4)
  if (filters.childSubjects.length > 0) {
    const childSubjectTitles = filters.childSubjects
      .map((slug) => {
        const childSubject = yearData[year]?.childSubjects.find(
          (cs) => cs.subject_slug === slug,
        );
        return childSubject?.subject;
      })
      .filter(Boolean);

    if (childSubjectTitles.length > 0) {
      parts.push(childSubjectTitles.join(", "));
    }
  }

  // Handle tiers (KS4)
  if (filters.tiers.length > 0) {
    const tierTitles = filters.tiers
      .map((slug) => {
        const tier = yearData[year]?.tiers.find((t) => t.tier_slug === slug);
        return tier?.tier;
      })
      .filter(Boolean);

    if (tierTitles.length > 0) {
      parts.push(tierTitles.join(", "));
    }
  }

  return parts.length > 0 ? parts.join(", ") : null;
}

export function pluralizeUnits(count: number) {
  if (count > 1) {
    return "units";
  } else if (count === 1) {
    return "unit";
  }
  return "";
}

export function getPhaseFromCategory(input: DownloadCategory) {
  if (input === "KS3" || input === "KS4") {
    return "secondary";
  }
  return "primary";
}

export function getPathwaySuffix(year: string, pathway?: string) {
  if (["10", "11"].includes(year) && pathway) {
    if (pathway === "core") {
      return "Core";
    } else if (pathway === "non_core") {
      return "GCSE";
    }
  }
}

/**
 * Extracts plain text from an array of PortableTextBlock objects,
 * concatenates the text, and truncates it to a specified maximum length,
 * appending an ellipsis (...) if truncation occurs.
 *
 * @param blocks - An array of PortableTextBlock objects to extract text from.
 * @param maxLength - The maximum length of the truncated text. Defaults to 100.
 * @returns The truncated plain text string, or an empty string if no text could be extracted.
 */
export function truncatePortableTextBlock(
  blocks: PortableTextBlock[] | null | undefined,
  maxLength: number = 100,
): string {
  if (!blocks || blocks.length === 0) return "";

  let text = "";

  // Extract text from all blocks
  for (const block of blocks) {
    if (block._type === "block" && block.children) {
      for (const child of block.children) {
        if (child._type === "span" && child.text) {
          text += child.text + " ";
        }
      }
    }
  }

  text = text.trim();
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }

  return text;
}

export function getSubjectCategoryMessage(
  yearData: YearData,
  currentYear: string,
  subjectCategories: string[],
): string | null {
  if (subjectCategories.length === 0) return null;

  const years = Object.keys(yearData).sort(sortYears);
  const currentIndex = years.indexOf(currentYear);
  if (currentIndex === -1) return null;

  // Identify the current phase from the year number
  const phaseMap = {
    primary: { start: 1, end: 6 },
    secondary: { start: 7, end: 11 },
  };
  const currentYearNum = parseInt(currentYear.replace("year-", ""));
  const currentPhase = currentYearNum <= 6 ? "primary" : "secondary";

  const phaseStartNum = phaseMap[currentPhase].start;
  const phaseEndNum = phaseMap[currentPhase].end;

  // Convert phases to strings for easy comparison with "year-7"/"year-11" keys
  const phaseStartYear = `year-${phaseStartNum}`;
  const phaseEndYear = `year-${phaseEndNum}`;

  // Gather the subject category titles
  const subjectCategoryTitles = Array.from(
    new Set(
      years
        .flatMap((yearKey) =>
          yearData[yearKey]?.subjectCategories?.filter((sc) =>
            subjectCategories.includes(sc.slug),
          ),
        )
        .filter(Boolean)
        .map((sc) => sc?.title),
    ),
  );

  if (subjectCategoryTitles.length === 0) return null;

  // Check if the entire phase (not just the current year) has any units for the subject categories
  const hasAnyUnitsInPhase = years
    .filter((y) => {
      const yNum = parseInt(y.replace("year-", ""));
      // Filter only those years in the same phase as currentYear
      return currentPhase === "primary"
        ? yNum >= 1 && yNum <= 6
        : yNum >= 7 && yNum <= 11;
    })
    .some((yearKey) =>
      yearData[yearKey]?.units?.some((unit) =>
        unit.subjectcategories?.some((sc) =>
          subjectCategories.includes(sc.slug),
        ),
      ),
    );

  // Check if this current year has any units in the selected subject categories
  const hasCurrentYearUnits = yearData[currentYear]?.units?.some((unit) =>
    unit.subjectcategories?.some((sc) => subjectCategories.includes(sc.slug)),
  );

  if (!hasCurrentYearUnits) {
    // Find the first subsequent year (in the same phase) that does have units
    const subsequentYearsInPhase = years.slice(currentIndex + 1).filter((y) => {
      const yNum = parseInt(y.replace("year-", ""));
      return currentPhase === "primary"
        ? yNum >= 1 && yNum <= 6
        : yNum >= 7 && yNum <= 11;
    });

    const firstSubsequentYearWithUnits = subsequentYearsInPhase.find(
      (yearKey) =>
        yearData[yearKey]?.units?.some((unit) =>
          unit.subjectcategories?.some((sc) =>
            subjectCategories.includes(sc.slug),
          ),
        ),
    );

    // If there is a future year in this phase that has units:
    if (firstSubsequentYearWithUnits) {
      const cleanYear = firstSubsequentYearWithUnits.replace("year-", "");
      const isFirstYearOfPhase =
        currentYear === phaseStartYear || currentYearNum === phaseStartNum;
      return isFirstYearOfPhase
        ? `'${subjectCategoryTitles.join(
            ", ",
          )}' units start in Year ${cleanYear}`
        : `'${subjectCategoryTitles.join(
            ", ",
          )}' units continue in Year ${cleanYear}`;
    }

    // No future years in the phase that have units or we are at the end of the phase
    const allSubsequentInPhaseEmpty = subsequentYearsInPhase.every(
      (yearKey) =>
        !yearData[yearKey]?.units?.some((unit) =>
          unit.subjectcategories?.some((sc) =>
            subjectCategories.includes(sc.id.toString()),
          ),
        ),
    );

    if (
      currentYear === phaseEndYear ||
      !hasAnyUnitsInPhase ||
      allSubsequentInPhaseEmpty
    ) {
      return `No '${subjectCategoryTitles.join(
        ", ",
      )}' units in this year group`;
    }

    // Default fallback in case of edge conditions
    return `No '${subjectCategoryTitles.join(", ")}' units in this year group`;
  }

  // If the current year does have units do not show a message
  return null;
}

export function getFilename(
  fileExt: string,
  {
    subjectTitle,
    phaseTitle,
    examboardTitle,
    childSubjectSlug,
    tierSlug,
    suffix,
  }: {
    subjectTitle: string;
    phaseTitle: string;
    examboardTitle?: string | null;
    childSubjectSlug?: string;
    tierSlug?: string;
    suffix?: string;
  },
) {
  const pageTitle: string = [
    subjectTitle,
    phaseTitle,
    examboardTitle,
    capitalize(childSubjectSlug?.split("-").join(" ")),
    capitalize(tierSlug),
    suffix,
    format(
      Date.now(),
      // Note: dashes "-" rather than ":" because colon is invalid on windows
      "dd-MM-yyyy",
    ),
  ]
    .filter(Boolean)
    .join(" - ");

  return `${pageTitle}.${fileExt}`;
}

import { getProgrammeData } from "./getProgrammeData";
import { PageSearchParms } from "./page";

import { formatCurriculumUnitsData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { getYearGroupTitle } from "@/utils/curriculum/formatting";

export const getMetaTitle = (
  programmePageData: NonNullable<Awaited<ReturnType<typeof getProgrammeData>>>,
  searchParams: PageSearchParms,
) => {
  const {
    programmeUnitsData,
    curriculumUnitsData,
    curriculumPhaseOptions,
    subjectPhaseKeystageSlugs,
  } = programmePageData;

  const curriculumUnitsFormattedData =
    formatCurriculumUnitsData(curriculumUnitsData);

  const ks4Options =
    curriculumPhaseOptions.subjects.find(
      (s) => s.slug === subjectPhaseKeystageSlugs.subjectSlug,
    )?.ks4_options ?? [];
  const ks4Option = ks4Options.find(
    (ks4opt) => ks4opt.slug === subjectPhaseKeystageSlugs.ks4OptionSlug,
  );

  const { threads, years, keystages, tiers } = searchParams;

  const phaseSubjectSegment = `${programmeUnitsData.phaseTitle} ${programmeUnitsData.subjectTitle}`;

  const keystageSegment =
    typeof keystages === "string" ? keystages.toUpperCase() : null;
  const yearSegment =
    typeof years === "string"
      ? getYearGroupTitle(curriculumUnitsFormattedData.yearData, years)
      : "";
  const threadTitle = curriculumUnitsFormattedData.threadOptions.find(
    (t) => t.slug === threads,
  )?.title;
  const threadSegment =
    typeof threads === "string" && threadTitle ? ` - ${threadTitle}` : "";
  const tierSegment =
    typeof tiers === "string"
      ? ` ${tiers[0]?.toLocaleUpperCase() + tiers.slice(1)}`
      : "";
  const examboardSegment = ks4Option ? ` ${ks4Option.title}` : "";

  const baseMetaTitle = `Free ${phaseSubjectSegment}${tierSegment}${examboardSegment}${threadSegment} Lesson & Curriculum Resources | Oak National Academy`;
  const keystageMetaTitle = keystageSegment
    ? `Free ${keystageSegment} ${programmeUnitsData.subjectTitle}${tierSegment}${examboardSegment} Lesson & Curriculum Resources | Oak National Academy`
    : undefined;
  const yearsMetaTitle = yearSegment
    ? `Free ${yearSegment} ${programmeUnitsData.subjectTitle}${tierSegment}${examboardSegment} Lesson & Curriculum Resources | Oak National Academy`
    : undefined;
  const yearAndThreadMetaTitle =
    yearSegment && threadSegment
      ? `Free ${yearSegment} ${programmeUnitsData.subjectTitle}${tierSegment}${examboardSegment}${threadSegment} Lesson & Curriculum Resources | Oak National Academy`
      : undefined;

  const title =
    yearAndThreadMetaTitle ??
    yearsMetaTitle ??
    keystageMetaTitle ??
    baseMetaTitle;

  return title;
};

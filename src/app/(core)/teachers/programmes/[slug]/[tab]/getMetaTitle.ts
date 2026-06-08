import { getSubjectPhaseOptions } from "./getProgrammeData";
import { PageSearchParms } from "./page";

export const getMetaTitle = (
  subjectPhaseData: NonNullable<
    Awaited<ReturnType<typeof getSubjectPhaseOptions>>
  >,
  searchParams: PageSearchParms,
) => {
  const { subjects, subjectPhaseKeystageSlugs } = subjectPhaseData;

  const currentSubject = subjects.find(
    (s) => s.slug === subjectPhaseKeystageSlugs.subjectSlug,
  );

  if (!currentSubject) {
    return {
      title: "Free lesson and curriculum resources",
      description: "Get fully sequenced teaching resources and lesson plans",
    };
  }

  const ks4Options = currentSubject?.ks4_options ?? [];
  const ks4Option = ks4Options.find(
    (ks4opt) => ks4opt.slug === subjectPhaseKeystageSlugs.ks4OptionSlug,
  );

  const { threads, years, keystages, tiers } = searchParams;

  const phaseTitle = currentSubject.phases.find(
    (p) => p.slug === subjectPhaseKeystageSlugs.phaseSlug,
  )?.title;
  const phaseSubjectSegment = `${phaseTitle} ${currentSubject.title}`;

  const keystageSegment =
    typeof keystages === "string" ? keystages.toUpperCase() : null;

  const getYearTitle = (year: string) =>
    year === "all-years" ? "All Years" : `Y${year}`;
  const yearSegment = typeof years === "string" ? getYearTitle(years) : "";

  const threadTitle =
    typeof threads === "string" && threads
      ? threads.replaceAll("-", " ")
      : undefined;
  const threadSegment = threadTitle ? ` - ${threadTitle}` : "";
  const tierSegment =
    typeof tiers === "string"
      ? ` ${tiers[0]?.toLocaleUpperCase() + tiers.slice(1)}`
      : "";
  const examboardSegment = ks4Option ? ` ${ks4Option.title}` : "";

  let title = `Free ${phaseSubjectSegment}${tierSegment}${examboardSegment}${threadSegment} Lesson & Curriculum Resources`;

  if (yearSegment) {
    title = `Free ${yearSegment} ${currentSubject.title}${tierSegment}${examboardSegment}${threadSegment} Lesson & Curriculum Resources`;
  }

  if (keystageSegment) {
    title = `Free ${keystageSegment} ${currentSubject.title}${tierSegment}${examboardSegment} Lesson & Curriculum Resources`;
  }

  const description = `Get fully sequenced teaching resources and lesson plans for ${phaseTitle} ${currentSubject.title}`;

  return { title, description };
};

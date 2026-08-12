import { getSubjectPhaseOptions } from "./getProgrammeData";
import { PageSearchParms } from "./page";

export const getMetaTitle = (
  subjectPhaseData: NonNullable<
    Awaited<ReturnType<typeof getSubjectPhaseOptions>>
  >,
  searchParams?: PageSearchParms,
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

  const phaseTitle = currentSubject.phases.find(
    (p) => p.slug === subjectPhaseKeystageSlugs.phaseSlug,
  )?.title;
  const phaseSubjectSegment = `${phaseTitle} ${currentSubject.title}`;

  const keystageSegment =
    typeof searchParams?.keystages === "string"
      ? searchParams.keystages.toUpperCase()
      : null;

  const getYearTitle = (year: string) =>
    year === "all-years" ? "All Years" : `Y${year}`;
  const yearSegment =
    typeof searchParams?.years === "string"
      ? getYearTitle(searchParams.years)
      : "";

  const threadTitle =
    typeof searchParams?.threads === "string" && searchParams?.threads
      ? searchParams.threads.replaceAll("-", " ")
      : undefined;
  const threadSegment = threadTitle ? ` - ${threadTitle}` : "";
  const tierSegment =
    typeof searchParams?.tiers === "string"
      ? ` ${searchParams.tiers[0]?.toLocaleUpperCase() + searchParams.tiers.slice(1)}`
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

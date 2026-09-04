import { getSubjectPhaseOptions } from "./getProgrammeData";
import { PageSearchParms } from "./page";

import { CurriculumPhaseOption } from "@/node-lib/curriculum-api-2023";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

type SubjectPhaseData = NonNullable<
  Awaited<ReturnType<typeof getSubjectPhaseOptions>>
>;

export const getMetaTitle = (
  subjectPhaseData: SubjectPhaseData,
  searchParams?: PageSearchParms,
) => {
  const { subjectPhaseKeystageSlugs } = subjectPhaseData;

  const currentSubject = getCurrentSubject(subjectPhaseData);

  if (!currentSubject) {
    return {
      title: "Free lesson and curriculum resources",
      description: "Get fully sequenced teaching resources and lesson plans",
    };
  }

  const { examboardSegment, isGcseOption } = getKs4Option({
    currentSubject,
    subjectPhaseKeystageSlugs,
  });

  const phaseTitle = currentSubject.phases.find(
    (p) => p.slug === subjectPhaseKeystageSlugs.phaseSlug,
  )?.title;
  const phaseSubjectSegment = `${phaseTitle} ${currentSubject.title}`;

  const keystageSegment =
    typeof searchParams?.keystages === "string"
      ? searchParams.keystages.toUpperCase()
      : null;

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

  let title = `Free ${phaseSubjectSegment}${tierSegment}${examboardSegment}${threadSegment} Lesson & Curriculum Resources`;

  if (yearSegment) {
    const isGcseYear =
      searchParams?.years === "10" || searchParams?.years === "11";
    const gcseSegment = isGcseOption && isGcseYear ? "GCSE " : "";
    title = `Free ${gcseSegment}${yearSegment} ${currentSubject.title}${tierSegment}${examboardSegment}${threadSegment} Lesson & Curriculum Resources`;
  }

  if (keystageSegment) {
    const isGcseKeystage = searchParams?.keystages === "ks4";
    const gcseSegment = isGcseOption && isGcseKeystage ? "GCSE " : "";
    title = `Free ${gcseSegment}${keystageSegment} ${currentSubject.title}${tierSegment}${examboardSegment} Lesson & Curriculum Resources`;
  }

  const description = `Get fully sequenced teaching resources and lesson plans for ${phaseTitle} ${currentSubject.title}`;

  return { title, description };
};

const getCurrentSubject = (subjectPhaseData: SubjectPhaseData) => {
  const { subjects, subjectPhaseKeystageSlugs } = subjectPhaseData;

  return subjects.find((s) => s.slug === subjectPhaseKeystageSlugs.subjectSlug);
};

const getKs4Option = ({
  currentSubject,
  subjectPhaseKeystageSlugs,
}: {
  currentSubject: CurriculumPhaseOption;
  subjectPhaseKeystageSlugs: CurriculumSelectionSlugs;
}) => {
  const ks4Options = currentSubject?.ks4_options ?? [];
  const ks4Option = ks4Options.find(
    (ks4opt) => ks4opt.slug === subjectPhaseKeystageSlugs.ks4OptionSlug,
  );
  const isGcseOption = ks4Option && ks4Option.slug !== "core";
  const examboardSegment = ks4Option ? ` ${ks4Option.title}` : "";
  return { isGcseOption, examboardSegment };
};

const getYearTitle = (year: string) =>
  year === "all-years" ? "All Years" : `Y${year}`;

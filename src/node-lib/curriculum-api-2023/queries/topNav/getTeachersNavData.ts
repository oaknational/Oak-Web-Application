import slugify from "slugify";

import {
  TopNavResponse,
  TeachersBrowse,
  TeachersBrowseChildItem,
  ProgrammeFactorButton,
  SubjectsNavItem,
  Phase,
} from "./topNav.schema";
import {
  getTeachersExamBoardNavHref,
  getTeachersSubjectNavHref,
} from "./getTeachersNavHrefs";

import { CurriculumPhaseOptions } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.query";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";

type TopNavProgramme = TopNavResponse["programmes"][number];

const isNonLegacyProgramme = (programme: TopNavProgramme) =>
  programme.programme_fields.dataset !== "legacy" &&
  !isSlugLegacy(programme.programme_slug);

const filterLegacyWhenNonLegacyExists = (programmes: TopNavProgramme[]) => {
  const hasNonLegacyProgramme = programmes.some(isNonLegacyProgramme);

  if (!hasNonLegacyProgramme) {
    return programmes;
  }

  return programmes.filter(isNonLegacyProgramme);
};
const getSubjectDisplayTitle = (programme: TopNavProgramme) => {
  const subjectDisplayName =
    programme.actions?.programme_field_overrides?.subject ??
    programme.programme_fields.subject;
  const pathwayTitle = programme.programme_fields.pathway ?? "";

  return `${subjectDisplayName}${pathwayTitle && ` (${pathwayTitle})`}`;
};

const normalizePhaseSlugForHref = (
  phaseSlug: TopNavProgramme["programme_fields"]["phase_slug"],
): Phase => (phaseSlug === "secondary" ? "secondary" : "primary");

/**
 * Removes duplicated exam boards for subjects appearing multiple times due to having a parent subject e.g. Science
 * Takes parent subject and merges all exam boards from its children and assigns them to the parent
 */
const handleParentSubjectChildren = () => {
  const phaseChildren = new Map<string, SubjectsNavItem>();
  // Reduces exam boards where examboard and tier are the same
  const deduplicateExamBoards = (examBoards: ProgrammeFactorButton[]) => {
    return examBoards.filter(
      (item, index, allExamBoards) =>
        allExamBoards.findIndex(
          (candidate) =>
            candidate.programmeFactors?.examboard?.slug ===
              item.programmeFactors?.examboard?.slug &&
            candidate.programmeFactors?.tier?.slug ===
              item.programmeFactors?.tier?.slug,
        ) === index,
    );
  };

  /**
   * Updates or creates a phase child subject, accumulating programme counts and exam boards where needed
   */
  const updatePhaseChild = ({
    key,
    title,
    slug,
    href,
    nonCurriculum,
    programmeSlug,
    pathwaySlug,
    subjectParent,
    examBoards,
  }: {
    key: string;
    title: string;
    slug: string;
    href: string;
    nonCurriculum: boolean;
    programmeSlug: string;
    pathwaySlug: string | null;
    subjectParent: string | null;
    examBoards?: ProgrammeFactorButton[];
  }) => {
    const existing = phaseChildren.get(key);

    if (!existing) {
      phaseChildren.set(key, {
        title,
        slug,
        href,
        nonCurriculum,
        programmeSlug,
        programmeCount: 1,
        pathwaySlug,
        subjectParent,
        ...(examBoards ? { examBoards } : {}),
      });
      return;
    }

    const mergedExamBoards = deduplicateExamBoards([
      ...(existing.examBoards ?? []),
      ...(examBoards ?? []),
    ]);

    const updatedChild: SubjectsNavItem = {
      ...existing,
      programmeSlug: null,
      programmeCount: existing.programmeCount + 1,
    };

    if (mergedExamBoards.length > 0) {
      updatedChild.examBoards = mergedExamBoards;
    }

    phaseChildren.set(key, updatedChild);
  };

  /**
   * Updates or creates a phase child subject for a parent, accumulating programme counts and exam boards where needed
   */
  const updateParentExamBoardsOnPhaseChild = ({
    parentSlug,
    parentTitle,
    href,
    nonCurriculum,
    examBoards,
  }: {
    parentSlug: string;
    parentTitle: string;
    href: string;
    nonCurriculum: boolean;
    examBoards: ProgrammeFactorButton[];
  }) => {
    const key = `${parentSlug}-`;
    const existing = phaseChildren.get(key);

    if (!existing) {
      phaseChildren.set(key, {
        title: parentTitle,
        slug: parentSlug,
        href,
        nonCurriculum,
        programmeSlug: null,
        programmeCount: 1,
        pathwaySlug: null,
        subjectParent: null,
        ...(examBoards.length ? { examBoards } : {}),
      });
      return;
    }

    const mergedExamBoards = deduplicateExamBoards([
      ...(existing.examBoards ?? []),
      ...examBoards,
    ]);

    const updatedParent: SubjectsNavItem = {
      ...existing,
      programmeSlug: null,
    };

    if (mergedExamBoards.length > 0) {
      updatedParent.examBoards = mergedExamBoards;
    }

    phaseChildren.set(key, updatedParent);
  };

  const values = () => Array.from(phaseChildren.values());

  return {
    phaseChildren,
    updatePhaseChild: updatePhaseChild,
    updateParentExamBoardsOnPhaseChild: updateParentExamBoardsOnPhaseChild,
    values,
  };
};

export const getExamBoardsForKS4Subject = ({
  data,
  subjectSlug,
  pathwaySlug,
  phaseSlug,
  keystageSlug,
  subjectParent,
  includeChildSubjects = true,
}: {
  data: TopNavResponse;
  subjectSlug: string;
  pathwaySlug: string | null;
  phaseSlug: string;
  keystageSlug?: string | null;
  subjectParent?: string | null;
  includeChildSubjects?: boolean;
}): ProgrammeFactorButton[] => {
  const matchingProgrammes = data.programmes
    .filter((p) => {
      const { subject_slug, phase_slug, pathway_slug, keystage_slug } =
        p.programme_fields;
      return (
        phase_slug === phaseSlug &&
        subject_slug === subjectSlug &&
        pathway_slug === pathwaySlug &&
        (keystageSlug ? keystage_slug === keystageSlug : true)
      );
    })
    .filter(
      (p, i, a) =>
        a.findIndex((k) => k.programme_slug === p.programme_slug) === i,
    );

  const programmesForKs = filterLegacyWhenNonLegacyExists(matchingProgrammes);

  const examBoards: ProgrammeFactorButton[] =
    programmesForKs.flatMap<ProgrammeFactorButton>((p) => {
      const { examboard, examboard_slug, tier_slug, tier_description } =
        p.programme_fields;

      if (examboard && examboard_slug) {
        return [
          {
            buttonTitle: examboard,
            programmeSlug: p.programme_slug,
            href: getTeachersExamBoardNavHref({
              subjectSlug,
              keystageSlug: keystageSlug ?? null,
              phaseSlug: p.programme_fields.phase_slug,
              subjectParent,
              examboardSlug: examboard_slug,
              tierSlug: tier_slug,
              includeChildSubjects,
            }),
            programmeFactors: {
              tier: { slug: tier_slug, description: tier_description },
              examboard: { slug: examboard_slug, title: examboard },
            },
          },
        ];
      }

      if (tier_slug && tier_description) {
        return [
          {
            buttonTitle: tier_description,
            programmeSlug: p.programme_slug,
            href: getTeachersExamBoardNavHref({
              subjectSlug,
              phaseSlug: p.programme_fields.phase_slug,
              keystageSlug: keystageSlug ?? null,
              subjectParent,
              tierSlug: tier_slug,
              includeChildSubjects,
            }),
            programmeFactors: {
              tier: { slug: tier_slug, description: tier_description },
            },
          },
        ];
      }

      return [];
    });

  return examBoards;
};

const isKs3BaseProgramme = (programme: TopNavProgramme) =>
  programme.programme_fields.keystage_slug === "ks3" &&
  programme.programme_fields.pathway_slug === null;

const isKs4ChildProgramme = (programme: TopNavProgramme) =>
  programme.programme_fields.keystage_slug === "ks4" &&
  programme.programme_fields.subject_parent;

const getProgrammeSubjectKey = (programme: TopNavProgramme) =>
  `${programme.programme_fields.subject_parent ?? ""}:${programme.programme_fields.subject_slug}`;

const getSubjectsByPhase = (
  teachersData: TopNavResponse,
  phaseSlug: Phase,
  curriculumPhaseOptionsWithoutCore: CurriculumPhaseOptions,
): {
  slug: string;
  title: string;
  description: string;
  children: SubjectsNavItem[];
}[] => {
  // Filter "base" subjects not needed at phase level, e.g. Citizenship for KS3 where core and gcse exist
  const relevantPhaseSlugs =
    phaseSlug === "primary" ? ["primary", "foundation"] : ["secondary"];

  const phaseProgrammes = teachersData.programmes.filter((programme) =>
    relevantPhaseSlugs.includes(programme.programme_fields.phase_slug),
  );

  const filteredPhaseProgrammes =
    filterLegacyWhenNonLegacyExists(phaseProgrammes);
  const { subjectsWithKs4Children, subjectsWithKs4Pathways } =
    deriveKs4SubjectSets(filteredPhaseProgrammes);
  const phaseChildrenAccumulator = handleParentSubjectChildren();

  filteredPhaseProgrammes.forEach((programme) => {
    // Filter out duplicate programmes where a KS3 subject is navigable by the exam board panel
    if (
      isKs3BaseProgramme(programme) &&
      subjectsWithKs4Pathways.has(getProgrammeSubjectKey(programme))
    ) {
      return;
    }

    const { subject_slug, subject_parent, keystage_slug } =
      programme.programme_fields;
    const pathwaySlug = programme.programme_fields.pathway_slug ?? null;
    const parentSubjectSlug = subject_parent
      ? slugify(subject_parent).toLocaleLowerCase()
      : subject_slug;
    const phaseSlugForHref = normalizePhaseSlugForHref(
      programme.programme_fields.phase_slug,
    );

    // Handle parent subjects first with exam boards from all children, e.g. Science
    if (isKs4ChildProgramme(programme)) {
      const parentHref = getTeachersSubjectNavHref({
        subject: {
          slug: parentSubjectSlug,
          pathwaySlug: null,
          programmeSlug: programme.programme_slug,
        },
        phaseSlug: phaseSlugForHref,
        curriculumPhaseOptionsSubjects: curriculumPhaseOptionsWithoutCore,
      });

      const parentExamBoards = getExamBoardsForKS4Subject({
        data: teachersData,
        phaseSlug,
        subjectSlug: subject_slug,
        pathwaySlug,
        subjectParent: subject_parent,
        includeChildSubjects: false,
      });

      phaseChildrenAccumulator.updateParentExamBoardsOnPhaseChild({
        parentSlug: parentSubjectSlug,
        parentTitle: subject_parent ?? subject_slug,
        href: parentHref,
        nonCurriculum: Boolean(programme.features.non_curriculum),
        examBoards: parentExamBoards,
      });

      return;
    }

    const hasKs4Children = subjectsWithKs4Children.has(subject_slug);
    const childKey = hasKs4Children
      ? `${subject_slug}-`
      : `${subject_slug}-${pathwaySlug ?? ""}`;

    const childHref = getTeachersSubjectNavHref({
      subject: {
        slug: subject_slug,
        pathwaySlug,
        programmeSlug: programme.programme_slug,
      },
      phaseSlug: phaseSlugForHref,
      curriculumPhaseOptionsSubjects: curriculumPhaseOptionsWithoutCore,
    });

    const examBoards =
      keystage_slug === "ks4" && !subject_parent
        ? getExamBoardsForKS4Subject({
            data: teachersData,
            phaseSlug,
            subjectSlug: subject_slug,
            pathwaySlug,
            includeChildSubjects: false,
          })
        : undefined;

    phaseChildrenAccumulator.updatePhaseChild({
      key: childKey,
      title: getSubjectDisplayTitle(programme),
      slug: subject_slug,
      href: childHref,
      nonCurriculum: Boolean(programme.features.non_curriculum),
      programmeSlug: programme.programme_slug,
      pathwaySlug,
      subjectParent: subject_parent ?? null,
      examBoards,
    });
  });

  const orderedChildren = splitAndSortSubjectsByCurriculum(
    phaseChildrenAccumulator.values(),
  );

  return [
    {
      slug: phaseSlug,
      title: `${phaseSlug[0]?.toUpperCase()}${phaseSlug.slice(1)}`,
      description: "",
      children: orderedChildren,
    },
  ] as Omit<TeachersBrowseChildItem, "type">[];
};

const deriveKs4SubjectSets = (programmes: TopNavProgramme[]) => {
  const subjectsWithKs4Children = new Set(
    programmes
      .filter(
        (programme) =>
          programme.programme_fields.keystage_slug === "ks4" &&
          Boolean(programme.programme_fields.subject_parent),
      )
      .map((programme) =>
        slugify(
          programme.programme_fields.subject_parent as string,
        ).toLocaleLowerCase(),
      ),
  );

  const subjectsWithKs4Pathways = new Set(
    programmes
      .filter(
        (programme) =>
          programme.programme_fields.keystage_slug === "ks4" &&
          programme.programme_fields.pathway_slug !== null &&
          !subjectsWithKs4Children.has(programme.programme_fields.subject_slug),
      )
      .map(getProgrammeSubjectKey),
  );

  return {
    subjectsWithKs4Children,
    subjectsWithKs4Pathways,
  };
};

const removeLegacyWhenCounterpartExists = (
  programme: TopNavProgramme,
  programmes: TopNavProgramme[],
) => {
  if (!isSlugLegacy(programme.programme_slug)) {
    return false;
  }

  const legacySubject = programme.programme_fields.subject_slug;
  const legacyKeystage = programme.programme_fields.keystage_slug;

  return programmes.some(
    (candidate) =>
      candidate.programme_fields.subject_slug === legacySubject &&
      candidate.programme_fields.keystage_slug === legacyKeystage &&
      !isSlugLegacy(candidate.programme_slug),
  );
};

/**
 * Sort subjects alphabetically with non-curriculum subjects at the end of the list
 */
const splitAndSortSubjectsByCurriculum = (subjects: SubjectsNavItem[]) => {
  const sortByTitle = (a: SubjectsNavItem, b: SubjectsNavItem) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" });

  const curriculumSubjects = subjects
    .filter((subject) => !subject.nonCurriculum)
    .sort(sortByTitle);
  const nonCurriculumSubjects = subjects
    .filter((subject) => subject.nonCurriculum)
    .sort(sortByTitle);

  return [...curriculumSubjects, ...nonCurriculumSubjects];
};

const getKeystages = (
  data: TopNavResponse,
  phaseSlug: Phase | "foundation",
  curriculumPhaseOptionsSubjects: CurriculumPhaseOptions,
) => {
  // Get all programmes for the given phase
  const programmesInPhase = data.programmes.filter(
    (p) => p.programme_fields.phase_slug === phaseSlug,
  );

  // Get all keystages associated with that phase and reduce to unique values
  const uniqueKeystages = programmesInPhase
    .map((p) => ({
      slug: p.programme_fields.keystage_slug,
      title: p.programme_fields.keystage,
      description: p.programme_fields.keystage_description,
    }))
    .filter((p, i, a) => a.findIndex((k) => k.slug === p.slug) === i);

  // Expand each keystage with its associated subjects, filtering out duplicates for each programme
  const keystagesWithSubjects = uniqueKeystages.map((ks) => {
    const subjects = programmesInPhase
      .filter((p) => p.programme_fields.keystage_slug === ks.slug)
      .filter(
        (p, i, a) =>
          a.findIndex(
            (k) =>
              k.programme_fields.subject_slug ===
                p.programme_fields.subject_slug &&
              k.programme_fields.pathway_slug ===
                p.programme_fields.pathway_slug,
          ) === i,
      )
      // remove legacy programmes where a non-legacy counterpart exists
      .filter((p, _, a) => !removeLegacyWhenCounterpartExists(p, a))
      .map((p) => {
        const programmeCount = getProgrammeCount({
          data,
          keystageSlug: ks.slug,
          subjectSlug: p.programme_fields.subject_slug,
          pathwaySlug: p.programme_fields.pathway_slug,
        });

        const title = getSubjectDisplayTitle(p);

        const subjectSlug = p.programme_fields.subject_slug;
        const pathwaySlug = p.programme_fields.pathway_slug ?? null;
        const programmeSlug = programmeCount > 1 ? null : p.programme_slug;
        const subjectParent = p.programme_fields.subject_parent ?? null;

        const subjectNavItem = {
          slug: subjectSlug,
          title,
          nonCurriculum: Boolean(p.features.non_curriculum),
          programmeSlug,
          programmeCount,
          pathwaySlug,
          subjectParent,
        };

        const href = getTeachersSubjectNavHref({
          subject: subjectNavItem,
          keyStageSlug: ks.slug,
          phaseSlug: normalizePhaseSlugForHref(phaseSlug),
          curriculumPhaseOptionsSubjects,
        });

        const examBoardsData =
          ks.slug === "ks4" && programmeCount > 1
            ? getExamBoardsForKS4Subject({
                data,
                keystageSlug: ks.slug,
                phaseSlug,
                subjectSlug,
                pathwaySlug,
                subjectParent,
              })
            : null;

        return {
          ...subjectNavItem,
          href,
          ...(examBoardsData ? { examBoards: examBoardsData } : {}),
        };
      });

    return {
      ...ks,
      children: splitAndSortSubjectsByCurriculum(subjects),
    };
  });

  return keystagesWithSubjects;
};

const deduplicateProgrammesBySlug = (programmes: TopNavProgramme[]) =>
  programmes.filter(
    (programme, index, allProgrammes) =>
      allProgrammes.findIndex(
        (candidate) => candidate.programme_slug === programme.programme_slug,
      ) === index,
  );

/**
 * Filter out legacy programmes when there are only 2 programmes and one is legacy
 */
const filterLegacyProgrammes = (programmes: TopNavProgramme[]) => {
  const onlyTwoProgrammes = programmes.length === 2;

  if (
    onlyTwoProgrammes &&
    programmes.some(
      (programme) => programme.programme_fields.dataset === "legacy",
    )
  ) {
    return programmes.filter(
      (programme) => programme.programme_fields.dataset !== "legacy",
    );
  }

  return programmes;
};

export const getProgrammeCount = ({
  data,
  keystageSlug,
  subjectSlug,
  pathwaySlug,
}: {
  data: TopNavResponse;
  keystageSlug: string;
  subjectSlug: string;
  pathwaySlug: string | null;
}) => {
  const programmesForKs = deduplicateProgrammesBySlug(
    data.programmes
      // get all programmes for the given subject, keystage and pathway
      .filter((p) => {
        const { subject_slug, keystage_slug, pathway_slug } =
          p.programme_fields;
        return (
          keystage_slug === keystageSlug &&
          subject_slug === subjectSlug &&
          pathway_slug === pathwaySlug
        );
      }),
  );
  const filteredProgrammesForKs = filterLegacyProgrammes(programmesForKs);

  return filteredProgrammesForKs.length;
};

export const getTeachersNavData = (
  teachersData: TopNavResponse,
  phaseSlug: Phase,
  curriculumPhaseOptionsSubjects: CurriculumPhaseOptions,
): TeachersBrowse => {
  const keystagesForPhase = getKeystages(
    teachersData,
    phaseSlug,
    curriculumPhaseOptionsSubjects,
  );
  const subjectsForPhase = getSubjectsByPhase(
    teachersData,
    phaseSlug,
    curriculumPhaseOptionsSubjects,
  );

  const keystageItems: TeachersBrowseChildItem[] = (
    phaseSlug === "primary"
      ? keystagesForPhase.concat(
          getKeystages(
            teachersData,
            "foundation",
            curriculumPhaseOptionsSubjects,
          ),
        )
      : keystagesForPhase
  ).map((item) => ({ ...item, type: "keystage" as const }));

  const phaseItems: TeachersBrowseChildItem[] = subjectsForPhase.map(
    (item) => ({ ...item, type: "phase" as const }),
  );

  return {
    slug: phaseSlug,
    title: `${phaseSlug[0]?.toUpperCase()}${phaseSlug.slice(1)}` as
      | "Primary"
      | "Secondary",
    children: [...keystageItems, ...phaseItems],
  };
};

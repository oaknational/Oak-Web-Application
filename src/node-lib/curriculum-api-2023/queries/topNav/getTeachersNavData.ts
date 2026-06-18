import slugify from "slugify";

import {
  TopNavResponse,
  TeachersBrowse,
  Ks4OptionsMenu,
  KeystageMenu,
  PhaseSlug,
  SubjectsMenu,
  PhaseMenu,
  PhaseTitle,
  getPhaseTitle,
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
  return subjectDisplayName + (pathwayTitle ? ` (${pathwayTitle})` : "");
};

const normalizePhaseSlugForHref = (
  phaseSlug: TopNavProgramme["programme_fields"]["phase_slug"],
): PhaseSlug => (phaseSlug === "secondary" ? "secondary" : "primary");

/**
 * Removes duplicated exam boards for subjects appearing multiple times due to having a parent subject e.g. Science
 * Takes parent subject and merges all exam boards from its children and assigns them to the parent
 */
const handleParentSubjectChildren = () => {
  const phaseChildren = new Map<string, SubjectsMenu>();
  // Reduces exam boards where examboard and tier are the same
  const deduplicateExamBoards = (examBoards: Ks4OptionsMenu[]) => {
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
    examBoards?: Ks4OptionsMenu[];
  }) => {
    const existing = phaseChildren.get(key);

    if (!existing) {
      phaseChildren.set(key, {
        title,
        slug,
        subjectSlug: slug,
        href,
        nonCurriculum,
        programmeSlug,
        programmeCount: 1,
        pathwaySlug,
        subjectParent,
        children: examBoards ?? null,
      });
      return;
    }

    const mergedExamBoards = deduplicateExamBoards([
      ...(existing.children ?? []),
      ...(examBoards ?? []),
    ]);

    const updatedChild: SubjectsMenu = {
      ...existing,
      programmeSlug: null,
      programmeCount: existing.programmeCount + 1,
    };

    if (mergedExamBoards.length > 0) {
      updatedChild.children = mergedExamBoards;
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
    examBoards: Ks4OptionsMenu[];
  }) => {
    const key = `${parentSlug}-`;
    const existing = phaseChildren.get(key);

    if (!existing) {
      phaseChildren.set(key, {
        title: parentTitle,
        slug: parentSlug,
        subjectSlug: parentSlug,
        href,
        nonCurriculum,
        programmeSlug: null,
        programmeCount: 1,
        pathwaySlug: null,
        subjectParent: null,
        children: examBoards ?? null,
      });
      return;
    }

    const mergedExamBoards = deduplicateExamBoards([
      ...(existing.children ?? []),
      ...examBoards,
    ]);

    const updatedParent: SubjectsMenu = {
      ...existing,
      programmeSlug: null,
    };

    if (mergedExamBoards.length > 0) {
      updatedParent.children = mergedExamBoards;
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
}: {
  data: TopNavResponse;
  subjectSlug: string;
  pathwaySlug: string | null;
  phaseSlug: string;
  keystageSlug?: string | null;
  subjectParent?: string | null;
}): Ks4OptionsMenu[] => {
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

  const examboards: Ks4OptionsMenu[] = programmesForKs.flatMap<Ks4OptionsMenu>(
    (p) => {
      const { examboard, examboard_slug, tier_slug, tier_description } =
        p.programme_fields;

      if (!examboard_slug && !tier_slug) {
        return [];
      }

      const title = examboard && examboard_slug ? examboard : tier_description;
      return {
        title: title ?? "",
        slug: p.programme_slug,
        href: getTeachersExamBoardNavHref({
          subjectSlug,
          phaseSlug: p.programme_fields.phase_slug,
          subjectParent,
          tierSlug: tier_slug,
          examboardSlug: examboard_slug,
          keystageSlug,
        }),
        programmeFactors: {
          tier:
            tier_slug && tier_description
              ? { slug: tier_slug, description: tier_description }
              : null,
          examboard:
            examboard && examboard_slug
              ? { slug: examboard_slug, title: examboard }
              : null,
        },
      };
    },
  );

  return examboards;
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
  phaseSlug: PhaseSlug,
  curriculumPhaseOptionsWithoutCore: CurriculumPhaseOptions,
): PhaseMenu[] => {
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
      title:
        `${phaseSlug[0]?.toUpperCase()}${phaseSlug.slice(1)}` as PhaseTitle, // TODO
      children: orderedChildren,
    },
  ] satisfies PhaseMenu[];
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
const splitAndSortSubjectsByCurriculum = (subjects: SubjectsMenu[]) => {
  const sortByTitle = (a: SubjectsMenu, b: SubjectsMenu) =>
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
  phaseSlug: PhaseSlug | "foundation",
  curriculumPhaseOptionsSubjects: CurriculumPhaseOptions,
): KeystageMenu[] => {
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
        const slug = `${subjectSlug}${pathwaySlug ? "-" : ""}${pathwaySlug ?? ""}`;
        const nonCurriculum = Boolean(p.features.non_curriculum);

        const href = getTeachersSubjectNavHref({
          subject: {
            slug: subjectSlug,
            programmeSlug,
            pathwaySlug,
          },
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
          title,
          slug,
          href,
          subjectSlug,
          nonCurriculum: nonCurriculum,
          programmeSlug: programmeSlug,
          programmeCount: programmeCount,
          children: examBoardsData ?? null,
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
  phaseSlug: PhaseSlug,
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

  const keystageItems: KeystageMenu[] = (
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

  return {
    slug: phaseSlug,
    title: getPhaseTitle(phaseSlug),
    children: [...keystageItems, ...subjectsForPhase],
  };
};

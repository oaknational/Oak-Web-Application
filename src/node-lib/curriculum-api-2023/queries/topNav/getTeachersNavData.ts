import {
  TopNavResponse,
  TeachersBrowse,
  TeachersBrowseChildItem,
  ProgrammeFactorButton,
  SubjectsNavItem,
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

export const getTeachersNavData = (
  teachersData: TopNavResponse,
  phaseSlug: "primary" | "secondary",
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

const getSubjectsByPhase = (
  teachersData: TopNavResponse,
  phaseSlug: "primary" | "secondary",
  curriculumPhaseOptionsWithoutCore: CurriculumPhaseOptions,
): {
  slug: string;
  title: string;
  description: string;
  children: SubjectsNavItem[];
}[] => {
  const relevantPhaseSlugs =
    phaseSlug === "primary" ? ["primary", "foundation"] : ["secondary"];

  const phaseProgrammes = teachersData.programmes.filter((programme) =>
    relevantPhaseSlugs.includes(programme.programme_fields.phase_slug),
  );

  const filteredPhaseProgrammes =
    filterLegacyWhenNonLegacyExists(phaseProgrammes);

  const subjectKey = (p: TopNavProgramme) =>
    `${p.programme_fields.subject_parent ?? ""}::${p.programme_fields.subject_slug}`;

  const subjectsWithKs4Pathways = new Set(
    filteredPhaseProgrammes
      .filter(
        (p) =>
          p.programme_fields.keystage_slug === "ks4" &&
          p.programme_fields.pathway_slug !== null,
      )
      .map(subjectKey),
  );

  const phaseChildren = new Map<string, SubjectsNavItem>();

  filteredPhaseProgrammes.forEach((programme) => {
    // Filter out duplicate programmes where a KS3 subject is navigable by the exam board panel
    const isKs3Base =
      programme.programme_fields.keystage_slug === "ks3" &&
      programme.programme_fields.pathway_slug === null;

    if (isKs3Base && subjectsWithKs4Pathways.has(subjectKey(programme))) {
      return;
    }

    const { subject_slug, subject_parent, keystage_slug } =
      programme.programme_fields;
    const pathwaySlug = programme.programme_fields.pathway_slug ?? null;
    const pathwayTitle = programme.programme_fields.pathway ?? "";

    const subjectDisplayName =
      programme.actions?.programme_field_overrides?.subject ??
      programme.programme_fields.subject;

    const title =
      subjectDisplayName + (pathwayTitle ? ` (${pathwayTitle})` : "");
    const mapKey = `${subject_slug}-${pathwaySlug ?? ""}`;

    const href = getTeachersSubjectNavHref({
      subject: {
        slug: subject_parent ?? subject_slug,
        pathwaySlug,
        programmeSlug: programme.programme_slug,
      },
      phaseSlug:
        programme.programme_fields.phase_slug === "foundation"
          ? "primary"
          : programme.programme_fields.phase_slug,
      curriculumPhaseOptionsSubjects: curriculumPhaseOptionsWithoutCore,
    });

    const examBoards =
      keystage_slug === "ks4"
        ? getExamBoardsForKS4Subject({
            data: teachersData,
            phaseSlug,
            subjectSlug: subject_slug,
            pathwaySlug,
            subjectParent: subject_parent ?? null,
          })
        : undefined;

    phaseChildren.set(mapKey, {
      title,
      slug: subject_slug,
      href,
      nonCurriculum: Boolean(programme.features.non_curriculum),
      programmeSlug: programme.programme_slug,
      programmeCount: 1,
      pathwaySlug,
      subjectParent: subject_parent ?? null,
      ...(examBoards ? { examBoards } : {}),
    });
  });

  const orderedPhaseChildren = Array.from(phaseChildren.values());
  const curriculumChildren = orderedPhaseChildren.filter(
    (s) => !s.nonCurriculum,
  );
  const nonCurriculumChildren = orderedPhaseChildren.filter(
    (s) => s.nonCurriculum,
  );

  return [
    {
      slug: phaseSlug,
      title: `${phaseSlug[0]?.toUpperCase()}${phaseSlug.slice(1)}`,
      description: "",
      children: [...curriculumChildren, ...nonCurriculumChildren],
    },
  ] as Omit<TeachersBrowseChildItem, "type">[];
};

const getKeystages = (
  data: TopNavResponse,
  phaseSlug: "primary" | "secondary" | "foundation",
  curriculumPhaseOptionsSubjects: CurriculumPhaseOptions,
) => {
  // Get all programmes for the given phase
  const byPhase = data.programmes.filter(
    (p) => p.programme_fields.phase_slug === phaseSlug,
  );

  // Get all keystages associated with that phase and reduce to unique values
  const byKeystage = byPhase
    .map((p) => ({
      slug: p.programme_fields.keystage_slug,
      title: p.programme_fields.keystage,
      description: p.programme_fields.keystage_description,
    }))
    .filter((p, i, a) => a.findIndex((k) => k.slug === p.slug) === i);

  // Expand each keystage with its associated subjects, filtering out duplicates for each programme
  const withSubjects = byKeystage.map((ks) => {
    const subjects = byPhase
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

        const subjectDisplayName =
          p.actions?.programme_field_overrides?.subject ??
          p.programme_fields.subject;

        const pathwayTitle = p.programme_fields.pathway ?? "";

        const title =
          subjectDisplayName + (pathwayTitle ? ` (${pathwayTitle})` : "");

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
          phaseSlug: phaseSlug === "foundation" ? "primary" : phaseSlug,
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

    const curriculumSubjects = subjects.filter((s) => !s.nonCurriculum);
    const nonCurriculumSubjects = subjects.filter((s) => s.nonCurriculum);

    return {
      ...ks,
      children: [...curriculumSubjects, ...nonCurriculumSubjects],
    };
  });

  return withSubjects;
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
  const programmesForKs = data.programmes
    // get all programmes for the given subject, keystage and pathway. There will be multiple per year, tier and examboard
    .filter((p) => {
      const { subject_slug, keystage_slug, pathway_slug } = p.programme_fields;
      return (
        keystage_slug === keystageSlug &&
        subject_slug === subjectSlug &&
        pathway_slug === pathwaySlug
      );
    })
    // filter down to unique programmes
    .filter(
      (p, i, a) =>
        a.findIndex((k) => k.programme_slug === p.programme_slug) === i,
    );
  const filteredProgrammesForKs = filterLegacyProgrammes(programmesForKs);

  return filteredProgrammesForKs.length;
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

// filter out legacy programmes when there are only 2 programmes and one is legacy
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

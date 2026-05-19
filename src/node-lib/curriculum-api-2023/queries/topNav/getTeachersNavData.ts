import { TopNavResponse, TeachersBrowse } from "./topNav.schema";

import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";

/**
 * Extracts exam board slug and title from a programme slug
 * Pattern: {subject}-secondary-{keystage}-{examboard}
 * Example: "biology-secondary-ks4-aqa" => { slug: "aqa", title: "AQA" }
 */
export const parseExamBoardFromProgrammeSlug = (
  programmeSlug: string,
): { slug: string; title: string } | null => {
  const parts = programmeSlug.split("-");

  const examBoardSlug = parts.at(-1);
  if (parts.length >= 4 && examBoardSlug) {
    // Convert slug to title (e.g., "aqa" => "AQA", "ocr" => "OCR")
    const title = examBoardSlug.toUpperCase();
    return { slug: examBoardSlug, title };
  }
  return null;
};

export const getExamBoardsForKS4Subject = ({
  data,
  keystageSlug,
  subjectSlug,
  pathwaySlug,
}: {
  data: TopNavResponse;
  keystageSlug: string;
  subjectSlug: string;
  pathwaySlug: string | null;
}): Array<{ slug: string; title: string; programmeSlug: string }> => {
  const matchingProgrammes = data.programmes
    .filter((p) => {
      const { subject_slug, keystage_slug, pathway_slug } = p.programme_fields;
      return (
        keystage_slug === keystageSlug &&
        subject_slug === subjectSlug &&
        pathway_slug === pathwaySlug
      );
    })
    .filter(
      (p, i, a) =>
        a.findIndex((k) => k.programme_slug === p.programme_slug) === i,
    );

  const hasNonLegacyProgramme = matchingProgrammes.some(
    (programme) =>
      programme.programme_fields.dataset !== "legacy" &&
      !isSlugLegacy(programme.programme_slug),
  );

  const programmesForKs = matchingProgrammes.filter((programme) => {
    if (!hasNonLegacyProgramme) {
      return true;
    }
    return (
      programme.programme_fields.dataset !== "legacy" &&
      !isSlugLegacy(programme.programme_slug)
    );
  });

  const examBoards = programmesForKs
    .map((p) => {
      const examBoard = parseExamBoardFromProgrammeSlug(p.programme_slug);
      return examBoard
        ? { ...examBoard, programmeSlug: p.programme_slug }
        : null;
    })
    .filter((eb, i, a) => eb && a.findIndex((e) => e?.slug === eb.slug) === i)
    .filter(
      (eb): eb is { slug: string; title: string; programmeSlug: string } =>
        eb !== null,
    );

  return examBoards;
};

export const getTeachersNavData = (
  teachersData: TopNavResponse,
  phaseSlug: "primary" | "secondary",
): TeachersBrowse => {
  const keystagesForPhase = getKeystages(teachersData, phaseSlug);

  return {
    slug: phaseSlug,
    title: `${phaseSlug[0]?.toUpperCase()}${phaseSlug.slice(1)}` as
      | "Primary"
      | "Secondary",
    children:
      phaseSlug === "primary"
        ? keystagesForPhase.concat(getKeystages(teachersData, "foundation"))
        : keystagesForPhase,
  };
};

const getKeystages = (
  data: TopNavResponse,
  phaseSlug: "primary" | "secondary" | "foundation",
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
      .filter((p, _, a) => {
        if (isSlugLegacy(p.programme_slug)) {
          const legacySubject = p.programme_fields.subject_slug;
          const legacyKeystage = p.programme_fields.keystage_slug;
          const nonLegacyProgramme = a.find(
            (p) =>
              p.programme_fields.subject_slug === legacySubject &&
              p.programme_fields.keystage_slug === legacyKeystage &&
              !isSlugLegacy(p.programme_slug),
          );

          if (nonLegacyProgramme) {
            return false;
          }
        }
        return true;
      })
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

        const examBoardsData =
          ks.slug === "ks4" && programmeCount > 1
            ? getExamBoardsForKS4Subject({
                data,
                keystageSlug: ks.slug,
                subjectSlug: p.programme_fields.subject_slug,
                pathwaySlug: p.programme_fields.pathway_slug,
              })
            : null;

        return {
          slug: p.programme_fields.subject_slug,
          title,
          nonCurriculum: Boolean(p.features.non_curriculum),
          programmeSlug: programmeCount > 1 ? null : p.programme_slug,
          programmeCount,
          subjectParentSlug: p.programme_fields.subject_parent_slug ?? null,
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
    )
    // filter out legacy programmes when there are only 2 programmes and one is legacy
    .filter((p, _, a) => {
      const onlyTwoProgrammes = a.length === 2;
      if (
        onlyTwoProgrammes &&
        a.some((prog) => prog.programme_fields.dataset === "legacy")
      ) {
        return p.programme_fields.dataset !== "legacy";
      }
      return true;
    });

  return programmesForKs.length;
};

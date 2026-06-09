import { TopNavResponse, TeachersBrowse } from "./topNav.schema";
import {
  getTeachersExamBoardNavHref,
  getTeachersSubjectNavHref,
} from "./getTeachersNavHrefs";

import { CurriculumPhaseOptions } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.query";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";

export const getExamBoardsForKS4Subject = ({
  data,
  keystageSlug,
  subjectSlug,
  pathwaySlug,
  subjectParent,
}: {
  data: TopNavResponse;
  keystageSlug: string;
  subjectSlug: string;
  pathwaySlug: string | null;
  subjectParent?: string | null;
}): TeachersBrowse[] => {
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

  const examboards: TeachersBrowse[] = programmesForKs.flatMap<TeachersBrowse>(
    (p) => {
      const { examboard, examboard_slug, tier_slug, tier_description } =
        p.programme_fields;

      const title = examboard && examboard_slug ? examboard : tier_description;
      return {
        title: title ?? "",
        slug: p.programme_slug,
        children: null,
        navItemProps: {
          type: "examboardNavItem",
          href: getTeachersExamBoardNavHref({
            subjectSlug,
            phaseSlug: p.programme_fields.phase_slug,
            subjectParent,
            tierSlug: tier_slug,
            examboardSlug: examboard_slug,
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
        },
      };
    },
  );

  return examboards;
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

  return {
    slug: phaseSlug,
    title: `${phaseSlug[0]?.toUpperCase()}${phaseSlug.slice(1)}` as
      | "Primary"
      | "Secondary",
    navItemProps: { type: "phaseNavItem" },
    children:
      phaseSlug === "primary"
        ? keystagesForPhase.concat(
            getKeystages(
              teachersData,
              "foundation",
              curriculumPhaseOptionsSubjects,
            ),
          )
        : keystagesForPhase,
  };
};

const getKeystages = (
  data: TopNavResponse,
  phaseSlug: "primary" | "secondary" | "foundation",
  curriculumPhaseOptionsSubjects: CurriculumPhaseOptions,
): TeachersBrowse[] => {
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
                subjectSlug,
                pathwaySlug,
                subjectParent,
              })
            : null;

        return {
          title,
          slug: subjectNavItem.slug,
          navItemProps: {
            href,
            type: "subjectNavItem" as const,
            nonCurriculum: subjectNavItem.nonCurriculum,
            programmeSlug: subjectNavItem.programmeSlug,
            programmeCount: subjectNavItem.programmeCount,
          },
          children: examBoardsData ?? null,
        };
      });

    const curriculumSubjects = subjects.filter(
      (s) => !s.navItemProps.nonCurriculum,
    );
    const nonCurriculumSubjects = subjects.filter(
      (s) => s.navItemProps.nonCurriculum,
    );

    return {
      title: ks.title,
      slug: ks.slug,
      navItemProps: {
        type: "keystageNavItem" as const,
        description: ks.description,
      },
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

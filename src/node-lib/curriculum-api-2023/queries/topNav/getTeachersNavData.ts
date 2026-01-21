import { TopNavResponse, TeachersBrowse } from "./topNav.schema";

export const getTeachersNavData = (
  teachersData: TopNavResponse,
  phaseSlug: "primary" | "secondary",
): TeachersBrowse => {
  const keystagesForPhase = getKeystages(teachersData, phaseSlug);

  return {
    phaseSlug: phaseSlug,
    phaseTitle: `${phaseSlug[0]?.toUpperCase()}${phaseSlug.slice(1)}`,
    keystages:
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
    return {
      ...ks,
      subjects: byPhase
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
        // Filter out edge case where only one pathway and no PFs exist for a subject at ks4
        .filter((p, _, a) => {
          if (p.programme_fields.pathway_slug) {
            const otherSlug =
              p.programme_fields.pathway_slug === "core" ? "gcse" : "core";
            const otherPathwayProgramme = a.find(
              (k) =>
                k.programme_fields.pathway_slug === otherSlug &&
                p.programme_fields.subject_slug ===
                  k.programme_fields.subject_slug,
            );

            return !!otherPathwayProgramme;
          } else {
            return true;
          }
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

          return {
            subjectSlug: p.programme_fields.subject_slug,
            title,
            nonCurriculum: Boolean(p.features.non_curriculum),
            programmeSlug: programmeCount > 1 ? null : p.programme_slug,
            programmeCount,
          };
        }),
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

  return programmesForKs.length;
};

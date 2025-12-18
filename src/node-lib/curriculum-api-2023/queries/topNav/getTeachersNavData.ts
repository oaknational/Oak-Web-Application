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
            a.findIndex((k) => k.programme_slug === p.programme_slug) === i,
        )
        .map((p) => ({
          subjectSlug: p.programme_fields.subject_slug,
          title: p.programme_fields.subject,
          nonCurriculum: Boolean(p.features.non_curriculum),
          programmeSlug: p.programme_slug,
          programmeCount: getProgrammeCount({
            data,
            keystageSlug: ks.slug,
            subjectSlug: p.programme_fields.subject_slug,
            pathwaySlug: p.programme_fields.pathway_slug,
          }),
        })),
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

import { TopNavResponse, TeachersBrowse } from "./topNav.schema";

export const getTeachersData = (
  teachersData: TopNavResponse,
  phaseSlug: "primary" | "secondary",
): TeachersBrowse => {
  // Get all programmes for the given phase
  const byPhase = teachersData.teachers.filter(
    (p) => p.programme_fields.phase_slug === phaseSlug,
  );

  // Get all keystages associated with that phase and reduce to unique values
  const byKeystage = byPhase
    .map((p) => ({
      slug: p.programme_fields.keystage_slug,
      title: p.programme_fields.keystage,
    }))
    .filter((p, i, a) => a.findIndex((k) => k.slug === p.slug) === i);

  // Expand each keystage with its associated subjects
  const withSubjects = byKeystage.map((ks) => {
    return {
      ...ks,
      subjects: byPhase
        .filter((p) => p.programme_fields.keystage_slug === ks.slug)
        .map((p) => ({
          slug: p.programme_fields.subject_slug,
          title: p.programme_fields.subject,
          nonCurriculum: Boolean(p.features.non_curriculum),
        })),
    };
  });

  return {
    phaseSlug: phaseSlug,
    phaseTitle: `${phaseSlug[0]?.toUpperCase()}${phaseSlug.slice(1)}`,
    keystages: withSubjects,
  };
};

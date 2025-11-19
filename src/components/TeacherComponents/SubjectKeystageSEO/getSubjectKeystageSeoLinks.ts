import { SubjectPathwayArray } from "@/pages/teachers/key-stages/[keyStageSlug]/subjects";
import { resolveOakHref } from "@/common-lib/urls";

export const getSubjectKeystageSeoLinks = (
  subjects: [SubjectPathwayArray, ...SubjectPathwayArray[]],
  keyStageSlug: string,
) => {
  return subjects.flatMap((subject) => {
    return subject.flatMap((programme) => {
      const hasProgrammes = programme.data.programmeCount > 1;
      const href = hasProgrammes
        ? resolveOakHref({
            page: "programme-index",
            keyStageSlug,
            subjectSlug: programme.slug,
          })
        : resolveOakHref({
            page: "unit-index",
            programmeSlug: programme.data.programmeSlug,
          });

      const subjectOverride =
        programme.data.actions.programme_field_overrides?.subject?.toLowerCase() ??
        "";

      const pathwayTitle = programme.data.pathwayTitle ?? "";

      const subtitle =
        pathwayTitle || subjectOverride
          ? ` (${pathwayTitle}${subjectOverride && " "}${subjectOverride})`
          : "";

      const label = `${keyStageSlug.toUpperCase()} ${programme.slug}${subtitle}`;
      return { href, label };
    });
  });
};

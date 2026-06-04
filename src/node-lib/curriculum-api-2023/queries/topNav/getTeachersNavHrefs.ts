import { SubjectsNavItem } from "./topNav.schema";

import { resolveOakHref } from "@/common-lib/urls";
import { getSubjectPhaseSlug } from "@/components/TeacherComponents/helpers/getSubjectPhaseSlug";
import { CurriculumPhaseOptions } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.query";
import {
  getTeacherSubjectPhaseSlug,
  resolveTeacherProgrammeSubjectPhaseSlug,
} from "@/utils/curriculum/slugs";

/**
 * Builds the units tab href for a teacher nav subject link.
 * Uses curriculum phase options to resolve incomplete slugs (e.g. default KS4
 * exam board). EYFS subjects link to the dedicated EYFS route instead.
 */
export function getTeachersSubjectNavHref({
  subject,
  keyStageSlug,
  phaseSlug,
  curriculumPhaseOptionsSubjects,
}: {
  subject: Pick<SubjectsNavItem, "slug" | "pathwaySlug" | "programmeSlug">;
  keyStageSlug?: string;
  phaseSlug: "primary" | "secondary";
  curriculumPhaseOptionsSubjects: CurriculumPhaseOptions;
}): string {
  if (keyStageSlug === "early-years-foundation-stage") {
    return resolveOakHref({
      page: "eyfs-page",
      subjectSlug: subject.slug,
    });
  }

  const subjectPhaseSlug = resolveTeacherProgrammeSubjectPhaseSlug(
    curriculumPhaseOptionsSubjects,
    {
      subjectSlug: subject.slug,
      phaseSlug,
      pathwaySlug: subject.pathwaySlug ?? null,
    },
  );

  return resolveOakHref({
    page: "teacher-programme",
    subjectPhaseSlug,
    tab: "units",
    query: keyStageSlug ? { keystages: keyStageSlug } : undefined,
  });
}

/**
 * Builds the units tab href for a KS4 exam board or tier panel button.
 */
export function getTeachersExamBoardNavHref({
  subjectSlug,
  phaseSlug,
  subjectParent,
  examboardSlug,
  tierSlug,
}: {
  subjectSlug: string;
  phaseSlug: string;
  subjectParent?: string | null;
  examboardSlug?: string | null;
  tierSlug?: string | null;
}): string {
  const subjectPhaseSlug = subjectParent
    ? getTeacherSubjectPhaseSlug({
        subjectSlug,
        phaseSlug,
        examboardSlug,
        pathwaySlug: null,
        subjectParentTitle: subjectParent,
      })
    : getSubjectPhaseSlug({
        subject: subjectSlug,
        phaseSlug,
        examBoardSlug: examboardSlug,
      });

  return resolveOakHref({
    page: "teacher-programme",
    subjectPhaseSlug,
    tab: "units",
    query: {
      keystages: "ks4",
      tiers: tierSlug ?? undefined,
      child_subjects: subjectParent ? subjectSlug : undefined,
    },
  });
}

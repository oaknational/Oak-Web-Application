import { isValidIconName } from "@oaknational/oak-components";

import type { NationalCurriculumInsightsRouteData } from "./getRouteData";

export const normaliseSubjectIcon = (
  subject: NationalCurriculumInsightsRouteData["subjects"][number],
) => {
  const preferred = `subject-${subject.slug}`;
  if (isValidIconName(preferred)) {
    return preferred;
  }

  const mapped = `subject-${subject.curriculumSubjectSlugs[0]}`;
  return isValidIconName(mapped) ? mapped : "question-mark";
};

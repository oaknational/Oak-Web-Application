import {
  keystageSlugs,
  examboardSlugs,
} from "@oaknational/oak-curriculum-schema";

import { OAK_SUBJECTS } from "./oakCurriculumData";

import {
  DirectMatch,
  SuggestedFilter,
} from "@/common-lib/schemas/search-intent";
import errorReporter from "@/common-lib/error-reporter";

export const getSuggestedFilters = (
  subject: string,
  directMatch: DirectMatch,
) => {
  const report = errorReporter("suggestedFilters");
  const suggestedFilters: SuggestedFilter[] = [];
  const oakSubject = OAK_SUBJECTS.find((s) => s.slug === subject);

  if (!oakSubject) {
    report(new Error("Invalid subject"), {
      severity: "warning",
      subject,
    });
    return suggestedFilters;
  }

  if (!directMatch.keyStage) {
    oakSubject.keyStages.forEach((ks) => {
      const parsed = keystageSlugs.parse(ks.slug);
      suggestedFilters.push({
        type: "key-stage" as const,
        value: parsed,
      });
    });
  }
  const includeExamboard =
    (directMatch.keyStage === "ks4" || directMatch.keyStage === null) &&
    (directMatch.year === "year-10" ||
      directMatch.year === "year-11" ||
      directMatch.year === null);

  if (!directMatch.examBoard && includeExamboard) {
    oakSubject.examBoards.forEach((eb) => {
      const parsed = examboardSlugs.parse(eb.slug);
      suggestedFilters.push({
        type: "exam-board" as const,
        value: parsed,
      });
    });
  }
  return suggestedFilters;
};

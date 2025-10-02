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

export const getSuggestedFiltersFromSubject = (
  subject: string,
  directMatch: DirectMatch | null,
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

  const includeKeystages =
    directMatch == null || (!directMatch.keyStage && directMatch.year === null);

  if (includeKeystages) {
    oakSubject.keyStages.forEach((ks) => {
      const parsed = keystageSlugs.parse(ks.slug);
      suggestedFilters.push({
        type: "key-stage" as const,
        value: parsed,
      });
    });
  }

  // We don't want to show suggestions for examboard filters if the search term includes
  // direct match for keystages or years that don't contain examboards
  const yearsForExamboards = [null, "year-10", "year-11"];
  const keystagesForExamboards = [null, "ks4"];

  const includeExamboard =
    directMatch === null ||
    (directMatch.examBoard === null &&
      keystagesForExamboards.includes(directMatch.keyStage) &&
      yearsForExamboards.includes(directMatch.year));

  if (includeExamboard) {
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

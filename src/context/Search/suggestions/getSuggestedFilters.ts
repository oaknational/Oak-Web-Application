import {
  keystageSlugs,
  examboardSlugs,
} from "@oaknational/oak-curriculum-schema";

import { OAK_SUBJECTS } from "./oakCurriculumData";

import {
  DirectMatch,
  SuggestedFilter,
} from "@/common-lib/schemas/search-intent";

export const getSuggestedFilters = (
  subject: string,
  directMatch: DirectMatch,
) => {
  const oakSubject = OAK_SUBJECTS.find((s) => s.slug === subject);
  if (!oakSubject) {
    // TODO: handle properly
    throw new Error("subject does not exist");
  }
  const suggestedFilters: SuggestedFilter[] = [];

  if (!directMatch.keyStage) {
    const keystagesForSubject = oakSubject.keyStages.map((ks) => ks.slug);
    keystagesForSubject.forEach((ks) => {
      const parsed = keystageSlugs.parse(ks);
      suggestedFilters.push({
        type: "key-stage" as const,
        value: parsed,
      });
    });
  }
  if (!directMatch.examBoard) {
    const examboardsForSubject = oakSubject.examBoards.map((eb) => eb.slug);
    examboardsForSubject.forEach((eb) => {
      const parsed = examboardSlugs.parse(eb);
      suggestedFilters.push({
        type: "exam-board" as const,
        value: parsed,
      });
    });
  }
  return suggestedFilters;
};

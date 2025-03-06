import { getTitleFromSlug } from "@/fixtures/shared/helper";
import { Subject } from "@/utils/curriculum/types";

const BASE_CHILD_SUBJECT: Subject = {
  subject_slug: "blank",
  subject: "Blank",
};

export function createChildSubject(partial: Partial<Subject> = {}) {
  const subject = getTitleFromSlug(partial?.subject_slug);
  return {
    ...BASE_CHILD_SUBJECT,
    ...(subject ? { subject } : {}),
    ...partial,
  };
}

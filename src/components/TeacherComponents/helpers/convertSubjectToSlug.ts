import { subjectSlugs } from "@oaknational/oak-curriculum-schema";
import z from "zod";

export function convertSubjectToSlug(
  subject: string,
): z.infer<typeof subjectSlugs> | undefined {
  if (subject === "Relationships, sex and health education") {
    return "rshe-pshe";
  }
  if (subject === "Art and design") {
    return "art";
  }

  const slug = subject
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[\\()\\[\]\\{\\}]/g, "")
    .replace(/-{2,}/g, "-")
    .toLocaleLowerCase();

  const parsedSlug = subjectSlugs.safeParse(slug);
  if (!parsedSlug.success) {
    return undefined;
  }
  return parsedSlug.data;
}

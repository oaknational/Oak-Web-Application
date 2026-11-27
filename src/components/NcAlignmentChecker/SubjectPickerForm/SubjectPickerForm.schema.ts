import { z } from "zod";

import { SUBJECTS } from "./formData";

export const ncAlignmentCheckerSubjectPickerFormValuesSchema = z
  .object({
    subjectSlug: z.string().nonempty({ error: "Choose a subject to continue" }),
    yearOrKeyStageSlug: z.string(),
  })
  // Only require a year or key stage once a subject is chosen, as the second
  // field isn't rendered until then. Otherwise the first submit stores a
  // key stage error that appears as soon as the field mounts.
  .superRefine(({ subjectSlug, yearOrKeyStageSlug }, ctx) => {
    const subject = SUBJECTS.find((s) => s.slug === subjectSlug);
    if (!subject) return;

    const { noun, options } = subject.yearOrKeyStageQuestion;

    if (!options.some((o) => o.slug === yearOrKeyStageSlug)) {
      ctx.addIssue({
        code: "custom",
        path: ["yearOrKeyStageSlug"],
        message: `Choose a ${noun} to continue`,
      });
    }
  });

export type NcAlignmentCheckerSubjectPickerFormValues = z.infer<
  typeof ncAlignmentCheckerSubjectPickerFormValuesSchema
>;

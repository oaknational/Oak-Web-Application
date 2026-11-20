import { z } from "zod";
export const ncAlignmentCheckerSubjectPickerFormValuesSchema = z
  .object({
    subjectSlug: z.string().nonempty({ error: "Choose a subject to continue" }),
    keyStageSlug: z.string(),
  })
  // Only require a key stage once a subject is chosen, as the key stage
  // field isn't rendered until then. Otherwise the first submit stores a
  // key stage error that appears as soon as the field mounts.
  .superRefine(({ subjectSlug, keyStageSlug }, ctx) => {
    if (subjectSlug && !keyStageSlug) {
      ctx.addIssue({
        code: "custom",
        path: ["keyStageSlug"],
        message: "Choose a key stage to continue",
      });
    }
  });

export type NcAlignmentCheckerSubjectPickerFormValues = z.infer<
  typeof ncAlignmentCheckerSubjectPickerFormValuesSchema
>;

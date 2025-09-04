import { z } from "zod";

const ERRORS = {
  school: "Select school, type ‘homeschool’ or tick ‘My school isn’t listed’",
  email: "Please enter a valid email address",
  terms: "Accept terms and conditions to continue",
} as const;

export const schoolIdSchema = z
  .string({
    errorMap: () => ({
      message: ERRORS.school,
    }),
  })
  .min(1, ERRORS.school);

export const emailSchema = z
  .string()
  .email({
    message: ERRORS.email,
  })
  .optional()
  .or(z.literal(""));

export const termsAndConditionsSchema = z.literal(true, {
  errorMap: () => ({
    message: ERRORS.terms,
  }),
});

const schoolCombinedSchema = z
  .object({
    schoolId: schoolIdSchema.optional(),
    schoolNotListed: z.boolean(),
  })
  .superRefine((values, context) => {
    if (!values.schoolNotListed && values.schoolId === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: ERRORS.school,
        path: ["schoolId"],
      });
    }
  });

const submitPartSchema = z.object({
  email: emailSchema,
  termsAndConditions: termsAndConditionsSchema,
});

// See following for why this is required
//
//  - <https://timjames.dev/blog/validating-dependent-fields-with-zod-and-react-hook-form-2fa9#gotchas>
//  - <https://github.com/colinhacks/zod/issues/479#issuecomment-1536233005>
export const submitSchema = z.intersection(
  schoolCombinedSchema,
  submitPartSchema,
);

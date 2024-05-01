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

export const submitSchema = z
  .object({
    schoolId: schoolIdSchema.optional(),
    schoolNotListed: z.boolean(),
    email: emailSchema,
    termsAndConditions: termsAndConditionsSchema,
  })
  .superRefine((values, context) => {
    if (!values.schoolNotListed && values.schoolId === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: ERRORS.school,
        path: ["school"],
      });
    }
  });
